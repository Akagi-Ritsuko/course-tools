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

export class ZsglExam extends EventListener<MoocEvent> implements MoocTaskSet {
  protected questionList: Array<any> = [];
  protected startButton: HTMLElement;
  protected submitButton: HTMLSpanElement;
  protected nextButton: HTMLSpanElement;
  protected taskList: Array<Task> = [];
  protected taskIndex: number = 0;

  public Init(): Promise<any> {
    return new Promise(async (resolve) => {
      const checkExistTimer = setInterval(async () => {
        const startButton = Array.from(
          document.querySelectorAll(".MuiButton-label")
        ).find((span) => {
          span.textContent.includes("返回");
        });
        if (startButton) {
          startButton.addEventListener("click", async () => {
            console.log("按钮被点击，开始考试");
            // 开始考试，再考一次
          });
          console.log(startButton, "init当前按钮");
          clearInterval(checkExistTimer);
        }
      });
      await this.hookQuestionDetailRequests().then(() => {
        this.OperateCard();
      });
      const buttonInitTimer = setInterval(async () => {
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

        if (this.submitButton && this.nextButton) {
          clearInterval(buttonInitTimer);
          console.log(this.submitButton, "交卷按钮");
          console.log(this.nextButton, "下一题按钮");
        }
      });
      console.log("按钮初始化成功");
    });
  }
  protected hookQuestionDetailRequests(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      await hookHttpRequest(
        "queryQuestionDetail.do",
        (response, self) => {
          Application.App.log.Debug("原始响应数据", response);
          if (response) {
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
            const SECRET_KEY = "3c26d0badca24176";
            const IV = "39934fc88c73430e";
            const responseData = decrypt(response, SECRET_KEY, IV);
            this.questionList = JSON.parse(JSON.parse(responseData).body);
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
    Application.App.log.Info("开始操作任务卡");
    // const checkTimer = setInterval(async () => {});
    const loadedFlagValue = this.questionList[0];
    const currentQuestionText = loadedFlagValue.questionText;
    const sectionRespList = loadedFlagValue.sectionRespList;
    const answerList = sectionRespList
      .filter((item: any) => {
        return item.isCorrect === "Y";
      })
      .map((item: any) => item.sectionText);
    Application.App.log.Info("题目：", currentQuestionText);
    answerList.forEach((item: any, index: number) => {
      Application.App.log.Info(`答案${index}：`, item);
    });
    for (let index = 0; index < this.questionList.length; index++) {
      let value = this.questionList[index];
      let task: ZsglTask = TaskFactory.CreateQuestionTask(value);
      if (!task) {
        continue;
      }
      task.jobIndex = index; // 设置任务索引
      this.taskList.push(task);
      task.addEventListener("complete", () => {
        console.log("任务完成", index);
        this.callEvent("questionTaskComplete", index, task);
        if (index === this.questionList.length - 1) {
          this.examComplete(); // 当所有任务完成时触发examComplete事件
        }
      });
      await task.Init();
    }
    console.log("任务列表", this.taskList);
    this.taskIndex = 0;
    this.callEvent("reload");
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
      const currentQuestionText = this.taskinfo?.questionText;
      const sectionRespList = this.taskinfo?.sectionRespList;
      const answerList = sectionRespList
        .filter((item: any) => {
          return item.isCorrect === "Y";
        })
        .map((item: any) => item.sectionText);
      Application.App.log.Info("题目：", currentQuestionText);
      answerList.forEach((item: any, index: number) => {
        Application.App.log.Info("答案：", index, item);
      });
    });
  }
  public Init(): Promise<any> {
    return new Promise<void>(async (resolve, reject) => {
      let nextButtonFlag = true;
      const checkExistTimer = setInterval(async () => {
        console.log("开始检查按钮");
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
        if (this.nextButton &&nextButtonFlag&&this.jobIndex===0) {
          this.nextButton.addEventListener("click", async () => {
            console.log("按钮被点击，开始考试");
            this.callEvent("complete");
            // 开始考试，再考一次
          });
          nextButtonFlag = false;
          if(this.nextButton && this.lastButton && this.submitButton){
            clearInterval(checkExistTimer);
          }
        }
      }, 500);
    });
  }
  public Type(): TaskType {
    return "exam";
  }
}
