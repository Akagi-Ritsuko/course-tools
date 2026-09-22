/*
 * @Description: 三节课 课后题任务
 * hook GET /study/0/{courseId}/questions 取 answer(响应直接含答案字段),
 * ai-quiz 组件出现时自动选中正确项 → 提交 → 依 nextFlag/completedFlag 推进
 * 仅作答有 answer 的客观题(RADIO/MULTI);开放性问题跳过不阻塞
 *
 * Copyright (c) 2026 by lzlj, All Rights Reserved.
 */
import { Application } from "@App/internal/application";
import { SanjiekeTaskBase } from "./task";
import { QuestionInfo, SanjiekeTaskInfo } from "./types";
import { SANJIEKE_CONSTANTS } from "./constants";
import { parseStudyUrl } from "./utils/utils";

/**
 * 课后题缓存:courseId → 题目列表(由 study 的 questions 钩子写入)
 * questions 接口无 lessonId,响应跟随当前页面课时上下文,
 * 课时切换(整页跳转)后缓存自然被新响应覆盖
 */
const questionCache: Map<string, QuestionInfo[]> = new Map();

/** 判定对象是否具备题目特征(与 spec 样例一致:question/options/answer 字段) */
function isQuestionLike(q: any): boolean {
  return (
    q &&
    typeof q === "object" &&
    ("question" in q || "questionText" in q || "title" in q) &&
    ("options" in q || "answer" in q)
  );
}

/**
 * 从响应中提取题目(不依赖包裹层字段名):
 * 实测两种形态 —— 1) 单题对象: {code,msg,data:{id,type,question,options,answer,...}}(AI 视频问答);
 * 2) 题目数组(课程级 questions 接口)。按特征字段深度搜索,最多下探 4 层
 */
function extractQuestions(
  response: any,
  depth: number = 0,
): QuestionInfo[] | null {
  if (depth > 4 || response === null || typeof response !== "object") {
    return null;
  }
  if (Array.isArray(response)) {
    return response.length > 0 && isQuestionLike(response[0])
      ? (response as QuestionInfo[])
      : null;
  }
  // 单题对象(AI 视频问答的 data 直接就是题目)
  if (isQuestionLike(response)) {
    return [response as QuestionInfo];
  }
  for (const key of Object.keys(response)) {
    const found = extractQuestions(response[key], depth + 1);
    if (found) {
      return found;
    }
  }
  return null;
}

/** 缓存 questions 接口响应(study 钩子调用) */
export function cacheSanjiekeQuestions(courseId: string, response: any): void {
  const questions = extractQuestions(response);
  if (!questions) {
    Application.App.log.Warn(
      "[三节课课后题] questions 响应结构无法识别,跳过缓存,响应预览:",
      JSON.stringify(response)?.substring(0, 300),
    );
    return;
  }
  questionCache.set(courseId, questions);
  Application.App.log.Info(
    `[三节课课后题] 已缓存 ${questions.length} 道课后题(含答案 ${
      questions.filter((q) => Array.isArray(q.answer) && q.answer.length > 0)
        .length
    } 道)`,
  );
}

/** 获取当前课程缓存的课后题 */
export function getSanjiekeQuestions(courseId: string): QuestionInfo[] {
  return questionCache.get(courseId) || [];
}

/**
 * SanjiekeQuiz 课后题任务
 * 等待 ai-quiz 组件 → 选中正确项 → 提交 → 推进;无课后题/无答案/开关关闭时不阻塞
 */
export class SanjiekeQuiz extends SanjiekeTaskBase {
  public taskinfo: SanjiekeTaskInfo;
  public done: boolean;

  constructor(taskinfo: SanjiekeTaskInfo) {
    super();
    this.taskinfo = taskinfo;
    this.done = false;
  }

  public Type(): "topic" {
    return "topic";
  }

  public Done(): boolean {
    return this.done;
  }

  public Init(): Promise<any> {
    return Promise.resolve(true);
  }

  public Start(): Promise<any> {
    return new Promise<void>((resolve) => {
      Application.App.log.Info(
        `[三节课课后题] 开始任务: ${this.taskinfo.lessonName ||
          this.taskinfo.lessonId}`,
      );

      // 入口先查缓存题目(视频期间已由钩子缓存):无题立即完成,
      // 不空等组件超时 —— ended 后无题目则直接进入下一课时
      const cached = getSanjiekeQuestions(this.taskinfo.courseId);
      if (!Application.App.config.quiz_auto_answer) {
        Application.App.log.Info(
          "[三节课课后题] quiz_auto_answer 已关闭,请人工作答,任务跳过不阻塞",
        );
        this.finish();
        resolve();
        return;
      }
      if (cached.filter((q) => this.isAnswerable(q)).length === 0) {
        Application.App.log.Info(
          "[三节课课后题] 本课时无课后题(缓存无题目),直接进入下一课时",
        );
        this.finish();
        resolve();
        return;
      }

      // 轮询等待 ai-quiz 组件出现(课时视频结束后才渲染),超时视为本课时无课后题
      let attempts = 0;
      const maxAttempts = Math.floor(
        SANJIEKE_CONSTANTS.QUIZ_WAIT_TIMEOUT_MS /
          SANJIEKE_CONSTANTS.CHECK_INTERVAL_MS,
      );
      const waitQuiz = () => {
        if (this.done) {
          resolve();
          return;
        }
        // SPA 换课守卫:URL 已切到其他课时时放弃作答,避免答错课时的题
        const currentLessonId = parseStudyUrl()?.lessonId;
        if (
          currentLessonId &&
          currentLessonId !== String(this.taskinfo.lessonId)
        ) {
          Application.App.log.Info(
            `[三节课课后题] URL 课时(${currentLessonId})与任务课时(${this.taskinfo.lessonId})不一致,放弃作答`,
          );
          this.finish();
          resolve();
          return;
        }
        attempts++;
        const quizRoot = document.querySelector(
          SANJIEKE_CONSTANTS.SELECTORS.QUIZ_ROOT,
        );
        if (quizRoot) {
          Application.App.log.Info("[三节课课后题] 检测到 ai-quiz 组件");
          this.runQuizFlow();
          resolve();
          return;
        }
        if (attempts >= maxAttempts) {
          Application.App.log.Info(
            "[三节课课后题] 等待超时,本课时无课后题组件,跳过",
          );
          this.finish();
          resolve();
          return;
        }
        this.timerManager.setTimeout(
          "waitQuiz",
          waitQuiz,
          SANJIEKE_CONSTANTS.CHECK_INTERVAL_MS,
        );
      };
      waitQuiz();
    });
  }

  /** 执行答题主流程 */
  private runQuizFlow(): void {
    // 已本地作答的题目 id 集合(防止重复提交同一题)
    const answeredIds = new Set<number>();
    // 连续无新题轮次(提交后站点才会拉取/渲染下一题,每轮重读缓存)
    let idleRounds = 0;
    // 硬性轮次上限(防 DOM 状态异常死循环)
    const maxRounds = 12;
    let rounds = 0;

    const answerRound = () => {
      if (this.done) {
        return;
      }
      const quizRoot = document.querySelector(
        SANJIEKE_CONSTANTS.SELECTORS.QUIZ_ROOT,
      );
      const submitBtn = document.querySelector(
        SANJIEKE_CONSTANTS.SELECTORS.QUIZ_SUBMIT,
      ) as HTMLElement;
      // 组件消失(课时流程已推进)→ 完成
      if (!quizRoot && !submitBtn) {
        Application.App.log.Info("[三节课课后题] 课后题组件已消失,视为完成");
        this.finish();
        return;
      }

      rounds++;
      if (rounds > maxRounds) {
        Application.App.log.Warn("[三节课课后题] 达到答题轮次上限,熔断退出");
        this.finish();
        return;
      }

      // 每轮重读缓存:提交后站点才会请求并渲染下一题,新题由钩子增量写入缓存
      const questions = getSanjiekeQuestions(this.taskinfo.courseId);
      const unanswered = questions.filter(
        (q) => this.isAnswerable(q) && !answeredIds.has(q.id),
      );

      if (unanswered.length === 0) {
        // 无新题:连续 3 轮(约 7.5s)没有新题目且组件未消失 → 视为答完
        idleRounds++;
        if (idleRounds >= 3) {
          Application.App.log.Info(
            "[三节课课后题] 连续多轮无新题目,课后题处理完成",
          );
          this.finish();
          return;
        }
      } else {
        idleRounds = 0;
      }

      // 定位当前题目并选中正确项(有新题才作答)
      const answered =
        unanswered.length > 0
          ? this.answerCurrentQuestion(unanswered, answeredIds)
          : { clicked: false, question: null as QuestionInfo | null };
      this.timerManager.setTimeout(
        "quizNext",
        () => {
          // 提交(仅当成功选中答案且按钮可用;开放题/无法定位时直接进入下一轮检测)
          if (answered.clicked) {
            const btn = document.querySelector(
              SANJIEKE_CONSTANTS.SELECTORS.QUIZ_SUBMIT,
            ) as HTMLButtonElement;
            if (btn && !btn.disabled) {
              btn.click();
              Application.App.log.Info("[三节课课后题] 已点击提交按钮");
              // completedFlag=true 表示本次是最后一题,提交后答题环节即结束
              if (answered.question?.completedFlag === true) {
                Application.App.log.Info(
                  "[三节课课后题] 已完成最后一题(completedFlag=true),课后题任务结束",
                );
                this.finish();
                return;
              }
            } else {
              Application.App.log.Warn(
                "[三节课课后题] 提交按钮不可用(选中可能未生效),下一轮重试",
              );
            }
          }
          this.timerManager.setTimeout(
            "quizNext",
            () => {
              // 提交后站点出现「继续挑战」按钮,点击后站点拉取下一题;
              // 无论点击成败都继续既有轮次检测(idle 启发式兜底)
              this.clickContinueChallenge();
              answerRound();
            },
            SANJIEKE_CONSTANTS.QUIZ_SUBMIT_INTERVAL_MS,
          );
        },
        SANJIEKE_CONSTANTS.QUIZ_OPTION_SELECT_DELAY_MS,
      );
    };
    answerRound();
  }

  /** 是否可作答的客观题(有 answer 字段) */
  private isAnswerable(q: QuestionInfo): boolean {
    return (
      Array.isArray(q.answer) &&
      q.answer.length > 0 &&
      typeof q.type === "string" &&
      q.type.toUpperCase() !== "TEXT" &&
      q.type.toUpperCase() !== "SUBJECT"
    );
  }

  /**
   * 定位当前展示的题目,选中正确选项
   * @returns clicked 是否成功选中(选中后才允许提交);question 为本次定位到的题目,
   *          找不到题或不可作答时为 null
   */
  private answerCurrentQuestion(
    questions: QuestionInfo[],
    answeredIds: Set<number>,
  ): { clicked: boolean; question: QuestionInfo | null } {
    const quizRoot = document.querySelector(
      SANJIEKE_CONSTANTS.SELECTORS.QUIZ_ROOT,
    ) as HTMLElement;
    if (!quizRoot) {
      return { clicked: false, question: null };
    }
    const rootText = quizRoot.textContent || "";

    // 优先按题干文本匹配缓存题目;匹配失败则取首个未作答题
    let current =
      questions.find(
        (q) => q.question && rootText.includes(q.question.substring(0, 20)),
      ) || questions.find((q) => !answeredIds.has(q.id));
    if (!current || !this.isAnswerable(current)) {
      Application.App.log.Info(
        "[三节课课后题] 当前题目无答案(开放性问题)或已全部处理,跳过作答",
      );
      return { clicked: false, question: null };
    }

    const optionEls = this.getOptionElements(quizRoot);
    if (optionEls.length === 0) {
      //   Application.App.log.Warn("[三节课课后题] 未找到可点击的选项元素");
      return { clicked: false, question: current };
    }

    // 依答案字母定位选项并点击;MULTI 多答案逐个点击
    // 实测 DOM: .quiz-list > li,文本自带字母前缀(如 "B.紧急与重要"),故文本前缀匹配优先
    let clicked = false;
    for (const letter of current.answer!) {
      const upper = letter.trim().toUpperCase();
      let target: HTMLElement | null = null;
      // 1. 文本前缀匹配("A." / "A、" / 裸字母开头)
      for (const el of optionEls) {
        const t = (el.textContent || "").trim();
        if (
          t.startsWith(upper + ".") ||
          t.startsWith(upper + "、") ||
          t.startsWith(upper + " ")
        ) {
          target = el;
          break;
        }
      }
      // 2. 字母下标兜底(A=0, B=1, ...)
      if (!target) {
        const index = upper.charCodeAt(0) - 65;
        if (index >= 0 && index < optionEls.length) {
          target = optionEls[index];
        }
      }
      if (!target) {
        Application.App.log.Warn(
          `[三节课课后题] 未找到选项 ${letter}(选项数 ${optionEls.length})`,
        );
        continue;
      }
      target.click();
      clicked = true;
      Application.App.log.Info(
        `[三节课课后题] 已选择选项 ${letter}: ${(current.options || {})[
          letter
        ] || ""}`,
      );
    }
    answeredIds.add(current.id);
    return { clicked, question: current };
  }

  /** 提取 quiz-list 下的选项元素(结构未知,多选择器兼容) */
  private getOptionElements(quizRoot: HTMLElement): HTMLElement[] {
    const selectors = [
      `${SANJIEKE_CONSTANTS.SELECTORS.QUIZ_LIST} li`,
      `${SANJIEKE_CONSTANTS.SELECTORS.QUIZ_LIST} [class*='option']`,
      `${SANJIEKE_CONSTANTS.SELECTORS.QUIZ_LIST} > *`,
    ];
    for (const selector of selectors) {
      const els = quizRoot.querySelectorAll(selector);
      if (els.length > 0) {
        return Array.from(els) as HTMLElement[];
      }
    }
    return [];
  }

  /**
   * 尝试点击「继续挑战」按钮(提交后站点出现,点击后站点拉取下一题)
   * 找到且未禁用则点击并返回 true;找不到不视为异常,由既有轮次检测兜底
   */
  private clickContinueChallenge(): boolean {
    const candidates = document.querySelectorAll(
      "button, a, [role='button'], [class*='btn'], [class*='button']",
    );
    for (const node of Array.from(candidates)) {
      const el = node as HTMLElement;
      const text = el.textContent?.trim() || "";
      if (!text.includes(SANJIEKE_CONSTANTS.BUTTON_TEXT.CONTINUE_CHALLENGE)) {
        continue;
      }
      if (
        el.hasAttribute("disabled") ||
        el.getAttribute("aria-disabled") === "true"
      ) {
        continue;
      }
      el.click();
      Application.App.log.Info("[三节课课后题] 已点击「继续挑战」");
      return true;
    }
    Application.App.log.Debug(
      "[三节课课后题] 未找到「继续挑战」按钮,走既有推进逻辑",
    );
    return false;
  }

  /** 标记完成并推进 */
  private finish(): void {
    if (this.done) {
      return;
    }
    this.done = true;
    this.callEvent("complete");
  }
}
