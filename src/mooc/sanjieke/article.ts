/*
 * @Description: 三节课 图文(article)课时任务:渐进滚动至底部 + 平台 finished 信号确认
 * 完成信号: 站点在图文阅读到底后发送 POST /study/0/{courseId}/{lessonId}/finished
 * (用户 curl 实测 2026-09-23),与视频 setContentFinished 确认制对称;
 * 渐进分步滚动(实测快速连滚会使站点主线程长阻塞,scrollTop 直跳不触发完成判定)
 *
 * Copyright (c) 2026 by lzlj, All Rights Reserved.
 */
import { Application } from "@App/internal/application";
import { SanjiekeTaskBase } from "./task";
import { SanjiekeTaskInfo } from "./types";
import { SANJIEKE_CONSTANTS } from "./constants";
import {
  hookHttpRequest,
  removeHttpRequestHook,
  setLessonDoneMark,
} from "./utils/utils";

/**
 * SanjiekeArticle 图文课时任务
 */
export class SanjiekeArticle extends SanjiekeTaskBase {
  public taskinfo: SanjiekeTaskInfo;
  public done: boolean = false;
  /** 平台完成信号(finished)是否已拦截(幂等) */
  private finishSignalReceived: boolean = false;
  /** 滚动步数(熔断用) */
  private scrollSteps: number = 0;

  constructor(taskinfo: SanjiekeTaskInfo) {
    super();
    this.taskinfo = taskinfo;
  }

  public Type(): "video" {
    return "video";
  }

  public Done(): boolean {
    return this.done;
  }

  public Init(): Promise<any> {
    return new Promise((resolve, reject) => {
      const container = this.getScrollContainer();
      if (!container) {
        Application.App.log.Error(
          "[三节课图文] 未找到图文滚动容器 .right-content"
        );
        reject(new Error("article scroll container not found"));
        return;
      }
      Application.App.log.Info(
        `[三节课图文] 初始化: 内容高度 ${container.scrollHeight}px / 视口 ${container.clientHeight}px`
      );
      resolve(true);
    });
  }

  public Start(): Promise<any> {
    return new Promise<void>((resolve) => {
      Application.App.log.Info(
        `[三节课图文] 开始任务: ${this.taskinfo.lessonName || this.taskinfo.lessonId}`
      );

      // 平台完成信号钩子: POST /study/0/{courseId}/{lessonId}/finished
      // (无请求体,响应 200 即平台确认阅读完成;对称 video.ts 的 setContentFinished 确认制)
      // 实测(2026-09-24):站点对图文节为"加载后 10s 定时标记完成"(站点日志原话),
      // 滚动到底非必要条件;钩子命中可早于 30s 兜底收口
      hookHttpRequest(
        "/finished",
        (response, context, url) => {
          if (this.done) {
            return;
          }
          if (
            !url ||
            !url.includes(`/content/${this.taskinfo.lessonId}/finished`)
          ) {
            return;
          }
          Application.App.log.Info("[三节课图文] 拦截到平台完成信号 finished");
          this.finishSignalReceived = true;
          this.finishArticle("平台完成信号");
        },
        this
      );

      // 渐进分步滚动(每步 dispatch scroll 事件;快速连滚实测会使站点主线程长阻塞)
      // 先等图文内容渲染完成:实测 article 组件挂载(00:58:37)晚于 Start(00:58:36.8),
      // 内容未挂载时 scrollHeight≈clientHeight,触底判定恒真 → 滚动循环从未执行(实测缺陷)
      this.waitContentReady(resolve);
    });
  }

  /**
   * 等待图文内容撑开滚动容器(article 组件挂载完成):
   * scrollHeight 超出视口 100px 以上视为就绪;超时走兜底收口
   */
  private waitContentReady(resolve: () => void): void {
    const waitStartAt = Date.now();
    const check = () => {
      if (this.done) {
        resolve();
        return;
      }
      const container = this.getScrollContainer();
      if (
        container &&
        container.scrollHeight >
          container.clientHeight +
            SANJIEKE_CONSTANTS.ARTICLE_CONTENT_MIN_SCROLLABLE_PX
      ) {
        Application.App.log.Info(
          `[三节课图文] 内容已就绪(高度 ${container.scrollHeight}px),开始渐进滚动`
        );
        this.scrollStep(resolve);
        return;
      }
      if (
        Date.now() - waitStartAt >=
        SANJIEKE_CONSTANTS.ARTICLE_CONTENT_READY_TIMEOUT_MS
      ) {
        Application.App.log.Warn(
          "[三节课图文] 等待图文内容渲染超时,走兜底收口"
        );
        this.finishArticle("内容就绪超时兜底");
        resolve();
        return;
      }
      this.timerManager.setTimeout("articleContentWait", check, 500);
    };
    check();
  }

  /** 渐进滚动单步:触底 → 转入完成信号等待;超步数熔断 → 强制置底 */
  private scrollStep(resolve: () => void): void {
    if (this.done) {
      resolve();
      return;
    }
    const container = this.getScrollContainer();
    if (!container) {
      Application.App.log.Error("[三节课图文] 滚动容器消失,走兜底收口");
      this.finishArticle("容器消失兜底");
      resolve();
      return;
    }

    // 内容尚未撑开(article 组件挂载中/懒加载)时触底判定不可靠,稍后重试
    const hasScrollableContent =
      container.scrollHeight >
      container.clientHeight +
        SANJIEKE_CONSTANTS.ARTICLE_CONTENT_MIN_SCROLLABLE_PX;
    if (!hasScrollableContent) {
      this.timerManager.setTimeout(
        "articleScroll",
        () => this.scrollStep(resolve),
        SANJIEKE_CONSTANTS.ARTICLE_SCROLL_INTERVAL_MS
      );
      return;
    }

    const atBottom =
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 2;
    if (atBottom) {
      Application.App.log.Info(
        "[三节课图文] 已滚动至内容底部,等待平台完成信号(超时兜底)"
      );
      this.waitForFinishSignal();
      resolve();
      return;
    }

    this.scrollSteps++;
    if (this.scrollSteps > SANJIEKE_CONSTANTS.ARTICLE_SCROLL_MAX_STEPS) {
      Application.App.log.Warn(
        "[三节课图文] 滚动步数超上限,强制置底并等待完成信号"
      );
      container.scrollTop = container.scrollHeight;
      container.dispatchEvent(new Event("scroll", { bubbles: true }));
      this.waitForFinishSignal();
      resolve();
      return;
    }

    container.scrollTop = Math.min(
      container.scrollTop + SANJIEKE_CONSTANTS.ARTICLE_SCROLL_STEP_PX,
      container.scrollHeight
    );
    container.dispatchEvent(new Event("scroll", { bubbles: true }));

    // 滚动进度可见性(Info 已修复为面板+console 双写;每 5 步报一次)
    if (this.scrollSteps % 5 === 0) {
      Application.App.log.Info(
        `[三节课图文] 滚动进度: ${Math.round(container.scrollTop)}/${container.scrollHeight}px`
      );
    }

    // 信号可能在滚动途中到达(阅读时长/进度达标即发)
    if (this.finishSignalReceived) {
      resolve();
      return;
    }
    this.timerManager.setTimeout(
      "articleScroll",
      () => this.scrollStep(resolve),
      SANJIEKE_CONSTANTS.ARTICLE_SCROLL_INTERVAL_MS
    );
  }

  /** 触底后轮询等待平台 finished 信号;超时走兜底收口(record_duration 已上报阅读时长) */
  private waitForFinishSignal(): void {
    const waitStartAt = Date.now();
    const check = () => {
      if (this.done) {
        return;
      }
      if (this.finishSignalReceived) {
        return; // 钩子回调已收口
      }
      if (
        Date.now() - waitStartAt >=
        SANJIEKE_CONSTANTS.ARTICLE_FINISH_WAIT_TIMEOUT_MS
      ) {
        Application.App.log.Warn(
          "[三节课图文] 等待平台 finished 信号超时,走兜底收口(阅读时长已由 record_duration 上报)"
        );
        this.finishArticle("超时兜底");
        return;
      }
      this.timerManager.setTimeout("articleFinishWait", check, 1000);
    };
    check();
  }

  /** 幂等收口:写课时完成标记 + 任务完成(单一收口,信号/兜底/容器消失共用) */
  private finishArticle(reason: string): void {
    if (this.done) {
      return;
    }
    this.done = true;
    setLessonDoneMark(this.taskinfo.courseId, this.taskinfo.lessonId);
    Application.App.log.Info(
      `[三节课图文] 课时完成(${reason}): ${this.taskinfo.lessonName || this.taskinfo.lessonId}`
    );
    removeHttpRequestHook("/finished", this);
    this.callEvent("complete");
  }

  private getScrollContainer(): HTMLElement | null {
    return document.querySelector(
      SANJIEKE_CONSTANTS.SELECTORS.ARTICLE_SCROLL_CONTAINER
    ) as HTMLElement | null;
  }

  public Stop(): Promise<void> {
    removeHttpRequestHook("/finished", this);
    return super.Stop();
  }
}
