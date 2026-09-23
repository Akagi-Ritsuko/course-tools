/*
 * @Description: 三节课 学习任务集(MoocTaskSet)
 * hook content/tree 枚举课时 → 构建当前课时任务(视频+课后题) →
 * 课时完成(标记)后整页跳转下一课时 → 全部完成走毕业闭环
 *
 * 课时推进采用"整页跳转"而非 SPA 内切换:每次跳转后重建任务集,
 * 以服务端 content/tree + 本域课时完成标记为真相源,状态自愈、无累积泄漏
 *
 * Copyright (c) 2026 by lzlj, All Rights Reserved.
 */
import { Application } from "@App/internal/application";
import { MoocEvent, MoocTaskSet } from "@App/internal/app/mooc";
import { Task } from "@App/internal/app/task";
import { EventListener } from "@App/internal/utils/event";
import { SANJIEKE_COURSE_COMPLETE_TYPE } from "@App/internal/utils/message";
import {
  hookHttpRequest,
  removeHttpRequestHook,
  TimerManager,
  setupVisibilitySpoof,
  setupSwitchScreenNeutralizer,
} from "./utils/utils";
import { SANJIEKE_CONSTANTS } from "./constants";
import { ContentTreeNode, LessonInfo } from "./types";
import { SanjiekeVideo } from "./video";
import { SanjiekeArticle } from "./article";
import { SanjiekeQuiz } from "./quiz";
import { cacheSanjiekeQuestions } from "./quiz";
import {
  parseStudyUrl,
  isLessonDoneMarked,
  setLessonDoneMark,
  clearLessonDoneMark,
  clearLessonDoneMarks,
} from "./utils/utils";

/** 课时同页重试次数上限(超过后停止导航,防止无限重载风暴) */
const LESSON_RETRY_MAX = 3;
const LESSON_RETRY_PREFIX = "sanjieke_lesson_retry_";
/** 毕业通知发出后延迟关页(ms),保证 opener 直推与扩展中转消息发出后再销毁页面 */
const COMPLETE_NOTIFY_CLOSE_DELAY_MS = 500;

export class SanjiekeStudy extends EventListener<MoocEvent>
  implements MoocTaskSet {
  /** 当前课时的任务列表(视频/图文+课后题) */
  private taskList: Array<SanjiekeVideo | SanjiekeArticle | SanjiekeQuiz> = [];
  /** 任务索引 */
  private taskIndex: number = 0;
  /** 课程ID(来自 URL) */
  private courseId: string;
  /** 定时器管理器 */
  private timerManager: TimerManager = new TimerManager();
  /** 内容树叶子课时列表 */
  private lessons: LessonInfo[] = [];
  /** 内容树是否已接收 */
  private treeReceived: boolean = false;
  /** 完成闭环是否已处理(幂等) */
  private completedHandled: boolean = false;
  /** 课时导航是否已排期(防重复) */
  private navigationScheduled: boolean = false;
  /** 本域标记是否已按课程树校验过(仅首次数据到达时同步,防后续树刷新覆盖本页新完成标记) */
  private marksSynced: boolean = false;

  constructor() {
    super();
    const parsed = parseStudyUrl();
    this.courseId = parsed?.courseId || "";
  }

  public Init(): Promise<any> {
    return new Promise(async (resolve) => {
      Application.App.log.Info(
        `[三节课] 学习页初始化 courseId=${this.courseId}`,
      );

      // 复用 zsgl 的可见性伪装与切窗检测中和(挂机期间切窗不中断播放)
      setupVisibilitySpoof();
      setupSwitchScreenNeutralizer();

      // hook 课时内容树(枚举课时/完成状态)
      await hookHttpRequest(
        SANJIEKE_CONSTANTS.HTTP_ENDPOINTS.CONTENT_TREE,
        (response) => this.onContentTree(response),
        this,
      );
      // hook 课程级课后题列表(实测通常返回空数组,真正的题目走 VIDEO_QUESTION);
      // 过滤 AI 视频问答列表接口噪声(questions_and_answers 也会命中 /questions)
      await hookHttpRequest(
        SANJIEKE_CONSTANTS.HTTP_ENDPOINTS.QUESTIONS,
        (response, context, url) => {
          if (url && url.includes("questions_and_answers")) {
            return;
          }
          if (this.courseId) {
            cacheSanjiekeQuestions(this.courseId, response);
          }
        },
        this,
      );
      // hook 真正的课后题来源:AI 视频问答单题接口(响应 data 直接含 answer)
      await hookHttpRequest(
        SANJIEKE_CONSTANTS.HTTP_ENDPOINTS.VIDEO_QUESTION,
        (response, context, url) => {
          if (url && url.includes("questions_and_answers")) {
            return;
          }
          if (this.courseId) {
            cacheSanjiekeQuestions(this.courseId, response);
          }
        },
        this,
      );
      // hook 毕业状态接口
      await hookHttpRequest(
        SANJIEKE_CONSTANTS.HTTP_ENDPOINTS.CERT_GRADUATED,
        (response) => this.onGraduated(response),
        this,
      );

      // 树响应超时兜底(防静默挂死;若 DOM 课时列表已接管则不报错)
      this.timerManager.setTimeout(
        "treeTimeout",
        () => {
          if (
            !this.treeReceived &&
            this.taskList.length === 0 &&
            !this.navigationScheduled &&
            !this.completedHandled
          ) {
            Application.App.log.Error(
              `[三节课] ${SANJIEKE_CONSTANTS.ERROR_MESSAGES.TREE_NOT_FOUND}`,
            );
          }
        },
        SANJIEKE_CONSTANTS.TREE_WAIT_TIMEOUT_MS,
      );

      // DOM 课时列表兜底数据源(content/tree 钩子未就绪/字段未识别时,
      // 以左侧课时列表 .node-item[node-id] 为准构建任务/跳转)
      let domChecks = 0;
      this.timerManager.setInterval(
        "domLessonCheck",
        () => {
          domChecks++;
          if (
            this.taskList.length > 0 ||
            this.navigationScheduled ||
            this.completedHandled
          ) {
            this.timerManager.clearInterval("domLessonCheck");
            return;
          }
          if (domChecks > SANJIEKE_CONSTANTS.LESSON_DOM_CHECK_MAX_ATTEMPTS) {
            this.timerManager.clearInterval("domLessonCheck");
            Application.App.log.Warn(
              "[三节课] DOM 课时列表等待超时且内容树未就绪,任务未构建",
            );
            return;
          }
          const domLessons = getLessonsFromDom();
          if (domLessons && domLessons.length > 0) {
            this.timerManager.clearInterval("domLessonCheck");
            Application.App.log.Info(
              `[三节课] DOM 课时列表已就绪: ${domLessons.length} 个课时`,
            );
            this.buildCurrentLessonTasks();
          }
        },
        SANJIEKE_CONSTANTS.LESSON_DOM_CHECK_INTERVAL_MS,
      );

      resolve(undefined);
    });
  }

  /**
   * content/tree 响应处理:解析课时列表 → 判定完成/构建当前课时任务
   */
  private onContentTree(response: any): void {
    try {
      const nodes = findNodeArray(response);
      if (nodes === null) {
        Application.App.log.Warn(
          "[三节课] content/tree 响应结构无法识别,等待其他信号",
        );
        return;
      }
      this.lessons = flattenLessons(nodes);
      this.treeReceived = true;
      this.timerManager.clearTimeout("treeTimeout");
      Application.App.log.Info(
        `[三节课] 课时树已解析: 共 ${this.lessons.length} 个课时, 已完成 ${
          this.lessons.filter((l) => l.finished).length
        } 个`,
      );

      // 全部课时完成(服务端视角) → 毕业闭环
      if (this.lessons.length > 0 && this.lessons.every((l) => l.finished)) {
        this.courseComplete();
        return;
      }

      this.buildCurrentLessonTasks();
    } catch (e) {
      Application.App.log.Error("[三节课] content/tree 解析失败", e);
    }
  }

  /**
   * 构建当前(首个未完成)课时的任务列表
   * 数据源:DOM 课时列表(实测结构)与 content/tree 合并;
   * 进入页面时 URL 与首个未完成课时不一致 → 整页跳转(状态自愈)
   */
  private buildCurrentLessonTasks(): void {
    if (
      this.taskList.length > 0 ||
      this.completedHandled ||
      this.navigationScheduled
    ) {
      return;
    }
    const lessons = mergeLessons(this.lessons, getLessonsFromDom());
    if (lessons.length === 0) {
      // 树未到达且 DOM 未就绪,等待(由 Init 的轮询再次触发)
      return;
    }

    // 每次页面刷新以课程树/DOM 的"是否已完成"为准校验并更新本域完成标记:
    // 树判定已完成 → 写标记(信任服务端);树判定未完成 → 清除标记(防止此前
    // ended 时误标导致跳过实际未完成课时);仅首次数据到达时执行同步
    if (!this.marksSynced) {
      this.marksSynced = true;
      for (const l of lessons) {
        if (l.finished) {
          setLessonDoneMark(this.courseId, l.lessonId);
        } else if (isLessonDoneMarked(this.courseId, l.lessonId)) {
          Application.App.log.Info(
            `[三节课] 课程树判定课时未完成,清除本地标记: ${l.lessonName}(${l.lessonId})`,
          );
          clearLessonDoneMark(this.courseId, l.lessonId);
        }
      }
    }

    const parsed = parseStudyUrl();
    const currentLessonId = parsed?.lessonId || "";
    const pending = lessons.filter(
      (l) => !l.finished && !isLessonDoneMarked(this.courseId, l.lessonId),
    );

    // 不可自动挂机的课时(考试/文档/直播等)跳过且不写完成标记:
    // 挂完所有可自动课时后,若剩余全是此类课时则视为课程任务完成。
    // 扩展点:后续支持考试等类型自动挂机时,将类型加入
    // AUTO_STUDY_CONTENT_TYPES 并扩展此处的任务工厂分发即可
    const autoPending = pending.filter((l) => isAutoStudyType(l.type));
    if (autoPending.length === 0) {
      if (pending.length > 0) {
        const detail = pending
          .map((l) => `${l.lessonName}(${l.lessonId},${l.type || "未知"})`)
          .join("、");
        Application.App.log.Warn(
          `[三节课] 剩余 ${pending.length} 个课时均为不可自动挂机类型,扩展视为课程任务完成: ${detail}`,
        );
      }
      this.courseComplete();
      return;
    }

    // 进入页面即对齐到最近的未完成可自动课时(跳过不可自动类型)
    const first = autoPending[0];
    if (currentLessonId && currentLessonId !== first.lessonId) {
      Application.App.log.Info(
        `[三节课] 当前课时(${currentLessonId})非首个未完成课时,跳转至 ${first.lessonName}(${first.lessonId})`,
      );
      this.scheduleNavigation(first.lessonId, 0);
      return;
    }

    // 构建当前课时任务:视频 + 课后题(课后题超时自动跳过)
    Application.App.log.Info(
      `[三节课] 构建课时任务: ${first.lessonName}(${first.lessonId}), 类型: ${first.type || "未知"}, 剩余未完成 ${autoPending.length} 个`,
    );
    const taskInfo = {
      courseId: this.courseId,
      lessonId: first.lessonId,
      lessonName: first.lessonName,
      index: 0,
    };
    // 按课时类型分发主任务:视频 → SanjiekeVideo,图文 → SanjiekeArticle;
    // 类型未知时以 DOM 特征兜底(当前页无 video 且存在图文滚动容器 → 图文,spec Assumption #10)
    const useArticle =
      isArticleType(first.type) ||
      (!first.type &&
        !document.querySelector("video") &&
        !!document.querySelector(
          SANJIEKE_CONSTANTS.SELECTORS.ARTICLE_SCROLL_CONTAINER
        ));
    const mainTask = useArticle
      ? new SanjiekeArticle(taskInfo)
      : new SanjiekeVideo(taskInfo);
    const quiz = new SanjiekeQuiz(taskInfo);
    [mainTask, quiz].forEach((task, index) => {
      task.addEventListener("complete", () => {
        this.callEvent("taskComplete", index, task);
      });
    });
    this.taskList = [mainTask, quiz];
    this.taskIndex = 0;
    this.callEvent("reload");
  }

  public Next(): Promise<Task> {
    return new Promise((resolve) => {
      Application.App.log.Debug(
        "[三节课] Next 任务索引:",
        this.taskIndex,
        this.taskList.length,
      );
      if (this.taskList.length > this.taskIndex) {
        resolve(this.taskList[this.taskIndex]);
        return this.taskIndex++;
      }
      // 当前课时任务耗尽 → 推进下一课时(或毕业)
      this.onLessonTasksExhausted();
      resolve(undefined);
    });
  }

  public SetTaskPointer(index: number): void {
    this.taskIndex = index;
  }

  /**
   * 当前课时任务耗尽:写当前课时标记(视频 ended 已写,此处兜底)→
   * 跳转下一未完成课时;无未完成课时则毕业
   */
  private onLessonTasksExhausted(): void {
    if (this.completedHandled || this.navigationScheduled) {
      return;
    }
    // 标记来源:取本组任务对应的课时(视频 ended 已写,此处兜底);
    // 任务列表为空(如换课导航已排期)时绝不兜底标记,防止未观看课时被误标完成
    const lessonId =
      this.taskList.length > 0 ? this.taskList[0].taskinfo.lessonId : "";
    if (lessonId) {
      setLessonDoneMark(this.courseId, lessonId);
    }

    // 仅在可自动挂机的未完成课时中推进(考试/文档等类型跳过不标记,
    // 与 buildCurrentLessonTasks 的 autoPending 语义一致)
    const pending = mergeLessons(this.lessons, getLessonsFromDom())
      .filter((l) => !l.finished && !isLessonDoneMarked(this.courseId, l.lessonId))
      .filter((l) => isAutoStudyType(l.type));
    if (pending.length === 0) {
      this.courseComplete();
      return;
    }

    const next = pending[0];
    if (next.lessonId === lessonId) {
      // 下一课时仍是当前课时 → 视频任务未成功(标记兜底但服务端未完成),整页重载重试
      const retryCount = this.bumpLessonRetry(lessonId);
      if (retryCount > LESSON_RETRY_MAX) {
        Application.App.log.Error(
          `[三节课] 课时 ${lessonId} 连续 ${LESSON_RETRY_MAX} 次推进失败,停止自动重试,请人工检查`,
        );
        return;
      }
      Application.App.log.Warn(
        `[三节课] 课时 ${lessonId} 任务耗尽但未完成,整页重载重试(${retryCount}/${LESSON_RETRY_MAX})`,
      );
      this.scheduleNavigation(lessonId, 0);
      return;
    }

    this.clearLessonRetry(lessonId);
    const transitionDelayMs = Application.App.config.interval * 60000;
    Application.App.log.Info(
      `[三节课] 课时完成,${Math.round(
        transitionDelayMs / 1000,
      )}s 后跳转下一课时: ${next.lessonName}(${next.lessonId})`,
    );
    this.scheduleNavigation(next.lessonId, transitionDelayMs);
  }

  /** 整页跳转到指定课时(delay 后执行,Stop 可取消) */
  private scheduleNavigation(lessonId: string, delay: number): void {
    if (this.navigationScheduled || !this.courseId || !lessonId) {
      return;
    }
    this.navigationScheduled = true;
    this.timerManager.setTimeout(
      "lessonNavigation",
      () => {
        Application.App.log.Info(`[三节课] 跳转课时: ${lessonId}`);
        window.location.href = `${SANJIEKE_CONSTANTS.URL_PATTERNS.STUDY_PATH}${this.courseId}/${lessonId}`;
        // 注意:整页跳转后本实例随页面销毁,无需清理
      },
      delay,
    );
  }

  /** 递增课时重试计数 */
  private bumpLessonRetry(lessonId: string): number {
    if (!lessonId) {
      return 0;
    }
    const key = `${LESSON_RETRY_PREFIX}${this.courseId}_${lessonId}`;
    const count = (parseInt(localStorage.getItem(key) || "0", 10) || 0) + 1;
    try {
      localStorage.setItem(key, String(count));
    } catch (e) {
      // ignore
    }
    return count;
  }

  /** 清除课时重试计数(视频正常完成时) */
  private clearLessonRetry(lessonId: string): void {
    if (!lessonId) {
      return;
    }
    try {
      localStorage.removeItem(
        `${LESSON_RETRY_PREFIX}${this.courseId}_${lessonId}`,
      );
    } catch (e) {
      // ignore
    }
  }

  /**
   * cert/graduated 响应处理:弹性识别毕业状态
   * 响应结构属 Assumption #1,遍历对象中含 graduated 的布尔字段判定
   */
  private onGraduated(response: any): void {
    try {
      if (findGraduated(response)) {
        Application.App.log.Info("[三节课] cert/graduated 判定已毕业");
        this.courseComplete();
      }
    } catch (e) {
      Application.App.log.Warn("[三节课] cert/graduated 解析失败", e);
    }
  }

  /**
   * 课程完成闭环:写完成标记 → 清理课时标记 → 通知 zsgl 课程页 → 延迟关页
   */
  private courseComplete(): void {
    if (this.completedHandled) {
      return;
    }
    this.completedHandled = true;
    this.timerManager.clearAll();
    Application.App.log.Info("[三节课] 全部课时完成,课程毕业!");

    try {
      localStorage.setItem(
        `${SANJIEKE_CONSTANTS.STORAGE_PREFIX.COURSE_COMPLETE}${this.courseId}`,
        JSON.stringify({ status: "finished", timestamp: Date.now() }),
      );
      clearLessonDoneMarks(this.courseId);
    } catch (e) {
      Application.App.log.Warn("[三节课] 写完成标记失败", e);
    }

    // 通知 zsgl 课程页(跨源无法共用 localStorage):
    // A 路 opener 直推 + B 路扩展中转(内容脚本 → background → zsgl 内容脚本),
    // 通知先行、延迟关页,防页面销毁早于消息发出
    this.notifyOpenerComplete();
    this.notifyRelayComplete();
    window.setTimeout(() => window.close(), COMPLETE_NOTIFY_CLOSE_DELAY_MS);
    window.setTimeout(() => {
      Application.App.log.Warn(
        "[三节课] 页面自动关闭失败(可能非脚本打开),请手动关闭;不影响整体闭环",
      );
    }, COMPLETE_NOTIFY_CLOSE_DELAY_MS + 1000);
  }

  /** A 路:直推打开本页的 zsgl 课程页(opener 存在时);失败仅告警,不阻断 B 路 */
  private notifyOpenerComplete(): void {
    try {
      const opener = window.opener as Window | null;
      if (opener && !opener.closed) {
        opener.postMessage(
          { type: SANJIEKE_COURSE_COMPLETE_TYPE, courseId: this.courseId },
          "*",
        );
        Application.App.log.Info("[三节课] 已通过 opener 直推毕业通知");
      }
    } catch (e) {
      Application.App.log.Warn("[三节课] opener 直推失败,依赖扩展中转兜底", e);
    }
  }

  /** B 路:经内容脚本桥接(cxmooc-tools)→ background 中转到 zsgl 课程页 */
  private notifyRelayComplete(): void {
    try {
      Application.App.Client.Send({
        type: SANJIEKE_COURSE_COMPLETE_TYPE,
        details: { courseId: this.courseId },
      });
      Application.App.log.Info("[三节课] 已发出扩展中转毕业通知");
    } catch (e) {
      Application.App.log.Warn("[三节课] 扩展中转通知失败", e);
    }
  }

  public Stop(): Promise<any> {
    this.timerManager.clearAll();
    this.taskList.forEach((task) => task.Stop());
    this.taskList = [];
    // 移除本实例注册的 HTTP 钩子,释放引用
    [
      SANJIEKE_CONSTANTS.HTTP_ENDPOINTS.CONTENT_TREE,
      SANJIEKE_CONSTANTS.HTTP_ENDPOINTS.QUESTIONS,
      SANJIEKE_CONSTANTS.HTTP_ENDPOINTS.VIDEO_QUESTION,
      SANJIEKE_CONSTANTS.HTTP_ENDPOINTS.CERT_GRADUATED,
    ].forEach((endpoint) => removeHttpRequestHook(endpoint, this));
    return Promise.resolve();
  }
}

/**
 * 从响应中弹性提取内容树节点数组
 * 响应结构属 Assumption #1(开发期实测),按常见包裹字段逐层探测
 */
function findNodeArray(obj: any, depth: number = 0): any[] | null {
  if (depth > 4) {
    return null;
  }
  if (Array.isArray(obj)) {
    return obj;
  }
  if (obj && typeof obj === "object") {
    for (const key of ["data", "body", "result", "tree", "content", "list"]) {
      if (obj[key] !== undefined) {
        const found = findNodeArray(obj[key], depth + 1);
        if (found !== null) {
          return found;
        }
      }
    }
  }
  return null;
}

/**
 * 递归展平内容树:仅收集叶子节点(课时);含 children 的节点视为章节
 */
function flattenLessons(
  nodes: any[],
  out: LessonInfo[] = [],
  depth: number = 0,
): LessonInfo[] {
  if (depth > 10 || !Array.isArray(nodes)) {
    return out;
  }
  for (const node of nodes) {
    if (!node || typeof node !== "object") {
      continue;
    }
    if (Array.isArray(node.children) && node.children.length > 0) {
      flattenLessons(node.children, out, depth + 1);
      continue;
    }
    // 实测响应叶子节点 id 字段为 nodeId(2026-09-22 课程 34002056 content/tree 响应),
    // 其余字段名为其他版本兜底
    const id = node.id ?? node.nodeId ?? node.lessonId ?? node.contentId;
    if (id === undefined || id === null) {
      continue;
    }
    // 内容类型:attribute.type 优先(实测 video),兜底 contentTypes[0];章节节点 attribute 为 null
    const attr =
      node.attribute && typeof node.attribute === "object" ? node.attribute : null;
    const type =
      (typeof attr?.type === "string" && attr.type) ||
      (Array.isArray(node.contentTypes) &&
      typeof node.contentTypes[0] === "string"
        ? node.contentTypes[0]
        : undefined) ||
      undefined;
    out.push({
      lessonId: String(id),
      lessonName: String(node.name ?? node.title ?? node.lessonName ?? id),
      finished: isNodeFinished(node),
      type,
    });
  }
  return out;
}

/**
 * 是否可自动挂机的内容类型:video/audio(xgplayer 播放)之外
 * (考试/文档/直播等)跳过不处理(不标记不阻塞),剩余全为此类时视为课程任务完成。
 * 扩展性:后续支持考试等类型时,将类型加入 AUTO_STUDY_CONTENT_TYPES
 * 并在 buildCurrentLessonTasks 的任务构建处扩展按类型分发。
 * 类型未知(如纯 DOM 数据源解析不到类型)时保持旧行为按可自动类型处理
 * 图文候选并入(迭代 3):ARTICLE_CONTENT_TYPES 交由 SanjiekeArticle 处理
 */
function isAutoStudyType(type?: string): boolean {
  if (!type) {
    return true;
  }
  const whitelist = [
    ...(SANJIEKE_CONSTANTS.AUTO_STUDY_CONTENT_TYPES as readonly string[]),
    ...(SANJIEKE_CONSTANTS.ARTICLE_CONTENT_TYPES as readonly string[]),
  ];
  return whitelist.includes(type);
}

/** 是否图文类型课时(构建 SanjiekeArticle;候选值待实测校准,见 spec Assumption #10) */
function isArticleType(type?: string): boolean {
  return (
    !!type &&
    (SANJIEKE_CONSTANTS.ARTICLE_CONTENT_TYPES as readonly string[]).includes(
      type
    )
  );
}

/** 弹性判定节点完成状态(多字段兼容,仅认可信字段,不确定时保守返回未完成) */
function isNodeFinished(node: any): boolean {
  // 实测响应完成状态在 attribute.isFinish(0/1 数字,2026-09-22 课程 34002056),
  // 章节节点 attribute 为 null
  const attr = node.attribute;
  if (attr && typeof attr === "object") {
    if (typeof attr.isFinish === "number") {
      return attr.isFinish === 1;
    }
    if (typeof attr.isFinish === "boolean") {
      return attr.isFinish;
    }
  }
  if (typeof node.isFinished === "boolean") {
    return node.isFinished;
  }
  if (typeof node.finished === "boolean") {
    return node.finished;
  }
  if (typeof node.completedFlag === "boolean") {
    return node.completedFlag;
  }
  if (node.hasLearned !== undefined) {
    return String(node.hasLearned) === "1" || node.hasLearned === true;
  }
  if (node.studyStatus !== undefined && node.studyStatus !== null) {
    return String(node.studyStatus) === "1";
  }
  return false;
}

/**
 * 从左侧课时列表 DOM 解析课时(用户实测结构,兜底/校正 content/tree):
 * .menu-container > .chapter-container > .node-item[node-id]
 * 完成标记: 容器 class chapter-finish 或节点内 .status-con.section-finish
 */
function getLessonsFromDom(): LessonInfo[] | null {
  const nodes = document.querySelectorAll(
    SANJIEKE_CONSTANTS.SELECTORS.LESSON_NODE,
  );
  if (!nodes || nodes.length === 0) {
    return null;
  }
  const lessons: LessonInfo[] = [];
  nodes.forEach((node) => {
    const el = node as HTMLElement;
    const lessonId = el.getAttribute("node-id");
    if (!lessonId) {
      return;
    }
    const name =
      el
        .querySelector(SANJIEKE_CONSTANTS.SELECTORS.LESSON_NODE_NAME)
        ?.textContent?.trim() || lessonId;
    const container = el.closest(".chapter-container");
    const finished =
      (!!container &&
        container.classList.contains(
          SANJIEKE_CONSTANTS.CSS_CLASSES.LESSON_FINISHED,
        )) ||
      !!el.querySelector(SANJIEKE_CONSTANTS.SELECTORS.LESSON_FINISHED_STATUS);
    lessons.push({ lessonId: String(lessonId), lessonName: name, finished });
  });
  return lessons.length > 0 ? lessons : null;
}

/** 合并 DOM 与内容树两个课时数据源:DOM 展示顺序为准,完成状态取并集,类型以树为准(DOM 解析不到类型) */
function mergeLessons(
  treeLessons: LessonInfo[],
  domLessons: LessonInfo[] | null,
): LessonInfo[] {
  if (!domLessons || domLessons.length === 0) {
    return treeLessons;
  }
  const treeMap = new Map(treeLessons.map((l) => [l.lessonId, l]));
  return domLessons.map((d) => {
    const t = treeMap.get(d.lessonId);
    return {
      lessonId: d.lessonId,
      lessonName: d.lessonName || t?.lessonName || d.lessonId,
      finished: d.finished || !!t?.finished,
      type: d.type ?? t?.type,
    };
  });
}

/** 弹性识别毕业字段:对象树中含 graduated 的真值字段 */
function findGraduated(obj: any, depth: number = 0): boolean {
  if (depth > 4 || obj === null || obj === undefined) {
    return false;
  }
  if (typeof obj === "boolean") {
    return obj;
  }
  if (typeof obj === "object") {
    for (const key of Object.keys(obj)) {
      if (/graduated/i.test(key)) {
        const val = obj[key];
        if (val === true || val === 1 || val === "1" || val === "true") {
          return true;
        }
      }
      if (typeof obj[key] === "object" && findGraduated(obj[key], depth + 1)) {
        return true;
      }
    }
  }
  return false;
}
