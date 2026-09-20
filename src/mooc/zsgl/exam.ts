/*
 * @Author: guotao
 * @Date: 2025-03-09
 * @LastEditors: guotao
 * @LastEditTime: 2026-09-20 11:44:40
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
import { exportExamAnswers, stripHtml } from "./utils/answer-exporter";

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
  /** 是否已导出过答案，防止重复导出 */
  private answerExported: boolean = false;
  /** 全量题目累积表：questionId -> QuestionInfo（跨批次累积，first-seen 优先，保留已破解答案） */
  protected allQuestionMap: Map<string, QuestionInfo> = new Map();
  /** 批次破解串行链：题目分批返回，串行执行避免共享策略实例状态被并发清空 */
  private autoAnswerChain: Promise<void> = Promise.resolve();
  /** Init Promise 是否已落定（仅第一批触发 resolve/reject，后续批次仅累积数据） */
  private initHookSettled: boolean = false;
  /** 已安排破解的题目ID：批次重复到达（翻页回退重新请求）时跳过，避免重复破解 */
  private crackScheduledIds: Set<string> = new Set();

  /**
   * 初始化考试
   * @returns 返回一个Promise对象
   */
  public Init(): Promise<any> {
    return new Promise<void>(async (resolve) => {
      // 页面一开始就监听 queryNewExamPaper 请求，避免错过页面加载初期发出的请求
      this.examPaperHookPromise = this.hookQueryNewExamPaper();
      // 提前消费 rejection，防止未走到自动答题时的 unhandled promise rejection
      this.examPaperHookPromise.catch((e) => {
        Application.App.log.Warn("获取考试参数失败(Init)", e);
      });
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
          Application.App.log.Info(`题目:${stripHtml(question.questionText)}`);
          Application.App.log.Info(
            `正确答案集`,
            correctAnswers.map((text) => stripHtml(text)).join(" | "),
          );
        }
      }
    }, 1000);
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
                // 题目按每批10题分页返回：合并进全量表，而非整体替换
                const batch = self.adaptQuestionData(rawData);
                if (batch.length !== 0) {
                  self.mergeQuestionBatch(batch);

                  // 仅批内未内嵌正确答案、且未安排过破解的题目需要破解
                  const needsCrack: QuestionInfo[] = [];
                  for (const q of batch) {
                    if (
                      q.sectionRespList &&
                      q.sectionRespList.some((s) => s.isCorrect === "Y")
                    ) {
                      continue;
                    }
                    if (self.crackScheduledIds.has(q.questionId)) {
                      continue;
                    }
                    self.crackScheduledIds.add(q.questionId);
                    needsCrack.push(q);
                  }

                  // 串行入链破解；链尾尝试自动导出（全部题目集齐后才会真正导出）
                  self.autoAnswerChain = self.autoAnswerChain
                    .then(() =>
                      needsCrack.length > 0
                        ? self.crackQuestions(needsCrack)
                        : Promise.resolve(),
                    )
                    .then(() => {
                      self.maybeExportAllAnswers();
                      if (!self.initHookSettled) {
                        self.initHookSettled = true;
                        resolve();
                      }
                    })
                    .catch((error) => {
                      Application.App.log.Error("批次自动答题失败", error);
                      if (!self.initHookSettled) {
                        self.initHookSettled = true;
                        reject(error);
                      }
                    });

                  Application.App.log.Debug(
                    "解密后的响应数据",
                    JSON.stringify(self.questionList),
                  );
                }
              } catch (e) {
                Application.App.log.Error("解析题目数据失败", e);
                if (!self.initHookSettled) {
                  self.initHookSettled = true;
                  reject(e);
                }
              }
            }
          }
        },
        this,
      );
    });
  }

  /**
   * 合并一批题目到全量表
   * 按 questionId 去重，first-seen 优先，避免重复请求覆盖已破解的答案；
   * 合并后重建 questionList，使展示与导出拿到全量题目
   * @param batch 本批题目
   */
  private mergeQuestionBatch(batch: QuestionInfo[]): void {
    for (const question of batch) {
      if (!this.allQuestionMap.has(question.questionId)) {
        this.allQuestionMap.set(question.questionId, question);
      }
    }
    this.questionList = Array.from(this.allQuestionMap.values());
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
    return new Promise<void>((resolve, reject) => {
      // 超时兜底：防止解析分支永不落定导致 crackQuestions 静默挂起
      const timeoutId = setTimeout(() => {
        reject(new Error("等待queryNewExamPaper响应超时"));
      }, ZSGL_CONSTANTS.START_TIMEOUT_MS);

      hookHttpRequest(
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
                clearTimeout(timeoutId);
                resolve();
              } else {
                clearTimeout(timeoutId);
                // 字段不完整时 reject，避免调用方 await 永久挂起
                reject(
                  new Error("queryNewExamPaper响应字段不完整，无法继续"),
                );
              }
            }
          } catch (e) {
            clearTimeout(timeoutId);
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
    // 两种答案来源（题目详情内嵌/探测破解）都已回写到 questionList，统一在此导出
    this.tryExportAnswers();
  }

  /**
   * 尝试导出考试答案（幂等，只会导出一次）
   * 自动导出发生在全部题目集齐且破解完成后（maybeExportAllAnswers），
   * 此处为交卷时的兜底导出：未集齐时导出已收集部分（未破解题在文件中标注）。
   */
  private tryExportAnswers(): void {
    if (this.answerExported) {
      return;
    }
    this.answerExported = true;
    try {
      exportExamAnswers(this.examId, this.testNo, this.questionList);
    } catch (e) {
      // 导出异常不应阻断后续的关窗等流程
      Application.App.log.Error("导出考试答案失败", e);
    }
  }

  /**
   * 全部题目集齐时自动导出（幂等，交卷兜底导出仍有效）
   * 由每批破解链的链尾调用，最后一批完成时触发完整导出
   */
  private maybeExportAllAnswers(): void {
    const expected = this.questionIdList.length;
    // 总数未知（queryNewExamPaper 失败）或题目未集齐时，交给交卷兜底导出
    if (expected === 0 || this.allQuestionMap.size < expected) {
      return;
    }
    this.tryExportAnswers();
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
      task.addEventListener("complete", (isSubmit: boolean) => {
        // 交卷（确认弹窗内）：考试结束，导出答案并结束任务链
        if (isSubmit) {
          Application.App.log.Info("点击交卷，考试结束", task.jobIndex);
          this.examComplete();
          // 让任务链终止：置越界索引并触发 examTaskComplete 关窗，
          // 延迟一小段让页面提交请求先发出
          this.taskIndex = this.taskList.length;
          setTimeout(() => {
            this.callEvent("examTaskComplete");
          }, 500);
          return;
        }

        Application.App.log.Debug("任务完成", task.jobIndex);
        // 用任务自身索引上报：框架会 SetTaskPointer(jobIndex+1) 推进到下一题。
        // 不能上报 this.taskIndex——Next() 预取已使 taskIndex 指向下一任务，
        // 框架再 +1 会跳题，且 taskList[taskIndex] 在末题会越界为 undefined。
        // 注意：分批加载下「答完本批最后一题」≠ 考试结束，不在此触发 examComplete；
        // 真正的结束信号是确认弹窗内点击交卷（isSubmit 分支）。
        this.taskIndex = task.jobIndex;
        this.callEvent("questionTaskComplete", task.jobIndex, task);
      });
      await task.Init();
    }

    Application.App.log.Debug("任务列表", this.taskList);
    this.taskIndex = 0;
    // examReload 需在框架(mooc.ts runMoocTask)注册监听之后触发，否则事件丢失、任务链永不启动。
    // Init() 在 OperateCard 返回后才 resolve，runMoocTask 于 resolve 后同步注册监听，
    // 因此用宏任务(setTimeout)延时触发，保证监听已就绪。
    setTimeout(() => {
      Application.App.log.Debug("触发 examReload");
      this.callEvent("examReload");
    }, 0);
  }

  /**
   * 破解本批题目（由批次钩子串行调用，同一时刻只有一批在破解）
   * 单选/判断题用排除法，多选题枚举组合；结果回写全量 questionList
   * @param questions 本批需要破解的题目
   */
  protected async crackQuestions(questions: QuestionInfo[]): Promise<void> {
    const startTime = Date.now();
    Application.App.log.Info("自动答题流程开始");

    // 检查是否需要获取考试参数
    if (!this.examId || !this.attemptId || !this.testNo) {
      Application.App.log.Info("正在获取考试参数...");
      // 复用 Init 时提前注册的钩子Promise，避免重复注册导致永远等待
      if (!this.examPaperHookPromise) {
        this.examPaperHookPromise = this.hookQueryNewExamPaper();
        this.examPaperHookPromise.catch(() => {
          /* 已在下面统一处理 */
        });
      }
      try {
        await this.examPaperHookPromise;
      } catch (e) {
        Application.App.log.Warn("获取考试参数失败，自动答题跳过", e);
        return;
      }
    }

    // 分类本批题目
    const singleChoiceQuestions = questions.filter(
      (q) => q.questionType === "S" || q.questionType === "T",
    );
    const multipleChoiceQuestions = questions.filter(
      (q) => q.questionType === "M",
    );

    const singleCount = singleChoiceQuestions.length;
    const multipleCount = multipleChoiceQuestions.length;

    Application.App.log.Info(
      `自动答题开始，单选题 ${singleCount} 题，多选题 ${multipleCount} 题`,
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
          this.testNo,
        );
        const result = await this.singleChoiceStrategy.crackSingleChoiceBatch(
          singleChoiceQuestions,
        );
        // 将确认的答案回写到 questionList
        this.updateQuestionListWithSingleChoiceAnswers();
        const singleEndTime = Date.now();
        const singleTime = singleEndTime - singleStartTime;

        Application.App.log.Info(
          `单选题答题完成，耗时 ${singleTime}ms，找到答案 ${result.successCount} 题`,
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
        const results = await this.startMultipleChoiceAnswering(
          multipleChoiceQuestions,
        );
        const multipleEndTime = Date.now();
        const multipleTime = multipleEndTime - multipleStartTime;

        // 统计成功数量
        const successCount = results.filter((r) => r.isCompleted).length;

        Application.App.log.Info(
          `多选题答题完成，耗时 ${multipleTime}ms，找到答案 ${successCount} 题`,
        );
      } catch (error) {
        Application.App.log.Error("多选题答题失败", error);
      }
    }

    const totalEndTime = Date.now();
    const totalTime = totalEndTime - startTime;
    Application.App.log.Info(`本批自动答题完成，总耗时 ${totalTime}ms`);

    // 自动答题完成后刷新展示当前页题目的题目与答案
    // 导出由链尾的 maybeExportAllAnswers / 交卷兜底负责，此处不导出
    await this.answerMessage(this.questionList);
  }

  /**
   * 启动多选题答题流程
   * @param questions 本批多选题列表
   * @returns 返回答题状态列表
   */
  protected async startMultipleChoiceAnswering(
    questions: QuestionInfo[],
  ): Promise<MultipleChoiceState[]> {
    // 初始化多选题答题策略
    this.multipleChoiceStrategy = new MultipleChoiceAnswerStrategy(
      this.examId,
      this.attemptId,
      this.testNo,
    );

    if (questions.length === 0) {
      Application.App.log.Info("没有需要处理的多选题");
      return [];
    }

    // 执行多选题批量答题
    const results = await this.multipleChoiceStrategy.crackMultipleChoiceBatch(
      questions,
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
    results: MultipleChoiceState[],
  ): void {
    for (const state of results) {
      if (state.isCompleted && state.finalAnswer.length > 0) {
        const question = this.questionList.find(
          (q) => q.questionId === state.questionId,
        );
        if (question) {
          // 更新选项的正确性标记
          for (const section of question.sectionRespList) {
            if (state.finalAnswer.includes(section.sectionId)) {
              section.isCorrect = "Y";
              Application.App.log.Info(
                `更新多选题 ${state.questionId} 的正确答案: ${section.sectionText}`,
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
        (q) => q.questionId === questionId,
      );
      if (!question) {
        continue;
      }
      for (const section of question.sectionRespList) {
        section.isCorrect = section.sectionId === answerId ? "Y" : "N";
      }
      Application.App.log.Info(
        `更新单选题 ${questionId} 的正确答案: ${answerId}`,
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
    /** 是否已触发过complete，防止同一任务重复上报 */
    private completed: boolean = false;
    /** 存在未抵消的"上一题"点击：紧随其后的"下一题"只是返回原题，不算推进 */
    private pendingReturn: boolean = false;

    public Start(): Promise<any> {
        return new Promise<void>((resolve) => {
            Application.App.log.Debug("开始任务", this.taskinfo);

            if (this.completed) {
                resolve();
                return;
            }

            // 事件委托到document（捕获阶段）：SPA切题会重建按钮DOM，
            // 直接绑在按钮上会随元素销毁失效；委托到document始终有效
            Application.App.log.Debug(
                "[交卷监听] 任务已启动，注册document点击委托",
                this.jobIndex,
            );
            const handler = (e: MouseEvent) => {
                if (this.completed) {
                    return;
                }
                const target = e.target as HTMLElement | null;
                Application.App.log.Debug("[交卷监听] 点击捕获", {
                    tag: target?.tagName,
                    class: String(target?.className || "").slice(0, 80),
                    text: (target?.textContent || "").slice(0, 20),
                });
                if (!target || !target.closest) {
                    return;
                }

                // 兼容多种按钮结构：MUI 标准按钮(root/label)、自定义按钮(交卷按钮可能不是 .MuiButton-label)
                const btn = target.closest(
                    [
                        ZSGL_CONSTANTS.SELECTORS.MUI_BUTTON_ROOT,
                        ZSGL_CONSTANTS.SELECTORS.MUI_BUTTON_LABEL,
                        "button",
                        "[role=button]",
                    ].join(","),
                ) as HTMLElement | null;

                if (!btn) {
                    return;
                }

                const text = btn.textContent || "";
                Application.App.log.Debug("[交卷监听] 命中按钮", {
                    tag: btn.tagName,
                    class: String(btn.className || "").slice(0, 80),
                    text: text.slice(0, 20),
                });

                // "上一题"点击：记录待抵消状态
                if (text.includes(ZSGL_CONSTANTS.BUTTON_TEXT.PREV_QUESTION)) {
                    this.pendingReturn = true;
                    return;
                }

                const isNext = text.includes(
                    ZSGL_CONSTANTS.BUTTON_TEXT.NEXT_QUESTION,
                );
                const isSubmit = text.includes(
                    ZSGL_CONSTANTS.BUTTON_TEXT.SUBMIT_EXAM,
                );

                if (!isNext && !isSubmit) {
                    return;
                }

                // 交卷链路：右上角交卷 → 第一层弹窗"交卷" → 确认弹窗"交卷" → 考试结束。
                // 只把"确认弹窗"内的交卷按钮视为结束信号，避免第一层弹窗点击时误结束
                if (isSubmit) {
                    const dialog = btn.closest(".MuiDialog-paper");
                    const dialogText = dialog?.textContent || "";
                    const isConfirmDialog =
                        dialog && /是否(?:确定)?交卷|确认交卷/.test(dialogText);
                    Application.App.log.Debug("[交卷监听] 交卷按钮判定", {
                        hasDialog: !!dialog,
                        dialogText: dialogText.slice(0, 50),
                        isConfirmDialog,
                    });
                    if (!isConfirmDialog) {
                        return;
                    }
                }

                // 有未抵消的"上一题"：本次"下一题"视为返回原题，抵消一次不推进
                // （"交卷"不受抵消影响，始终视为完成）
                if (this.pendingReturn && isNext) {
                    this.pendingReturn = false;
                    Application.App.log.Debug(
                        "上一题返回抵消，当前题任务继续",
                        this.jobIndex,
                    );
                    return;
                }

                this.completed = true;
                this.done = true;
                Application.App.log.Debug(
                    "按钮被点击，当前题任务完成",
                    this.jobIndex,
                    "isSubmit",
                    isSubmit,
                );
                // 透传 isSubmit：交卷=结束考试，下一题=推进到下一题
                this.callEvent("complete", isSubmit);
            };
            this.addManagedListener(document, "click", handler, true);

            resolve();
        });
    }

    /** 停止任务：清理定时器与托管监听 */
    public Stop(): Promise<void> {
        this.timerManager.clearAll();
        this.runCleanup();
        return Promise.resolve();
    }

    public Init(): Promise<any> {
        return new Promise<void>(async (resolve, reject) => {
            // 超时兜底：页面结构异常时也放行，避免 OperateCard 永久卡死
            const timeoutId = setTimeout(() => {
                Application.App.log.Warn(
                    "等待考试按钮超时，强制放行",
                    this.jobIndex,
                );
                this.timerManager.clearInterval("checkButtons");
                resolve();
            }, 10000);

            // 单题考试页面只有"交卷"按钮、没有"下一题/上一题"，放行条件需放宽；
            // 多题考试保持"导航按钮 + 交卷"同时存在才就绪
            const isSingleQuestion =
                Array.isArray(this.taskinfo) && this.taskinfo.length === 1;

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

                // 按钮点击监听已移至Start()中的事件委托，Init只负责等待页面就绪
                const ready = isSingleQuestion
                    ? !!(this.submitButton || this.nextButton || this.lastButton)
                    : !!(this.nextButton || this.lastButton) && !!this.submitButton;

                if (ready) {
                    clearTimeout(timeoutId);
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
