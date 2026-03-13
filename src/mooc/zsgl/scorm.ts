/*
 * @Author: guotao
 * @Date: 2025-03-12 17:19:39
 * @LastEditors: guotao
 * @LastEditTime: 2026-03-13 14:59:24
 * @FilePath: \course-tools\src\mooc\zsgl\scorm.ts
 * @Description: zsgl SCORM/音频任务模块
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */
import { Mooc } from "@App/internal/app/mooc";
import { MoocTaskSet } from "@App/internal/app/mooc";
import { Task, TaskType } from "@App/internal/app/task";
import { ZsglTask } from "./task";
import { CssBtn } from "../chaoxing/utils";
import { ZsglCourseControlBar } from "./course";
import { createBtn, protocolPrompt } from "@App/internal/utils/utils";
import { Application } from "@App/internal/application";
import { hookHttpRequest, TimerManager, setupEventPrevention, setupVideoEventPrevention, findElementByText } from "./utils/utils";
import { ZsglTaskControlBar } from "./task";
import { TaskInfo } from "./types";
import { ZSGL_CONSTANTS } from "./constants";

/**
 * ZsglAudio SCORM/音频任务类
 */
export class ZsglAudio extends ZsglTask {
    /** 外层定时器 */
    protected outerTimer: NodeJS.Timeout;
    /** 定时器 */
    protected timer: NodeJS.Timeout;
    /** 视频元素 */
    protected video: HTMLVideoElement;
    /** 控制栏 */
    protected controlBar: HTMLDivElement;
    /** iframe元素 */
    protected iframe: HTMLIFrameElement;
    /** 任务元素 */
    protected taskDiv: HTMLSpanElement;
    /** 退出按钮 */
    protected exitBtn: HTMLSpanElement;
    /** 定时器管理器 */
    private timerManager: TimerManager = new TimerManager();

    public async Start(): Promise<any> {
        await new Promise<void>(async (resolve, reject) => {
            Application.App.log.Debug("开始点击任务按钮", this.taskDiv);
            this.taskDiv.click();

            // 处理页面的事件监听函数的检测
            setupEventPrevention(window);
            setupEventPrevention(document);

            this.timerManager.setInterval("outerInit", () => {
                const startButton = document.querySelector(ZSGL_CONSTANTS.SELECTORS.MUI_BUTTON_ROOT);
                Application.App.log.Debug("Start开始按钮", this.taskinfo);

                if (startButton && this.taskinfo.cwType === "scorm") {
                    Application.App.log.Debug("开始点击开始按钮", startButton);
                    this.timerManager.clearInterval("outerInit");

                    const clickHandler = () => {
                        this.findvideoinit()
                            .then(() => {
                                Application.App.log.Debug("视频任务初始化完成");
                                this.exitBtn = document.querySelector(ZSGL_CONSTANTS.SELECTORS.EXIT_SPAN);
                                const container = document.querySelector(ZSGL_CONSTANTS.SELECTORS.WATERMARK_FRAME) || document.body;
                                const prev = document.createElement("div");
                                container.prepend(prev);
                                const bar = new ZsglCourseControlBar(prev);
                                this.initPlayer();
                                Application.App.log.Debug("退出按钮", this.exitBtn);
                                resolve();
                            })
                            .catch((e) => {
                                Application.App.log.Error(e.message);
                                reject(e);
                            });
                    };

                    startButton.removeEventListener("click", clickHandler);
                    startButton.addEventListener("click", clickHandler, { once: true });
                    (startButton as HTMLElement).click();
                } else {
                    this.timerManager.clearInterval("outerInit");
                    resolve();
                }
            }, ZSGL_CONSTANTS.VIDEO_SEARCH_INTERVAL_MS);
        });

        Application.App.log.Debug("外层初始化最终完成");
    }

    public Type(): TaskType {
        return "audio";
    }

    /** 初始化播放器 */
    protected initPlayer(): void {
        Application.App.log.Debug("播放器初始化配置", {
            mute: Application.App.config.video_mute,
            multiple: Application.App.config.video_multiple,
        });

        this.video.volume = Application.App.config.video_mute ? 0 : this.video.volume; // 设置音量
        this.video.muted = false;
        this.video.currentTime = 0;

        // 添加对视频元素的事件阻止
        setupEventPrevention(window);
        setupEventPrevention(document);
        setupVideoEventPrevention(this.video);

        // 监听播放速率变化
        this.watchPlaybackRate();

        // 延迟重置播放时间来实现未完成的任务时常不够的问题
        setTimeout(() => {
            Application.App.log.Debug(this.video.currentTime, "播放时间");
            this.video.currentTime = 0;
            this.setPlaybackRate();
        }, ZSGL_CONSTANTS.PLAYER_INIT_DELAY_MS);

        // 等待视频源加载后再播放
        this.waitForVideoSourceAndPlay();
    }

    /** 设置视频播放速率 */
    private setPlaybackRate(): void {
        const rate = Application.App.config.video_multiple;
        Application.App.log.Debug(`[播放速率] 设置播放速率为 ${rate}x`);
        this.video.playbackRate = rate;
    }

    /** 监听播放速率变化并保持设置 */
    private watchPlaybackRate(): void {
        const rate = Application.App.config.video_multiple;
        this.video.addEventListener('ratechange', () => {
            if (this.video.playbackRate !== rate) {
                Application.App.log.Debug(`[播放速率] 检测到速率被重置为 ${this.video.playbackRate}x，重新设置为 ${rate}x`);
                this.video.playbackRate = rate;
            }
        });
    }

    /** 等待视频源加载并播放 */
    private waitForVideoSourceAndPlay(): void {
        let attemptCount = 0;
        const maxAttempts = 20;

        const tryPlay = () => {
            attemptCount++;
            
            // 检查视频是否有源
            const hasSource = this.video.src || this.video.currentSrc || 
                              this.video.querySelector('source')?.src ||
                              this.video.readyState >= 1;

            Application.App.log.Debug(`[播放尝试] 第 ${attemptCount} 次`, {
                src: this.video.src,
                currentSrc: this.video.currentSrc,
                readyState: this.video.readyState,
                hasSource: !!hasSource
            });

            if (hasSource) {
                Application.App.log.Info("[播放尝试] 视频源已加载，开始播放");
                this.setPlaybackRate();
                this.video.currentTime = 0;
                if (Application.App.config.auto) {
                    this.clickPlayButton();
                }
                return;
            }

            if (attemptCount >= maxAttempts) {
                Application.App.log.Error("[播放尝试] 等待视频源超时");
                return;
            }

            // 继续等待
            setTimeout(tryPlay, 1000);
        };

        // 立即尝试一次
        tryPlay();

        // 同时监听视频事件
        this.video.addEventListener('loadedmetadata', () => {
            Application.App.log.Info("[视频事件] loadedmetadata - 视频元数据已加载");
            this.setPlaybackRate();
            if (Application.App.config.auto) {
                this.clickPlayButton();
            }
        }, { once: true });

        this.video.addEventListener('canplay', () => {
            Application.App.log.Info("[视频事件] canplay - 视频可以播放");
            this.setPlaybackRate();
            if (Application.App.config.auto) {
                this.clickPlayButton();
            }
        }, { once: true });
    }

    /** 点击播放按钮 */
    private clickPlayButton(): void {
        const xgStartBtn = document.querySelector('xg-start.xgplayer-start') as HTMLElement;
        
        // 先静音，绕过浏览器自动播放策略
        this.video.muted = true;
        
        if (xgStartBtn) {
            Application.App.log.Debug("[点击播放] 找到播放按钮，点击播放", xgStartBtn);
            xgStartBtn.click();
        } else {
            Application.App.log.Debug("[点击播放] 未找到播放按钮，尝试直接播放");
            this.video.play().then(() => {
                Application.App.log.Debug("[点击播放] 播放成功");
            }).catch((e) => {
                Application.App.log.Warn("[点击播放] 播放失败:", e.message);
                const btn = document.querySelector('xg-start.xgplayer-start') as HTMLElement;
                if (btn) {
                    btn.click();
                }
            });
        }
        this.setMute();
        this.setPlaybackRate();
    }

    public Init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const taskDiv = findElementByText("span", this.taskinfo.fileName);

            Application.App.log.Debug("寻找taskDiv", this.taskinfo.fileName);
            if (taskDiv) {
                this.taskDiv = taskDiv;
                Application.App.log.Debug("开始初始化视频", taskDiv);
                resolve();
            } else {
                Application.App.log.Error("未找到任务元素");
                reject(new Error(ZSGL_CONSTANTS.ERROR_MESSAGES.TASK_NOT_FOUND));
            }
        });
    }

    public Stop(): Promise<void> {
        this.timerManager.clearAll();
        clearInterval(this.outerTimer);
        clearInterval(this.timer);
        return Promise.resolve();
    }

    /** 查找并初始化视频 */
    private findvideoinit(): Promise<void> {
        return new Promise((resolve, reject) => {
            let attemptCount = 0;

            this.timerManager.setInterval("videoSearch", () => {
                attemptCount++;
                Application.App.log.Debug(`[视频查找] 第 ${attemptCount} 次尝试`);

                if (attemptCount > ZSGL_CONSTANTS.MAX_ATTEMPT_COUNT) {
                    this.timerManager.clearInterval("videoSearch");
                    reject(new Error(ZSGL_CONSTANTS.ERROR_MESSAGES.VIDEO_NOT_FOUND));
                    return;
                }

                const video = this.deepFindVideo(document);
                if (video) {
                    this.timerManager.clearInterval("videoSearch");
                    Application.App.log.Info("[视频查找] 视频元素查找成功", {
                        id: video.id,
                        src: video.src,
                        currentSrc: video.currentSrc,
                        readyState: video.readyState
                    });
                    clearInterval(this.outerTimer);
                    this.video = video;

                    // 添加视频暂停自动恢复的定时器
                    this.setupVideoAutoResume();
                    this.setupVideoEndHandler();

                    resolve();
                } else {
                    Application.App.log.Debug(`[视频查找] 第 ${attemptCount} 次尝试未找到视频`);
                }
            }, ZSGL_CONSTANTS.VIDEO_SEARCH_INTERVAL_MS);
        });
    }

    /** 深度查找视频元素 */
    private deepFindVideo(doc: Document): HTMLVideoElement | null {
        try {
            Application.App.log.Debug(`[视频查找] 正在检查文档: ${doc.title || "未命名文档"}`);

            const videos = doc.querySelectorAll("video");
            for (const video of Array.from(videos)) {
                const hasSource = video.src || video.currentSrc || video.querySelector("source")?.src;
                Application.App.log.Debug("[视频查找] 检查视频元素", {
                    id: video.id,
                    src: video.src,
                    currentSrc: video.currentSrc,
                    hasSource: !!hasSource,
                    readyState: video.readyState,
                    parent: video.parentElement?.tagName,
                });
                if (hasSource) {
                    Application.App.log.Info("[视频查找] 找到有源的视频元素");
                    return video;
                }
            }

            const frames = doc.querySelectorAll("frame, iframe");
            Application.App.log.Debug(`[视频查找] 发现 ${frames.length} 个框架`);

            for (const frame of Array.from(frames) as (HTMLFrameElement | HTMLIFrameElement)[]) {
                try {
                    Application.App.log.Debug(`[视频查找] 检查框架:`, {
                        id: frame.id,
                        src: frame.src?.substring(0, 50),
                    });

                    const frameDoc = frame.contentDocument || frame.contentWindow?.document;
                    if (!frameDoc) {
                        Application.App.log.Debug("[视频查找] 框架无文档对象");
                        continue;
                    }

                    if (frame.id === "course_frame_id") {
                        Application.App.log.Debug("[视频查找] 发现目标框架 course_frame_id");
                        const targetVideo = frameDoc.querySelector("video");
                        if (targetVideo) {
                            Application.App.log.Debug("[视频查找] 在目标框架找到视频");
                            return targetVideo;
                        }
                    }

                    Application.App.log.Debug("[视频查找] 进入嵌套框架查找...");
                    const result = this.deepFindVideo(frameDoc);
                    if (result) return result;
                } catch (e) {
                    Application.App.log.Warn("[视频查找] 跨域访问被阻止:", {
                        frameId: frame.id,
                        src: frame.src,
                        error: e.message,
                    });
                }
            }
            return null;
        } catch (e) {
            Application.App.log.Error("[视频查找] 文档遍历异常:", {
                error: e.stack,
                documentURL: doc.URL,
            });
            return null;
        }
    }

    /** 设置视频自动恢复播放 */
    private setupVideoAutoResume(): void {
        this.timerManager.setInterval("videoAutoResume", () => {
            if (Application.App.config.auto && this.video.paused) {
                Application.App.log.Debug("[自动恢复] 视频暂停，尝试恢复播放");
                this.clickPlayButton();
            }
        }, ZSGL_CONSTANTS.VIDEO_PLAY_RESUME_INTERVAL_MS);

        // 确保视频在页面失去焦点时继续播放
        this.video.addEventListener('pause', () => {
            Application.App.log.Debug('[视频事件] Video paused, attempting to resume...');
            setTimeout(() => {
                if (this.video.paused && Application.App.config.auto) {
                    this.clickPlayButton();
                }
            }, 100);
        }, true);

        // 监听播放事件，确保倍速和静音设置
        this.video.addEventListener('play', () => {
            Application.App.log.Debug('[视频事件] Video playing, applying settings...');
            // 延迟设置，确保播放器初始化完成
            setTimeout(() => {
                this.setPlaybackRate();
                this.setMute();
            }, 100);
        }, true);
    }

    /** 设置视频静音 */
    private setMute(): void {
        const mute = Application.App.config.video_mute;
        Application.App.log.Debug(`[静音设置] 设置静音状态为 ${mute}`);
        this.video.volume = mute ? 0 : 1;
    }

    /** 设置视频结束处理 */
    private setupVideoEndHandler(): void {
        this.video.addEventListener("ended", () => {
            Application.App.log.Info("[视频事件] 视频播放结束");
            // 清除自动恢复定时器
            this.timerManager.clearInterval("videoAutoResume");
            this.callEvent("taskComplete");
            Application.App.log.Debug("退出按钮", this.exitBtn);
            this.exitBtn?.click();
        }, { once: true });
    }
}

/**
 * ZsglAudioControlBar 音频控制栏类
 */
export class ZsglAudioControlBar extends ZsglTaskControlBar {
    public defaultBtn(): void {
        super.defaultBtn();
        const pass = CssBtn(createBtn(
            ZSGL_CONSTANTS.BUTTON_TEXT.PASS_VIDEO,
            "秒过视频会被后台检测到",
            ZSGL_CONSTANTS.CSS_CLASSES.CX_BTN
        ));
        const downloadSubtitle = CssBtn(createBtn(
            ZSGL_CONSTANTS.BUTTON_TEXT.DOWNLOAD_SUBTITLE,
            "我要下载字幕一同食用"
        ));
        pass.style.background = "#F57C00";
        downloadSubtitle.style.background = "#638EE1";
        this.prev.append(pass, this.download(), downloadSubtitle);

        pass.onclick = () => {
            if (!protocolPrompt("秒过视频会产生不良记录,是否继续?", "boom_no_prompt")) {
                return;
            }
        };

        downloadSubtitle.onclick = () => {
        };
    }
}
