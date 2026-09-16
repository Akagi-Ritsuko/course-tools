/*
 * @Author: guotao
 * @Date: 2025-03-09
 * @LastEditors: guotao
 * @LastEditTime: 2026-09-16 16:41:52
 * @FilePath: \course-tools\src\mooc\zsgl\exam.ts
 * @Description: zsgl 考试模块
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */
import { Task, TaskType } from "@App/internal/app/task";
import { Application } from "@App/internal/application";
import { CssBtn, hookHttpRequest, TimerManager, findElementByText } from "./utils/utils";
import { createBtn, protocolPrompt } from "@App/internal/utils/utils";
import { NewChromeServerMessage } from "@App/internal/utils/message";
import { ZsglTask, ZsglTaskControlBar } from "./task";
import { TaskFactory } from "./factory";
import { Mooc, MoocTaskSet, MoocEvent } from "@App/internal/app/mooc";
import { EventListener } from "@App/internal/utils/event";
import { AES, enc, mode, pad } from "crypto-js";
import { QuestionInfo, QuestionSection } from "./types";
import { ZSGL_CONSTANTS } from "./constants";
import {
  MultipleChoiceAnswerStrategy,
  MultipleChoiceState,
  AnswerProgress,
} from "./utils/exam-answer-strategy";
import {
  SingleChoiceAnswerStrategy,
  AnswerState,
  BatchAnswerResult,
} from "./exam-answer-strategy";

/**
 * ZsglExam 类，用于在线考试功能
 * 继承自 EventListener<MoocEvent> 并实现 MoocTaskSet 接口
 */
export class ZsglExam extends EventListener<MoocEvent> implements MoocTaskSet {
  /** 存储题目列表 */
  protected questionList: QuestionInfo[] = [];
  /** 开始考试按钮 */
  protected startButton: HTMLElement;
  /** 提交试卷按钮 */
  protected submitButton: HTMLSpanElement;
  /** 下一题按钮 */
  protected nextButton: HTMLSpanElement;
  /** 任务列表 */
  protected taskList: Array<Task> = [];
  /** 当前任务索引 */
  protected taskIndex: number = 0;
  /** 定时器管理器 */
  private timerManager: TimerManager = new TimerManager();
  /** 考试尝试ID */
  protected attemptId: string = "";
  /** 考试编号 */
  protected testNo: string = "";
  /** 题目ID列表 */
  protected questionIdList: string[] = [];
  /** 考试ID */
  protected examId: string = "";
  /** 单选题答题策略实例 */
  protected singleChoiceStrategy: SingleChoiceAnswerStrategy = new SingleChoiceAnswerStrategy();
  /** 多选题答题策略实例 */
  protected multipleChoiceStrategy: MultipleChoiceAnswerStrategy | null = null;
  /** 多选题答题结果 */
  protected multipleChoiceResults: MultipleChoiceState[] = [];
  /** 新考试试卷钩子的Promise，Init时提前注册 */
  protected examPaperHookPromise: Promise<void> | null = null;

  /**
   * 初始化考试
   * @returns 返回一个Promise对象
   */
  public Init(): Promise<any> {
    return new Promise<void>(async (resolve) => {
      // 页面一开始就监听 queryNewExamPaper 请求，避免错过页面加载初期发出的请求
      this.examPaperHookPromise = this.hookQueryNewExamPaper();
      this.setupReturnButton();
      await this.hookQuestionDetailRequests();
      await this.OperateCard();
      this.setupNavigationButtons();
      resolve();
    });
  }

  /** 设置返回按钮 */
  private setupReturnButton(): void {
    this.timerManager.setInterval(
      "checkReturnBtn",
      async () => {
        const startButton = Array.from(
          document.querySelectorAll(ZSGL_CONSTANTS.SELECTORS.MUI_BUTTON_LABEL),
        ).find((span) => {
          return span.textContent?.includes(ZSGL_CONSTANTS.BUTTON_TEXT.RETURN);
        });

        if (startButton) {
          startButton.addEventListener("click", async () => {
            Application.App.log.Info("点击了返回按钮");
          });
          Application.App.log.Debug("找到返回按钮", startButton);
          this.timerManager.clearInterval("checkReturnBtn");
        }
      },
      ZSGL_CONSTANTS.CHECK_INTERVAL_MS,
    );
  }

  /** 设置导航按钮 */
  private setupNavigationButtons(): void {
    this.timerManager.setInterval(
      "checkNavBtns",
      async () => {
        const buttonList = Array.from(
          document.querySelectorAll(ZSGL_CONSTANTS.SELECTORS.MUI_BUTTON_LABEL),
        );

        this.submitButton = Array.from(
          document.querySelectorAll("div"),
        ).find((span) =>
          span.textContent?.includes(ZSGL_CONSTANTS.BUTTON_TEXT.SUBMIT_EXAM),
        ) as HTMLSpanElement;

        this.nextButton = buttonList.find((span) => {
          return span.textContent?.includes(
            ZSGL_CONSTANTS.BUTTON_TEXT.NEXT_QUESTION,
          );
        }) as HTMLSpanElement;

        if (this.submitButton && this.nextButton) {
          this.nextButton.addEventListener("click", async () => {
            Application.App.log.Debug("下一题按钮被点击");
            await this.answerMessage(this.questionList);
          });
          this.timerManager.clearInterval("checkNavBtns");
          Application.App.log.Debug("按钮初始化成功", {
            submit: this.submitButton,
            next: this.nextButton,
          });
        }
      },
      ZSGL_CONSTANTS.CHECK_INTERVAL_MS,
    );
  }

  /**
   * 显示答案消息
   * @param questionList 题目列表
   */
  public async answerMessage(questionList: QuestionInfo[]): Promise<void> {
    setTimeout(async () => {
      const allP = Array.from(
        document.querySelectorAll(
          `${ZSGL_CONSTANTS.SELECTORS.MUI_PAPER_ROOT} *`,
        ),
      );

      for (const question of questionList) {
        const matchedP = this.findMatchingElement(allP, question);

        if (!matchedP) continue;

        const correctAnswers = question.sectionRespList
          .filter((section: QuestionSection) => section.isCorrect === "Y")
          .map((section: QuestionSection) => section.sectionText);

        if (correctAnswers.length) {
          Application.App.log.Info(
            `题目:${this.stripHtml(question.questionText)}`,
          );
          Application.App.log.Info(
            `正确答案集`,
            correctAnswers.map((text) => this.stripHtml(text)).join(" | "),
          );
        }
      }
    }, 1000);
  }

  /**
   * 去除字符串中的HTML标签，避免通知条渲染时打断颜色样式
   * @param html 含HTML的文本
   * @returns 纯文本
   */
  private stripHtml(html: string): string {
    return (html || "")
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  /**
   * 查找匹配的元素
   * @param elements 元素列表
   * @param question 题目信息
   */
  private findMatchingElement(
    elements: Element[],
    question: QuestionInfo,
  ): Element | null {
    return (
      elements.find((p) => {
        const questionTextList = question.questionText.split(/<p>/i);
        let questionText =
          questionTextList.length > 1
            ? questionTextList[questionTextList.length - 1]
            : questionTextList[0];
        questionText = questionText.replace(/<\/p>/i, "");
        return p.textContent?.includes(questionText);
      }) || null
    );
  }

  /**
   * 钩子获取题目详情的请求
   * @returns 返回一个Promise对象
   */
  protected hookQuestionDetailRequests(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      await hookHttpRequest(
        ZSGL_CONSTANTS.HTTP_ENDPOINTS.QUERY_QUESTION_DETAIL,
        (response, self) => {
          Application.App.log.Debug("原始响应数据", response);
          if (response) {
            const decrypted = self.decryptData(response);
            if (decrypted) {
              try {
                const rawData = JSON.parse(JSON.parse(decrypted).body);
                self.questionList = self.adaptQuestionData(rawData);
                if (self.questionList.length !== 0) {
                  // 检查是否有 isCorrect 字段
                  const hasCorrectAnswer = self.questionList.every(
                    (q) =>
                      q.sectionRespList &&
                      q.sectionRespList.some((s) => s.isCorrect === "Y"),
                  );
                  
                  if (!hasCorrectAnswe) {
                    // 启动自动答题
                    Application.App.log.Info(
                      "未检测到正确答案，启动自动答题流程",
                    );
                    self
                      .startAutoAnswering()
                      .then(() => {
                        resolve();
                      })
                      .catch((error) => {
                        Application.App.log.Error("自动答题流程失败", error);
                        reject(error);
                      });
                  } else {
                    Application.App.log.Info("已检测到正确答案，跳过自动答题");
                    resolve();
                  }
                }
                Application.App.log.Debug(
                  "解密后的响应数据",
                  JSON.stringify(self.questionList),
                );
              } catch (e) {
                Application.App.log.Error("解析题目数据失败", e);
                reject(e);
              }
            }
          }
        },
        this,
      );
    });
  }

  /**
   * 适配题目数据
   * @param rawData 原始数据
   * @returns 适配后的题目列表
   */
  private adaptQuestionData(rawData: any[]): QuestionInfo[] {
    return rawData.map((item) => {
      // 提取题目基本信息
      const questionInfo: QuestionInfo = {
        questionId: item.questionId || "",
        questionText: item.questionText || "",
        questionType: this.validateQuestionType(item.questionType),
        sectionRespList: this.adaptSectionData(item.sectionRespList || []),
      };

      return questionInfo;
    });
  }

  /**
   * 验证题目类型
   * @param type 题目类型
   * @returns 返回有效的题目类型
   */
  private validateQuestionType(type: string): "S" | "M" | "T" {
    // 题目类型：S: 单选, M: 多选, T: 判断题
    if (type === "S" || type === "M" || type === "T") {
      return type;
    }
    // 默认返回单选题
    Application.App.log.Warn(`未知的题目类型: ${type}, 默认为单选题`);
    return "S";
  }

  /**
   * 适配选项数据
   * @param sections 选项列表
   * @returns 适配后的选项列表
   */
  private adaptSectionData(sections: any[]): QuestionSection[] {
    return sections.map((section) => ({
      sectionId: section.sectionId || "",
      sectionText: section.sectionText || "",
      isCorrect: section.isCorrect || "N",
    }));
  }

  /**
   * 钩子获取新考试试卷的请求
   * @returns 返回一个Promise对象
   */
  protected hookQueryNewExamPaper(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      await hookHttpRequest(
        ZSGL_CONSTANTS.HTTP_ENDPOINTS.QUERY_NEW_EXAM_PAPER,
        (response, self) => {
          Application.App.log.Debug("queryNewExamPaper原始响应数据", response);
          if (!response) {
            return;
          }
          try {
            // 该接口可能返回明文JSON对象，也可能返回AES加密字符串
            let data: any = response;
            if (typeof data === "string") {
              const text = data.trim();
              if (text.startsWith("{")) {
                data = JSON.parse(text);
              } else {
                const decrypted = self.decryptData(text);
                if (!decrypted) {
                  return;
                }
                data = JSON.parse(decrypted);
              }
            }

            let body = data?.body;
            if (typeof body === "string") {
              body = JSON.parse(body);
            }

            if (body) {
              self.examId = body.examId || "";
              self.attemptId = body.attemptId || "";
              self.testNo = body.testNo || "";
              self.questionIdList = body.questionIdList || [];

              Application.App.log.Debug("queryNewExamPaper解析结果", {
                examId: self.examId,
                attemptId: self.attemptId,
                testNo: self.testNo,
                questionIdList: self.questionIdList,
              });

              if (
                self.examId &&
                self.attemptId &&
                self.testNo &&
                self.questionIdList.length > 0
              ) {
                resolve();
              } else {
                Application.App.log.Warn(
                  "queryNewExamPaper响应字段不完整，无法继续",
                  body,
                );
              }
            }
          } catch (e) {
            Application.App.log.Error("解析queryNewExamPaper数据失败", e);
            reject(e);
          }
        },
        this,
      );
    });
  }

  /**
   * 解密数据
   * @param encryptedData 加密数据
   */
  private decryptData(encryptedData: string): string | null {
    try {
      const decryptionConfig = {
        iv: enc.Utf8.parse(ZSGL_CONSTANTS.AES_CONFIG.IV),
        mode: mode.CBC,
        padding: pad.Pkcs7,
      };

      const decrypted = AES.decrypt(
        encryptedData,
        enc.Utf8.parse(ZSGL_CONSTANTS.AES_CONFIG.SECRET_KEY),
        decryptionConfig,
      );

      return decrypted.toString(enc.Utf8);
    } catch (error) {
      Application.App.log.Error("解密失败，请检查密钥、IV或密文:", error);
      return null;
    }
  }

  /** 停止 */
  public Stop(): Promise<any> {
    this.timerManager.clearAll();
    return Promise.resolve();
  }

  /** 返回下一题 */
  public Next(): Promise<Task> {
    return new Promise((resolve) => {
      if (this.taskList.length > this.taskIndex) {
        resolve(this.taskList[this.taskIndex]);
        Application.App.log.Debug("返回下一题Next", this.taskIndex);
        return this.taskIndex++;
      } else {
        this.callEvent("examTaskComplete");
      }
    });
  }

  /** 考试完成 */
  public examComplete(): void {
    Application.App.log.Info("考试完成");
  }

  /** 操作任务卡 */
  public async OperateCard(): Promise<void> {
    Application.App.log.Debug("开始操作任务卡");
    await this.answerMessage(this.questionList);

    for (let index = 0; index < this.questionList.length; index++) {
      const value = this.questionList;
      const task = TaskFactory.CreateQuestionTask(value);

      if (!task) {
        continue;
      }

      task.jobIndex = index;
      this.taskList.push(task);
      task.addEventListener("complete", () => {
        Application.App.log.Debug("任务完成", this.taskIndex);
        const currentTask = this.taskList[this.taskIndex];
        this.callEvent("questionTaskComplete", this.taskIndex, currentTask);
        if (this.taskIndex === this.questionList.length - 1) {
          this.examComplete();
        }
      });
      await task.Init();
    }

    Application.App.log.Debug("任务列表", this.taskList);
    this.taskIndex = 0;
    this.callEvent("examReload");
  }

  /**
   * 启动自动答题流程
   * @returns 返回一个Promise对象
   */
  protected async startAutoAnswering(): Promise<void> {
    const startTime = Date.now();
    Application.App.log.Info("自动答题流程开始");

    // 检查是否需要获取考试参数
    if (!this.examId || !this.attemptId || !this.testNo) {
      Application.App.log.Info("正在获取考试参数...");
      // 复用 Init 时提前注册的钩子Promise，避免重复注册导致永远等待
      if (!this.examPaperHookPromise) {
        this.examPaperHookPromise = this.hookQueryNewExamPaper();
      }
      await this.examPaperHookPromise;
    }

    // 分类题目
    const singleChoiceQuestions = this.questionList.filter(
      q => q.questionType === "S" || q.questionType === "T"
    );
    const multipleChoiceQuestions = this.questionList.filter(
      q => q.questionType === "M"
    );

    const singleCount = singleChoiceQuestions.length;
    const multipleCount = multipleChoiceQuestions.length;

    Application.App.log.Info(
      `自动答题开始，单选题 ${singleCount} 题，多选题 ${multipleCount} 题`
    );

    // 处理单选题
    if (singleCount > 0) {
      const singleStartTime = Date.now();
      Application.App.log.Info("开始处理单选题...");

      try {
        // 初始化单选/判断题答题策略并执行批量破解
        this.singleChoiceStrategy.init(
          this.examId,
          this.attemptId,
          this.testNo
        );
        const result = await this.singleChoiceStrategy.crackSingleChoiceBatch(
          singleChoiceQuestions
        );
        // 将确认的答案回写到 questionList
        this.updateQuestionListWithSingleChoiceAnswers();
        const singleEndTime = Date.now();
        const singleTime = singleEndTime - singleStartTime;

        Application.App.log.Info(
          `单选题答题完成，耗时 ${singleTime}ms，找到答案 ${result.successCount} 题`
        );
      } catch (error) {
        Application.App.log.Error("单选题答题失败", error);
      }
    }

    // 处理多选题
    if (multipleCount > 0) {
      const multipleStartTime = Date.now();
      Application.App.log.Info("开始处理多选题...");

      try {
        const results = await this.startMultipleChoiceAnswering();
        const multipleEndTime = Date.now();
        const multipleTime = multipleEndTime - multipleStartTime;

        // 统计成功数量
        const successCount = results.filter(r => r.isCompleted).length;

        Application.App.log.Info(
          `多选题答题完成，耗时 ${multipleTime}ms，找到答案 ${successCount} 题`
        );
      } catch (error) {
        Application.App.log.Error("多选题答题失败", error);
      }
    }

    const totalEndTime = Date.now();
    const totalTime = totalEndTime - startTime;
    Application.App.log.Info(`自动答题全部完成，总耗时 ${totalTime}ms`);

    // 自动答题完成后刷新展示当前页题目的题目与答案
    await this.answerMessage(this.questionList);
  }

  /**
   * 启动多选题答题流程
   * @returns 返回答题状态列表
   */
  protected async startMultipleChoiceAnswering(): Promise<MultipleChoiceState[]> {
    // 初始化多选题答题策略
    this.multipleChoiceStrategy = new MultipleChoiceAnswerStrategy(
      this.examId,
      this.attemptId,
      this.testNo
    );

    // 获取所有多选题
    const multipleChoiceQuestions = this.questionList.filter(
      q => q.questionType === "M"
    );

    if (multipleChoiceQuestions.length === 0) {
      Application.App.log.Info("没有需要处理的多选题");
      return [];
    }

    // 执行多选题批量答题
    const results = await this.multipleChoiceStrategy.crackMultipleChoiceBatch(
      multipleChoiceQuestions
    );

    // 更新 questionList
    this.updateQuestionListWithMultipleChoiceAnswers(results);

    return results;
  }

  /**
   * 更新题目列表中的多选题答案
   * @param results 答题状态列表
   */
  private updateQuestionListWithMultipleChoiceAnswers(
    results: MultipleChoiceState[]
  ): void {
    for (const state of results) {
      if (state.isCompleted && state.finalAnswer.length > 0) {
        const question = this.questionList.find(
          q => q.questionId === state.questionId
        );
        if (question) {
          // 更新选项的正确性标记
          for (const section of question.sectionRespList) {
            if (state.finalAnswer.includes(section.sectionId)) {
              section.isCorrect = "Y";
              Application.App.log.Info(
                `更新多选题 ${state.questionId} 的正确答案: ${section.sectionText}`
              );
            } else {
              section.isCorrect = "N";
            }
          }
        }
      }
    }
  }

  /**
   * 更新题目列表中的单选题/判断题答案
   */
  private updateQuestionListWithSingleChoiceAnswers(): void {
    const confirmedAnswers = this.singleChoiceStrategy.getConfirmedAnswers();

    for (const [questionId, answerId] of confirmedAnswers) {
      const question = this.questionList.find(
        q => q.questionId === questionId
      );
      if (!question) {
        continue;
      }
      for (const section of question.sectionRespList) {
        section.isCorrect =
          section.sectionId === answerId ? "Y" : "N";
      }
      Application.App.log.Info(
        `更新单选题 ${questionId} 的正确答案: ${answerId}`
      );
    }
  }

  /** 设置任务点位置 */
  public SetTaskPointer(index: number): void {
    this.taskIndex = index;
  }
}

/**
 * ZsglQuestionTask 题目任务类
 */
export class ZsglQuestionTask extends ZsglTask {
    nextButton: HTMLSpanElement;
    submitButton: HTMLElement;
    lastButton: HTMLElement;
    private timerManager: TimerManager = new TimerManager();

    public Start(): Promise<any> {
        return new Promise<void>(async (resolve, reject) => {
            Application.App.log.Debug("开始任务", this.taskinfo);
            resolve();
        });
    }

    public Init(): Promise<any> {
        return new Promise<void>(async (resolve, reject) => {
            let nextButtonFlag = true;
            
            this.timerManager.setInterval("checkButtons", async () => {
                Application.App.log.Debug("开始检查按钮", this.jobIndex);
                
                const buttonList = Array.from(
                    document.querySelectorAll(ZSGL_CONSTANTS.SELECTORS.MUI_BUTTON_LABEL)
                );
                
                this.submitButton = Array.from(document.querySelectorAll("div")).find(
                    (span) => span.textContent?.includes(ZSGL_CONSTANTS.BUTTON_TEXT.SUBMIT_EXAM)
                ) as HTMLElement;
                
                this.nextButton = buttonList.find((span) => {
                    return span.textContent?.includes(ZSGL_CONSTANTS.BUTTON_TEXT.NEXT_QUESTION);
                }) as HTMLSpanElement;
                
                this.lastButton = buttonList.find((span) => {
                    return span.textContent?.includes(ZSGL_CONSTANTS.BUTTON_TEXT.PREV_QUESTION);
                }) as HTMLSpanElement;

                if (this.nextButton && nextButtonFlag && this.jobIndex === 0) {
                    this.nextButton.addEventListener("click", async () => {
                        Application.App.log.Debug("按钮被点击，开始考试");
                        this.callEvent("complete");
                    });
                    nextButtonFlag = false;
                }
                
                if ((this.nextButton || this.lastButton) && this.submitButton) {
                    this.timerManager.clearInterval("checkButtons");
                    resolve();
                }
            }, ZSGL_CONSTANTS.CHECK_INTERVAL_MS);
        });
    }

    public Type(): TaskType {
        return "exam";
    }
}
