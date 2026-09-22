/*
 * @Description: 三节课 课时视频任务
 * xgplayer <video> 懒创建(点击播放后才注入 DOM),需先点击播放区触发注入,
 * 再轮询等待 video 元素出现后挂监听;起播点 .xgplayer-play,兜底 video.play()
 *
 * Copyright (c) 2026 by lzlj, All Rights Reserved.
 */
import { Application } from "@App/internal/application";
import { SanjiekeTaskBase } from "./task";
import { SanjiekeTaskInfo } from "./types";
import { SANJIEKE_CONSTANTS } from "./constants";
import { setLessonDoneMark, parseStudyUrl } from "./utils/utils";

/**
 * SanjiekeVideo 课时视频任务
 * 等待 video 注入 → 起播 → 倍速/静音/防暂停 → ended 推进
 */
export class SanjiekeVideo extends SanjiekeTaskBase {
  /** 任务上下文信息 */
  public taskinfo: SanjiekeTaskInfo;
  /** 视频元素(懒创建,Start 阶段注入后才有) */
  private video: HTMLVideoElement;
  /** 是否已完成(ended 触发) */
  public done: boolean;
  /** 暂停事件时间戳(暂停风暴检测用) */
  private pauseTimestamps: number[] = [];
  /** 自动恢复的连续重试次数 */
  private playRetryCount: number = 0;
  /** 是否已放弃自动恢复(熔断保护) */
  private playAborted: boolean = false;
  /** 上次点击播放按钮的时间(限流用) */
  private lastPlayClickTime: number = 0;

  constructor(taskinfo: SanjiekeTaskInfo) {
    super();
    this.taskinfo = taskinfo;
    this.done = false;
  }

  public Type(): "video" {
    return "video";
  }

  public Done(): boolean {
    return this.done;
  }

  public Init(): Promise<any> {
    return Promise.resolve(true);
  }

  public Start(): Promise<any> {
    return new Promise<void>(async (resolve, reject) => {
      Application.App.log.Info(
        `[三节课视频] 开始任务: ${this.taskinfo.lessonName ||
          this.taskinfo.lessonId}`,
      );

      // 1. 触发 xgplayer 懒创建:点击播放区锚点(video 注入前 .xgplayer-play 可能尚不存在)
      this.triggerPlayerCreation();

      // 2. 轮询等待 <video> 注入(纳入 TimerManager,Stop 时可取消)
      let attempts = 0;
      const maxAttempts = Math.floor(
        SANJIEKE_CONSTANTS.VIDEO_WAIT_TIMEOUT_MS /
          SANJIEKE_CONSTANTS.CHECK_INTERVAL_MS,
      );
      const waitVideo = () => {
        if (this.done) {
          resolve();
          return;
        }
        // SPA 换课守卫:URL 已切到其他课时(站点自动连播)时放弃本任务,
        // 由任务集按服务端状态自愈,避免操作错误课时的播放器
        const currentLessonId = parseStudyUrl()?.lessonId;
        if (
          currentLessonId &&
          currentLessonId !== String(this.taskinfo.lessonId)
        ) {
          Application.App.log.Info(
            `[三节课视频] URL 课时(${currentLessonId})与任务课时(${this.taskinfo.lessonId})不一致,放弃本任务`,
          );
          this.done = true;
          this.callEvent("complete");
          resolve();
          return;
        }
        attempts++;
        const video = document.querySelector(
          SANJIEKE_CONSTANTS.SELECTORS.VIDEO,
        ) as HTMLVideoElement;
        if (video) {
          this.video = video;
          Application.App.log.Info("[三节课视频] 视频元素已注入,挂载监听");
          this.setupVideoHandlers();
          this.startPlayback();
          resolve();
          return;
        }
        if (attempts >= maxAttempts) {
          // 不 reject:避免 MoocLauncher 的 once 标志卡死;
          // 走任务集自愈(推进 → 兜底标记 → 整页重载重试,有重试上限)
          Application.App.log.Error(
            `[三节课视频] ${SANJIEKE_CONSTANTS.ERROR_MESSAGES.VIDEO_NOT_FOUND}`,
          );
          this.done = true;
          this.callEvent("complete");
          resolve();
          return;
        }
        // 每隔几次重试再次点击播放区,防止首次点击被站点吞掉
        if (attempts % 8 === 0) {
          this.triggerPlayerCreation();
        }
        this.timerManager.setTimeout(
          "waitVideo",
          waitVideo,
          SANJIEKE_CONSTANTS.CHECK_INTERVAL_MS,
        );
      };
      waitVideo();
    });
  }

  /**
   * 触发 xgplayer 创建/起播(优先级经用户实测校准):
   * 1. .xgplayer-start 大按钮覆盖层 —— 完整起播流程(解除 nostart,正常渲染);
   * 2. .xgplayer-play —— 仅起播媒体层(UI 停留 nostart,画面被海报盖住);
   * 3. poster / 播放区锚点 —— 兜底
   */
  private triggerPlayerCreation(): void {
    const startBtn = document.querySelector(
      SANJIEKE_CONSTANTS.SELECTORS.START_BUTTON,
    ) as HTMLElement;
    if (startBtn) {
      startBtn.click();
      Application.App.log.Debug("[三节课视频] 已点击大按钮起播覆盖层");
      return;
    }
    const playBtn = document.querySelector(
      SANJIEKE_CONSTANTS.SELECTORS.PLAY_BUTTON,
    ) as HTMLElement;
    if (playBtn) {
      playBtn.click();
    }
    const poster = document.querySelector(
      SANJIEKE_CONSTANTS.SELECTORS.POSTER,
    ) as HTMLElement;
    if (poster) {
      poster.click();
    }
    const container = document.querySelector(
      SANJIEKE_CONSTANTS.SELECTORS.VIDEO_CONTAINER,
    ) as HTMLElement;
    if (container) {
      container.click();
    }
  }

  /** 挂载视频事件监听(全部托管,Stop 时统一移除) */
  private setupVideoHandlers(): void {
    // 应用倍速/静音配置
    const applyPlaybackSettings = (reason: string) => {
      const mute = Application.App.config.video_mute;
      const rate = Application.App.config.video_multiple;
      this.video.volume = mute ? 0 : 1;
      this.video.playbackRate = rate;
      Application.App.log.Info(
        `[三节课视频] (${reason}) 应用播放设置: 静音=${mute} 倍速=${rate}x`,
      );
    };

    this.addManagedListener(this.video, "play", () => {
      this.resetPlayRetry();
      applyPlaybackSettings("play");
    });
    this.addManagedListener(this.video, "playing", () =>
      applyPlaybackSettings("playing"),
    );

    // 倍速回置:站点重置速率后自动恢复
    this.addManagedListener(this.video, "ratechange", () => {
      const rate = Application.App.config.video_multiple;
      if (this.video.playbackRate !== rate) {
        Application.App.log.Debug(
          `[三节课视频] 检测到速率被重置为 ${this.video.playbackRate}x，回置为 ${rate}x`,
        );
        this.video.playbackRate = rate;
      }
    });

    // 防暂停:pause 自动恢复 + 暂停风暴熔断(60s 内超 8 次停止恢复)
    this.addManagedListener(
      this.video,
      "pause",
      () => {
        if (this.playAborted || this.done) {
          return;
        }
        const now = Date.now();
        this.pauseTimestamps.push(now);
        this.pauseTimestamps = this.pauseTimestamps.filter(
          (t) => now - t <= SANJIEKE_CONSTANTS.PAUSE_STORM_WINDOW_MS,
        );
        if (
          this.pauseTimestamps.length >=
          SANJIEKE_CONSTANTS.PAUSE_STORM_MAX_COUNT
        ) {
          this.abortAutoResume();
          Application.App.log.Error(
            "[三节课视频] 60秒内暂停超过8次（切窗/限制弹窗），已停止自动恢复，请通过日志导出排查",
          );
          return;
        }
        Application.App.log.Debug("[三节课视频] 视频被暂停,尝试恢复播放");
        this.timerManager.setTimeout(
          "pauseResume",
          () => {
            if (
              this.video.paused &&
              !this.done &&
              Application.App.config.auto
            ) {
              this.clickPlay();
            }
          },
          100,
        );
      },
      true,
    );

    // 播放结束 → 写课时完成标记 → 推进下一课时
    this.addManagedListener(
      this.video,
      "ended",
      () => {
        Application.App.log.Info("[三节课视频] 视频播放结束");
        this.timerManager.clearInterval("videoAutoResume");
        this.markLessonDone();
        this.done = true;
        this.callEvent("complete");
      },
      { once: true },
    );

    // 自动恢复定时器
    this.startAutoResumeInterval();
  }

  /** 启动自动恢复定时器:视频意外暂停时周期性恢复 */
  private startAutoResumeInterval(): void {
    this.timerManager.setInterval(
      "videoAutoResume",
      () => {
        if (!Application.App.config.auto || this.done) {
          return;
        }
        if (!this.video.paused) {
          this.resetPlayRetry();
          return;
        }
        if (this.playAborted) {
          return;
        }
        this.playRetryCount++;
        if (this.playRetryCount > SANJIEKE_CONSTANTS.MAX_PLAY_RETRY) {
          this.abortAutoResume();
          return;
        }
        Application.App.log.Debug(
          `[三节课视频] 视频暂停，尝试恢复播放(${this.playRetryCount}/${SANJIEKE_CONSTANTS.MAX_PLAY_RETRY})`,
        );
        this.clickPlay();
      },
      SANJIEKE_CONSTANTS.VIDEO_PLAY_RESUME_INTERVAL_MS,
    );
  }

  /** 起播:先静音绕过自动播放策略,点击 .xgplayer-play,兜底 video.play() */
  private startPlayback(): void {
    // 重播场景(用户实测):视频此前看过但时长可能不够,播放器处于 ended/is-replay 状态。
    // 此时不能直接判完成,必须重新完整播放,由重播结束后的 ended 事件驱动完成判定
    const root = document.querySelector(
      SANJIEKE_CONSTANTS.SELECTORS.VIDEO_CONTAINER,
    ) as HTMLElement;
    if (this.video.ended || root?.classList.contains("xgplayer-is-replay")) {
      Application.App.log.Info(
        "[三节课视频] 检测到重播状态(此前已看但时长可能不足),重新完整播放",
      );
    }
    // 播放中(如页面恢复时已自动起播)不点击:.xgplayer-play 是切换按钮,
    // 播放中再点会变成暂停,与自动恢复形成"暂停风暴"
    if (!this.video.paused) {
      Application.App.log.Info("[三节课视频] 视频已在播放,仅同步播放设置");
      this.applySettings();
      return;
    }
    this.video.muted = true;
    this.clickPlay();
  }

  /** 点击播放(限流),优先 .xgplayer-play,兜底 video.play() */
  private clickPlay(): void {
    if (this.done || !this.video.paused) {
      return;
    }
    // 限流:多事件源叠加触发时防止密集点击导致播放器反复启停
    const now = Date.now();
    if (
      now - this.lastPlayClickTime <
      SANJIEKE_CONSTANTS.PLAY_CLICK_MIN_INTERVAL_MS
    ) {
      return;
    }
    this.lastPlayClickTime = now;

    // 先静音绕过浏览器自动播放策略
    this.video.muted = true;
    // 播放前应用倍速(部分播放器起播时会重置速率)
    this.video.playbackRate = Application.App.config.video_multiple;

    // 起播入口(优先级经用户实测校准):.xgplayer-start 大按钮覆盖层优先
    // (完整起播流程,解除 nostart);其次 .xgplayer-play;poster 与 video.play() 兜底
    const startBtn = document.querySelector(
      SANJIEKE_CONSTANTS.SELECTORS.START_BUTTON,
    ) as HTMLElement;
    if (startBtn) {
      Application.App.log.Debug("[三节课视频] 点击大按钮起播覆盖层");
      startBtn.click();
    } else {
      const playBtn = document.querySelector(
        SANJIEKE_CONSTANTS.SELECTORS.PLAY_BUTTON,
      ) as HTMLElement;
      if (playBtn) {
        Application.App.log.Debug("[三节课视频] 点击播放按钮");
        playBtn.click();
      } else {
        const poster = document.querySelector(
          SANJIEKE_CONSTANTS.SELECTORS.POSTER,
        ) as HTMLElement;
        if (poster) {
          Application.App.log.Debug("[三节课视频] 点击海报层兜底起播");
          poster.click();
        } else {
          Application.App.log.Debug(
            "[三节课视频] 未找到播放按钮,直接调用 play()",
          );
          this.video
            .play()
            .then(() => this.resetPlayRetry())
            .catch((e) => {
              // 失败后不回点播放按钮,避免形成反馈死循环,由自动恢复定时器接管
              this.playRetryCount++;
              Application.App.log.Warn(
                `[三节课视频] 播放失败(${this.playRetryCount}/${SANJIEKE_CONSTANTS.MAX_PLAY_RETRY}):`,
                e?.message,
              );
              if (this.playRetryCount >= SANJIEKE_CONSTANTS.MAX_PLAY_RETRY) {
                this.abortAutoResume();
              }
            });
        }
      }
    }
    this.applySettings();
  }

  /** 应用静音/倍速配置 */
  private applySettings(): void {
    const mute = Application.App.config.video_mute;
    const rate = Application.App.config.video_multiple;
    this.video.volume = mute ? 0 : 1;
    this.video.playbackRate = rate;
  }

  private resetPlayRetry(): void {
    this.playRetryCount = 0;
    this.playAborted = false;
  }

  /** 放弃自动恢复(熔断),避免黑屏/死循环耗尽资源 */
  private abortAutoResume(): void {
    if (this.playAborted) {
      return;
    }
    this.playAborted = true;
    this.timerManager.clearInterval("videoAutoResume");
    Application.App.log.Error("[三节课视频] 视频长时间无法播放,已停止自动恢复");
  }

  /** 写课时完成标记(防树状态回写延迟导致重复播放) */
  private markLessonDone(): void {
    setLessonDoneMark(this.taskinfo.courseId, this.taskinfo.lessonId);
    Application.App.log.Info(
      `[三节课视频] 课时完成标记已写入: ${this.taskinfo.lessonId}`,
    );
  }
}
