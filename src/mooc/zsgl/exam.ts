/**
 * 导入所需的模块和类
 */
import { QueryQuestions } from "@App/internal/app/topic";
import { Task, TaskType } from "@App/internal/app/task";
import { Application } from "@App/internal/application";
import { CssBtn, hookHttpRequest } from "./utils/utils";
import { createBtn, protocolPrompt } from "@App/internal/utils/utils";
import { NewChromeServerMessage } from "@App/internal/utils/message";
import { createStorageHandler } from "./utils/utils";
import { ZsglTask, ZsglTaskControlBar } from "./task";
import { TaskFactory } from "./factory";
import { Mooc, MoocTaskSet, MoocEvent } from "@App/internal/app/mooc";
import { EventListener } from "@App/internal/utils/event";
import { prototype } from "vue/types/umd";
import { AES, enc, mode, pad } from "crypto-js";

/**
 * ZsglExam 类，用于在线考试功能
 * 继承自 EventListener<MoocEvent> 并实现 MoocTaskSet 接口
 */
export class ZsglExam extends EventListener<MoocEvent> implements MoocTaskSet {
  // 存储题目列表
  protected questionList: Array<any> = [];
  // 开始考试按钮
  protected startButton: HTMLElement;
  // 提交试卷按钮
  protected submitButton: HTMLSpanElement;
  // 下一题按钮
  protected nextButton: HTMLSpanElement;
  // 任务列表
  protected taskList: Array<Task> = [];
  // 当前任务索引
  protected taskIndex: number = 0;

  /**
   * 初始化考试
   * @returns 返回一个Promise对象
   */
  public Init(): Promise<any> {
    return new Promise<void>(async (resolve) => {
      // 定时检查是否存在返回按钮
      const checkExistTimer = setInterval(async () => {
        // 查找返回按钮
        const startButton = Array.from(
          document.querySelectorAll(".MuiButton-label")
        ).find((span) => {
          span.textContent.includes("返回");
        });
        // 如果找到按钮，添加点击事件
        if (startButton) {
          startButton.addEventListener("click", async () => {
            console.log("按钮被点击，开始考试");
            // 开始考试，再考一次
          });
          console.log(startButton, "init当前按钮");
          clearInterval(checkExistTimer);
        }
      });
      // 钩子获取题目详情的请求
      await this.hookQuestionDetailRequests().then(async () => {
        await this.OperateCard();
        resolve();
      });
      // 定时检查按钮是否初始化完成
      const buttonInitTimer = setInterval(async () => {
        const buttonList = Array.from(
          document.querySelectorAll(".MuiButton-label")
        );
        // 查找交卷按钮
        this.submitButton = Array.from(document.querySelectorAll("div")).find(
          (span) => {
            return span.textContent.includes("交卷");
          }
        ) as HTMLElement;
        // 查找下一题按钮
        this.nextButton = buttonList.find((span) => {
          return span.textContent.includes("下一题");
        }) as HTMLSpanElement;
        // 如果两个按钮都找到，清除定时器
        if (this.submitButton && this.nextButton) {
          this.nextButton.addEventListener("click", async () => {
            console.log("下一题按钮被点击");
            await this.answerMessage(this.questionList);
          });
          clearInterval(buttonInitTimer);
          console.log(this.submitButton, "交卷按钮");
          console.log(this.nextButton, "下一题按钮");
        }
      });
      console.log("按钮初始化成功");
    });
  }
  public async answerMessage(questionList: any) {
    setTimeout(async () => {
      const allP = Array.from(document.querySelectorAll(".MuiPaper-root *"));
      for (const question of questionList) {
        const matchedP = Array.from(allP).find((p) => {
          const questionTextList = question.questionText.split(/<p>/i);
          let questionText = questionTextList.length > 1 
            ? questionTextList[questionTextList.length - 1] 
            : questionTextList[0];
          questionText=questionText.replace(/<\/p>/i, "");
          console.log(p.textContent,questionText, "questionText");
          return p.textContent.includes(questionText);
        }
          
        );
        console.log(question.questionText, "matchedP");
        console.log(matchedP, "matchedP");
        if (!matchedP) continue;
        const correctAnswers = question.sectionRespList
          .filter((section: any) => section.isCorrect === "Y")
          .map((section: any) => section.sectionText);

        if (correctAnswers.length) {
          Application.App.log.Info(`题目:${question.questionText}`);
          Application.App.log.Info(`正确答案集`, correctAnswers.join(" | "));
        }
      }
    }, 1000);
  }
  /**
   * 钩子获取题目详情的请求
   * @returns 返回一个Promise对象
   */
  protected hookQuestionDetailRequests(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      // 使用钩子拦截请求
      await hookHttpRequest(
        "queryQuestionDetail.do",
        (response, self) => {
          Application.App.log.Debug("原始响应数据", response);
          if (response) {
            // 解密函数
            const decrypt = function(
              encryptedData: string,
              key: string,
              iv: string
            ): string {
              try {
                // 2. 配置解密参数
                const decryptionConfig = {
                  iv: enc.Utf8.parse(iv),
                  mode: mode.CBC,
                  padding: pad.Pkcs7,
                };

                // 3. 执行解密
                // CryptoJS.AES.decrypt 接受的第一个参数可以是 CipherParams 对象或 Base64 字符串
                // 第二个参数是经过 parse 的密钥 WordArray
                const decrypted = AES.decrypt(
                  encryptedData,
                  enc.Utf8.parse(key),
                  decryptionConfig
                );

                // 4. 将解密结果（WordArray）转换为 UTF-8 字符串
                return decrypted.toString(enc.Utf8);
              } catch (error) {
                console.error("解密失败，请检查密钥、IV或密文:", error);
              }
            };
            // 设置解密密钥和IV
            const SECRET_KEY = "3c26d0badca24176";
            const IV = "39934fc88c73430e";
            // 解密响应数据
            const responseData = decrypt(response, SECRET_KEY, IV);
            // 解析题目列表
            this.questionList = JSON.parse(JSON.parse(responseData).body);
            // 如果题目列表不为空，则resolve
            if (this.questionList.length !== 0) {
              resolve();
            }
            Application.App.log.Debug("解密后的响应数据", this.questionList);
            console.log("解密后的响应数据", JSON.stringify(this.questionList));
          }
        },
        this
      );
    });
  }
  // 停止
  public Stop(): Promise<any> {
    return Promise.resolve();
  }

  // 返回下一题
  public Next(): Promise<Task> {
    return new Promise((resolve) => {
      if (this.taskList.length > this.taskIndex) {
        resolve(this.taskList[this.taskIndex]);
        console.log("返回下一题Next", this.taskIndex);
        return this.taskIndex++;
      } else {
        this.callEvent("examTaskComplete");
      }
    });
  }
  public examComplete() {
    console.log("考试完成");
  }
  public async OperateCard() {
    console.log("开始操作任务卡");
    const loadedFlagValue = this.questionList[0];
    await this.answerMessage(this.questionList);
    for (let index = 0; index < this.questionList.length; index++) {
      let value = this.questionList;
      let task: ZsglTask = TaskFactory.CreateQuestionTask(value);
      if (!task) {
        continue;
      }
      task.jobIndex = index; // 设置任务索引
      this.taskList.push(task);
      task.addEventListener("complete", () => {
        console.log("任务完成", this.taskIndex);
        const currentTask = this.taskList[this.taskIndex];
        this.callEvent("questionTaskComplete", this.taskIndex, currentTask);
        if (this.taskIndex === this.questionList.length - 1) {
          this.examComplete(); // 当所有任务完成时触发examComplete事件
        }
      });
      await task.Init();
    }
    console.log("任务列表", this.taskList);
    this.taskIndex = 0;
    this.callEvent("examReload");
  }

  // 设置任务点位置
  public SetTaskPointer(index: number): void {
    this.taskIndex = index;
    return;
  }
}
export class ZsglQuestionTask extends ZsglTask {
  nextButton: HTMLSpanElement;
  submitButton: HTMLElement;
  lastButton: HTMLElement;

  public Start(): Promise<any> {
    return new Promise<void>(async (resolve, reject) => {
      console.log("开始任务", this.taskinfo);
      // const currentQuestionText = this.taskinfo?.questionText;
      // const sectionRespList = this.taskinfo?.sectionRespList;
      // const answerList = sectionRespList
      //   .filter((item: any) => {
      //     return item.isCorrect === "Y";
      //   })
      //   .map((item: any) => item.sectionText);
      // Application.App.log.Info("题目：", currentQuestionText);
      // answerList.forEach((item: any, index: number) => {
      //   Application.App.log.Info("答案：", index, item);
      // });
      resolve();
    });
  }
  public Init(): Promise<any> {
    return new Promise<void>(async (resolve, reject) => {
      let nextButtonFlag = true;
      const checkExistTimer = setInterval(async () => {
        console.log("开始检查按钮", this.jobIndex);
        const buttonList = Array.from(
          document.querySelectorAll(".MuiButton-label")
        );
        this.submitButton = Array.from(document.querySelectorAll("div")).find(
          (span) => {
            return span.textContent.includes("交卷");
          }
        ) as HTMLElement;
        this.nextButton = buttonList.find((span) => {
          return span.textContent.includes("下一题");
        }) as HTMLSpanElement;
        this.lastButton = buttonList.find((span) => {
          return span.textContent.includes("上一题");
        }) as HTMLSpanElement;
        if (this.nextButton && nextButtonFlag && this.jobIndex === 0) {
          this.nextButton.addEventListener("click", async () => {
            console.log("按钮被点击，开始考试");
            this.callEvent("complete");
            // 开始考试，再考一次
          });
          nextButtonFlag = false;
        }
        if ((this.nextButton || this.lastButton) && this.submitButton) {
          clearInterval(checkExistTimer);
        }
        resolve();
      }, 500);
    });
  }
  public Type(): TaskType {
    return "exam";
  }
}
