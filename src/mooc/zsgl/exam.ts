/*
 * @Author: guotao
 * @Date: 2025-03-09
 * @LastEditors: guotao
 * @LastEditTime: 2026-10-13 15:16:08
 * @FilePath: \course-tools\src\mooc\zsgl\exam.ts
 * @Description: zsgl 考试模块
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */
import { Task, TaskType } from "@App/internal/app/task";
import { Application } from "@App/internal/application";
import {
  CssBtn,
  hookHttpRequest,
  TimerManager,
  findElementByText,
  sleep,
} from "./utils/utils";
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
  /** 自动勾选：MutationObserver 实例（exam_auto_select 开启时才挂载，Stop 时断开） */
  private autoSelectObserver: MutationObserver | null = null;
  /** 自动勾选：是否正在执行勾选流程（勾选动作本身会引发 DOM 变更，防止 Observer 重入） */
  private autoSelectBusy: boolean = false;
  /** 自动勾选：最近一次完成勾选流程的题目ID，避免同一屏显题被 Observer 重复处理 */
  private autoSelectLastHandledId: string = "";
  /** 自动勾选：最近一次提示"未破解"的题目ID，同一题连续触发不重复刷提示 */
  private autoSelectLastUnansweredId: string = "";
  /** 自动勾选：选项元素未就绪时的重试状态（题面先渲染、选项晚到的时序兜底） */
  private autoSelectRetry: { questionId: string; count: number } = {
    questionId: "",
    count: 0,
  };
  /** 自动勾选：已按"一次性语义"应用过答案的题目ID（自定义选项控件无法回读选中态时的幂等保护） */
  private autoSelectAppliedIds: Set<string> = new Set();

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
      // 自动勾选 Observer：exam_auto_select 关闭时内部直接跳过，不注册不操作 DOM
      this.setupAutoSelectObserver();
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

  // ==================== 考试答案自动勾选（exam_auto_select） ====================
  // 仅勾选页面选项，绝不触碰"下一题/上一题/交卷"按钮，不调用任何提交接口；
  // 选项点击与 ZsglQuestionTask 的交卷监听天然隔离（该监听只匹配按钮文本）。

  /** 是否开启考试答案自动勾选（运行时读取，兼容 boolean/string 配置值） */
  private isExamAutoSelectEnabled(): boolean {
    // 与 answer_export_enabled 相同的读取写法：String() 兼容 boolean 配置值
    const enabled = String(
      Application.App.config.GetConfig(
        ZSGL_CONSTANTS.EXAM_AUTO_SELECT.CONFIG_KEY,
        "false",
      ),
    );
    return enabled.toLowerCase() === "true";
  }

  /** 注册换题检测 Observer：exam_auto_select 为 false 时不注册、不做任何 DOM 操作 */
  private setupAutoSelectObserver(): void {
    if (!this.isExamAutoSelectEnabled()) {
      Application.App.log.Debug("考试答案自动勾选未开启，跳过 Observer 注册");
      return;
    }
    if (this.autoSelectObserver) {
      return;
    }
    this.autoSelectObserver = new MutationObserver(() => {
      this.scheduleAutoSelect();
    });
    // 监听 document.body：SPA 会重建题面容器，挂 body 免去容器重建后的重挂处理
    this.autoSelectObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
    Application.App.log.Info("考试答案自动勾选已开启（仅勾选选项，不提交）");
  }

  /** 防抖调度一次正向触发（复用 TimerManager 的按 key 覆盖语义实现防抖） */
  private scheduleAutoSelect(): void {
    this.timerManager.setTimeout(
      "autoSelectDebounce",
      () => {
        this.autoSelectTick(false).catch((e) => {
          Application.App.log.Warn("考试答案自动勾选执行失败", e);
        });
      },
      ZSGL_CONSTANTS.EXAM_AUTO_SELECT.DEBOUNCE_MS,
    );
  }

  /**
   * 自动勾选执行入口
   * @param force true=反向触发（破解链尾答案回写后），忽略"已处理"缓存强制重查当前屏显题
   */
  private async autoSelectTick(force: boolean): Promise<void> {
    // 每次触发都重读配置：兼容运行时改配置，关闭时立即停手
    if (!this.isExamAutoSelectEnabled() || this.autoSelectBusy) {
      return;
    }
    if (this.questionList.length === 0) {
      return; // 题目数据未就绪，等下一次触发
    }

    const matched = this.matchOnScreenQuestions();
    if (matched.length !== 1) {
      return; // 零命中/多命中已在匹配步骤日志提示，绝不勾选
    }

    const { question, paper } = matched[0];
    if (!force && question.questionId === this.autoSelectLastHandledId) {
      Application.App.log.Debug(
        "考试答案自动勾选：当前屏显题已处理，跳过",
        question.questionId,
      );
      return;
    }

    // 目标集合：已破解出 isCorrect="Y" 的选项；无任何 "Y" 视为未破解，绝不点击
    const targetSections = question.sectionRespList.filter(
      (section: QuestionSection) => section.isCorrect === "Y",
    );
    if (targetSections.length === 0) {
      if (this.autoSelectLastUnansweredId !== question.questionId) {
        this.autoSelectLastUnansweredId = question.questionId;
        Application.App.log.Info(
          `考试答案自动勾选：题目尚未破解出答案，跳过勾选（题号 ${question.questionId}）`,
        );
      }
      return;
    }
    this.autoSelectLastUnansweredId = "";

    let units = this.collectOptionUnits(paper);
    if (units.length === 0) {
      // 选择器未命中时按选项文本定位兜底：站点选项为自定义 div（React onClick
      // 调 onSelectOption），无 input/aria/MuiRadio 结构——实机确认（deobfuscated.js）
      units = this.findOptionUnitsByText(paper, question);
      if (units.length > 0) {
        Application.App.log.Info(
          "考试答案自动勾选：OPTION_SELECTORS 未命中，已按选项文本定位兜底（站点为自定义选项控件）",
        );
      }
    }
    if (units.length === 0) {
      // 选项可能晚于题面分帧渲染：延迟重试，重试耗尽再输出诊断并放弃
      if (
        this.autoSelectRetry.questionId === question.questionId &&
        this.autoSelectRetry.count >= ZSGL_CONSTANTS.EXAM_AUTO_SELECT.MAX_RETRY
      ) {
        this.autoSelectRetry = { questionId: "", count: 0 };
        this.logOptionSelectorDiagnostics(paper);
        Application.App.log.Warn(
          "考试答案自动勾选：重试后题面容器内仍未找到选项元素（OPTION_SELECTORS 待实机校准，命中统计见 Debug）",
          paper,
        );
        return;
      }
      if (this.autoSelectRetry.questionId !== question.questionId) {
        this.autoSelectRetry = { questionId: question.questionId, count: 0 };
      }
      this.autoSelectRetry.count++;
      this.timerManager.setTimeout(
        "autoSelectRetry",
        () => {
          this.autoSelectTick(true).catch((e) => {
            Application.App.log.Warn("考试答案自动勾选执行失败", e);
          });
        },
        ZSGL_CONSTANTS.EXAM_AUTO_SELECT.RETRY_DELAY_MS,
      );
      return;
    }
    this.autoSelectRetry = { questionId: "", count: 0 };
    const unitBySection = this.mapSectionsToUnits(question, units);
    if (!unitBySection) {
      return;
    }

    // 先占位"已处理"再点击：勾选动作引发的 DOM 变更会再次进入本流程
    this.autoSelectLastHandledId = question.questionId;
    this.autoSelectBusy = true;
    try {
      await this.applyAutoSelect(
        question,
        targetSections,
        units,
        unitBySection,
        paper,
      );
    } finally {
      this.autoSelectBusy = false;
    }
  }

  /**
   * 屏显题面匹配：题目数据 → 页面题面容器
   * 在 MUI_PAPER_ROOT 范围内，用归一化文本（stripHtml + 去除全部空白字符）
   * 比对 questionText 与容器文本，返回全部命中题（含各自命中的容器）；
   * 唯一性校验由调用方负责：恰好唯一命中一道题才执行勾选
   */
  private matchOnScreenQuestions(): Array<{
    question: QuestionInfo;
    paper: HTMLElement;
  }> {
    const papers = Array.from(
      document.querySelectorAll(ZSGL_CONSTANTS.SELECTORS.MUI_PAPER_ROOT),
    ) as HTMLElement[];
    if (papers.length === 0) {
      Application.App.log.Debug(
        "考试答案自动勾选：未找到题面容器(.MuiPaper-root)，等待页面渲染",
      );
      return [];
    }
    const paperTexts = papers.map((paper) =>
      this.normalizeMatchText(paper.textContent || ""),
    );

    const matched: Array<{ question: QuestionInfo; paper: HTMLElement }> = [];
    for (const question of this.questionList) {
      const keys = this.getQuestionMatchKeys(question);
      if (keys.length === 0) {
        continue;
      }
      const candidateIdx: number[] = [];
      for (let i = 0; i < papers.length; i++) {
        if (keys.some((key) => paperTexts[i].includes(key))) {
          candidateIdx.push(i);
        }
      }
      if (candidateIdx.length === 0) {
        continue;
      }
      // 候选按归一化文本升序（内层优先），优先选取含选项元素者——
      // 题面文本可能在父层 Paper 复读，选项总与真实题面同层；
      // 都不含选项时回退文本最短者
      candidateIdx.sort((a, b) => paperTexts[a].length - paperTexts[b].length);
      const bestPaper =
        candidateIdx
          .map((i) => papers[i])
          .find((p) => this.collectOptionUnits(p).length > 0) ||
        papers[candidateIdx[0]];
      matched.push({ question, paper: bestPaper });
    }

    if (matched.length === 0) {
      Application.App.log.Warn(
        "考试答案自动勾选：题面匹配零命中，跳过勾选（归一化匹配规则待实机校准）",
      );
    } else if (matched.length > 1) {
      Application.App.log.Warn(
        `考试答案自动勾选：题面匹配到 ${matched.length} 道题，非唯一命中，跳过勾选`,
        matched.slice(0, 3).map((m) => m.question.questionId),
      );
    }
    return matched;
  }

  /** 归一化匹配文本：stripHtml 后移除全部空白字符 */
  private normalizeMatchText(text: string): string {
    return stripHtml(text || "").replace(/\s+/g, "");
  }

  /**
   * 题干可比文本键：优先完整题干，附加最后一个 <p> 段落兜底
   * （取段思路与 findMatchingElement 一致，任一键命中即视为屏显）
   */
  private getQuestionMatchKeys(question: QuestionInfo): string[] {
    const keys: string[] = [];
    const full = this.normalizeMatchText(question.questionText);
    if (full) {
      keys.push(full);
    }
    const questionTextList = question.questionText.split(/<p>/i);
    const lastPart =
      questionTextList.length > 1
        ? questionTextList[questionTextList.length - 1]
        : questionTextList[0];
    const last = this.normalizeMatchText(lastPart.replace(/<\/p>/i, ""));
    if (last && last !== full) {
      keys.push(last);
    }
    return keys;
  }

  /**
   * 收集题面容器内的选项元素
   * 原生 input 通常被 MUI 可视包装（MuiRadio-root 等）包住，提升到包装层并去重，
   * 避免同一选项被 input 选择器与包装选择器各计一次
   */
  private collectOptionUnits(paper: HTMLElement): HTMLElement[] {
    const nodes = Array.from(
      paper.querySelectorAll(
        ZSGL_CONSTANTS.EXAM_AUTO_SELECT.OPTION_SELECTORS.join(","),
      ),
    ) as HTMLElement[];
    const units: HTMLElement[] = [];
    const seen = new Set<HTMLElement>();
    for (const node of nodes) {
      const unit =
        (node.closest(
          ZSGL_CONSTANTS.EXAM_AUTO_SELECT.OPTION_CONTAINER_SELECTOR,
        ) as HTMLElement | null) || node;
      if (seen.has(unit)) {
        continue;
      }
      seen.add(unit);
      units.push(unit);
    }
    return units;
  }

  /** 选项选择器命中统计（校准用）：逐个选择器输出在题面容器内的命中数 */
  private logOptionSelectorDiagnostics(paper: HTMLElement): void {
    const counts = ZSGL_CONSTANTS.EXAM_AUTO_SELECT.OPTION_SELECTORS.map(
      (selector) => `${selector}:${paper.querySelectorAll(selector).length}`,
    );
    Application.App.log.Debug(
      "考试答案自动勾选：OPTION_SELECTORS 命中统计（校准依据）",
      counts.join(" , "),
    );
  }

  /** 选项文本：优先取 MUI FormControlLabel（同时包裹选项控件与文字），取不到回退选项自身 */
  private getOptionText(unit: HTMLElement): string {
    const label = unit.closest(
      ZSGL_CONSTANTS.EXAM_AUTO_SELECT.OPTION_TEXT_SELECTOR,
    ) as HTMLElement | null;
    return (label || unit).textContent || "";
  }

  /**
   * 读取选项当前选中状态
   * 优先原生 input.checked，其次最近祖先（含自身）[aria-checked]，
   * 最后回退 MUI 选中 class（选择器结构待实机校准）
   */
  private isOptionSelected(unit: HTMLElement): boolean {
    const input =
      unit instanceof HTMLInputElement &&
      (unit.type === "radio" || unit.type === "checkbox")
        ? unit
        : (unit.querySelector(
            'input[type="radio"],input[type="checkbox"]',
          ) as HTMLInputElement | null);
    if (input) {
      return input.checked;
    }
    const aria = unit.closest("[aria-checked]") as HTMLElement | null;
    if (aria) {
      return aria.getAttribute("aria-checked") === "true";
    }
    return (
      unit.classList.contains("Mui-checked") ||
      !!unit.querySelector(".Mui-checked")
    );
  }

  /** 选项单元是否具备可回读的选中状态源（input/aria-checked/Mui-checked 任一） */
  private hasStateSource(unit: HTMLElement): boolean {
    return !!(
      unit.querySelector('input[type="radio"],input[type="checkbox"]') ||
      unit.closest("[aria-checked]") ||
      unit.querySelector("[aria-checked]") ||
      unit.classList.contains("Mui-checked") ||
      unit.querySelector(".Mui-checked")
    );
  }

  /** 点击选项单元：优先点内部表单控件/label，否则点单元自身（React 事件委托在根节点，点后代同样触发 onClick） */
  private clickOptionUnit(unit: HTMLElement): void {
    const control = unit.querySelector("input,label") as HTMLElement | null;
    (control || unit).click();
  }

  /**
   * 选项单元→题面容器的祖先链 class 签名（弱验证用）
   * 选中态 class 挂在选项行级祖先（如站点把 selectedOption 加在 option 行 div 上），
   * 而文本兜底定位点击的是文本后代——单元自身 class 不变，需对比整条祖先链
   */
  private ancestorChainSignature(
    unit: HTMLElement,
    paper: HTMLElement,
  ): string {
    const parts: string[] = [];
    let el: HTMLElement | null = unit;
    while (el) {
      parts.push(el.className);
      if (el === paper) {
        break;
      }
      el = el.parentElement;
    }
    return parts.join("|");
  }

  /**
   * 选项选择器未命中时的兜底定位：按选项文本找最小命中元素
   * 站点选项为自定义 div（key=sectionId、onClick 调 onSelectOption，选中态仅切 class），
   * 无 input/aria/MuiRadio 结构；React 事件委托在根节点，点击文本后代即可触发选项 onClick。
   * 短文本（数字选项"7/15/30"、"对/错"）用全等匹配，长文本用包含匹配（minLen 只约束包含分支）
   */
  private findOptionUnitsByText(
    paper: HTMLElement,
    question: QuestionInfo,
  ): HTMLElement[] {
    const minLen =
      ZSGL_CONSTANTS.EXAM_AUTO_SELECT.OPTION_TEXT_FALLBACK_MIN_LEN;
    const sectionTexts = question.sectionRespList
      .map((section) => this.normalizeMatchText(section.sectionText))
      .filter((text) => text.length > 0);
    if (sectionTexts.length === 0) {
      return [];
    }
    // 两遍式：先收集全部命中元素，再只保留最小命中者（不包含其他命中的元素）。
    // 不能单遍历即时去重——文档序里选项容器（含全部选项文本）先于选项行出现，
    // 会把内部命中全部挡住（实机第 4 轮 pageCount=1 勘误）
    // 匹配语义：长文本用包含匹配；短文本（数字选项"7/15/30"、"对/错"等）用全等匹配
    // ——包含匹配会误命中大量无关元素，而选项文本元素（<p>15</p>）归一化后恰为全等
    // （实机第 5 轮：minLen 过滤把纯数字选项全部/部分滤掉，pageCount=0/3 勘误）
    const matched: HTMLElement[] = [];
    for (const el of Array.from(
      paper.querySelectorAll("*"),
    ) as HTMLElement[]) {
      const text = this.normalizeMatchText(el.textContent || "");
      if (
        text &&
        sectionTexts.some(
          (st) => text === st || (st.length >= minLen && text.includes(st)),
        )
      ) {
        matched.push(el);
      }
    }
    return matched.filter(
      (el) => !matched.some((other) => other !== el && el.contains(other)),
    );
  }

  /**
   * 选项与 sectionRespList 的对应关系
   * 优先归一化 sectionText 文本匹配选项元素文本（页面文本包含数据选项文本）；
   * 有选项匹配不上且两侧数量完全一致时按顺序对应
   * （该回退策略待实机校准）；数量也不一致则放弃本次勾选
   */
  private mapSectionsToUnits(
    question: QuestionInfo,
    units: HTMLElement[],
  ): Map<QuestionSection, HTMLElement> | null {
    const byText = new Map<QuestionSection, HTMLElement>();
    const used = new Set<HTMLElement>();
    let allMatched = true;
    for (const section of question.sectionRespList) {
      const norm = this.normalizeMatchText(section.sectionText);
      let hit: HTMLElement | null = null;
      if (norm) {
        hit =
          units.find(
            (unit) =>
              !used.has(unit) &&
              this.normalizeMatchText(this.getOptionText(unit)).includes(norm),
          ) || null;
      }
      if (hit) {
        byText.set(section, hit);
        used.add(hit);
      } else {
        allMatched = false;
      }
    }
    if (allMatched) {
      return byText;
    }
    // 文本匹配不上且数量一致：按 DOM 顺序对应（该回退策略待实机校准）
    if (units.length === question.sectionRespList.length) {
      Application.App.log.Warn(
        "考试答案自动勾选：选项文本匹配不全，按顺序对应（待实机校准）",
        question.questionId,
      );
      const byOrder = new Map<QuestionSection, HTMLElement>();
      question.sectionRespList.forEach((section, index) => {
        byOrder.set(section, units[index]);
      });
      return byOrder;
    }
    Application.App.log.Warn(
      "考试答案自动勾选：选项与页面元素无法对应，跳过勾选",
      {
        questionId: question.questionId,
        dataCount: question.sectionRespList.length,
        pageCount: units.length,
      },
    );
    return null;
  }

  /**
   * 勾选执行（两条路径按"是否有可回读状态源"分流）：
   * - 可回读（input/aria-checked/Mui-checked）：差集幂等——S/T 点目标（radio 互斥），
   *   M 先取消非目标已选再点目标；已满足不动；勾后回读验证，失败降级面板提示
   * - 不可回读（站点自定义 div 选项，选中态仅切 class）：一次性应用语义（appliedIds 防重），
   *   只点目标项；用"点击前后祖先链 class 签名是否变化"做弱验证（选中态 class 挂在行级
   *   祖先上，单元自身不变），未变化则 Warn + 面板降级
   */
  private async applyAutoSelect(
    question: QuestionInfo,
    targetSections: QuestionSection[],
    units: HTMLElement[],
    unitBySection: Map<QuestionSection, HTMLElement>,
    paper: HTMLElement,
  ): Promise<void> {
    const targetUnits = targetSections
      .map((section) => unitBySection.get(section))
      .filter((unit): unit is HTMLElement => !!unit);
    if (targetUnits.length !== targetSections.length) {
      Application.App.log.Warn(
        "考试答案自动勾选：目标选项映射缺失，跳过勾选",
        question.questionId,
      );
      return;
    }

    const answerText = targetSections
      .map((section: QuestionSection) => stripHtml(section.sectionText))
      .join(" | ");

    // 路径 B：自定义控件，无状态源可回读
    if (!units.some((unit) => this.hasStateSource(unit))) {
      if (this.autoSelectAppliedIds.has(question.questionId)) {
        Application.App.log.Debug(
          "考试答案自动勾选：该题已按一次性语义应用过，跳过重复点击",
          question.questionId,
        );
        return;
      }
      this.autoSelectAppliedIds.add(question.questionId);
      // 弱验证基线：对比"单元→题面容器"祖先链 class 签名（选中态 class 挂在行级祖先）
      const beforeSigs = targetUnits.map((unit) =>
        this.ancestorChainSignature(unit, paper),
      );
      for (const unit of targetUnits) {
        this.clickOptionUnit(unit);
        await sleep(ZSGL_CONSTANTS.EXAM_AUTO_SELECT.CLICK_STEP_MS);
      }
      const classChanged = targetUnits.some(
        (unit, index) =>
          this.ancestorChainSignature(unit, paper) !== beforeSigs[index],
      );
      if (classChanged) {
        Application.App.log.Info(
          `考试答案自动勾选完成：${stripHtml(question.questionText).slice(
            0,
            50,
          )} → ${answerText}`,
        );
      } else {
        Application.App.log.Warn(
          "考试答案自动勾选：点击后选项样式未变化，勾选可能未生效（自定义控件弱验证）",
          question.questionId,
        );
        Application.App.log.Info(
          `考试答案自动勾选降级提示，该题正确答案：${answerText}`,
        );
      }
      return;
    }

    // 路径 A：可回读状态源，差集幂等勾选
    const isMulti = question.questionType === "M";
    const selectedUnits = units.filter((unit) => this.isOptionSelected(unit));
    const selectedSet = new Set(selectedUnits);
    const targetSet = new Set(targetUnits);

    const toSelect = targetUnits.filter((unit) => !selectedSet.has(unit));
    const toDeselect = isMulti
      ? selectedUnits.filter((unit) => !targetSet.has(unit))
      : [];

    if (toSelect.length === 0 && toDeselect.length === 0) {
      Application.App.log.Debug(
        "考试答案自动勾选：当前选中集合已等于正确答案集合，不动作",
        question.questionId,
      );
      return;
    }

    for (const unit of toDeselect) {
      this.clickOptionUnit(unit);
      await sleep(ZSGL_CONSTANTS.EXAM_AUTO_SELECT.CLICK_STEP_MS);
    }
    for (const unit of toSelect) {
      this.clickOptionUnit(unit);
      await sleep(ZSGL_CONSTANTS.EXAM_AUTO_SELECT.CLICK_STEP_MS);
    }

    // 勾后验证：回读选中状态与目标集合比对
    await sleep(ZSGL_CONSTANTS.EXAM_AUTO_SELECT.VERIFY_DELAY_MS);
    const afterSelected = units.filter((unit) => this.isOptionSelected(unit));
    const afterSet = new Set(afterSelected);
    const verified =
      targetUnits.every((unit) => afterSet.has(unit)) &&
      (!isMulti || afterSelected.every((unit) => targetSet.has(unit)));

    if (verified) {
      Application.App.log.Info(
        `考试答案自动勾选完成：${stripHtml(question.questionText).slice(
          0,
          50,
        )} → ${answerText}`,
      );
    } else {
      Application.App.log.Warn(
        "考试答案自动勾选验证失败：页面选中状态与正确答案集合不一致",
        question.questionId,
      );
      // 降级：面板提示该题正确答案文本
      Application.App.log.Info(
        `考试答案自动勾选降级提示，该题正确答案：${answerText}`,
      );
    }
  }

  /** 停止自动勾选：断开 Observer 并清防抖/重试定时器 */
  private stopAutoSelect(): void {
    if (this.autoSelectObserver) {
      this.autoSelectObserver.disconnect();
      this.autoSelectObserver = null;
    }
    this.timerManager.clearTimeout("autoSelectDebounce");
    this.timerManager.clearTimeout("autoSelectRetry");
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
                reject(new Error("queryNewExamPaper响应字段不完整，无法继续"));
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
    // 先断开 Observer 再清定时器：避免断开前的最后一次变更又排入新的防抖任务
    this.stopAutoSelect();
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

    // 反向触发：本批答案已回写，补勾当前屏显题（覆盖"用户翻题早于答案就绪"的漏勾场景）
    this.autoSelectTick(true).catch((e) => {
      Application.App.log.Warn("考试答案自动勾选（反向触发）失败", e);
    });
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
