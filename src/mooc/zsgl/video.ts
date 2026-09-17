/*
 * @Author: guotao
 * @Date: 2025-09-28 14:35:39
 * @LastEditors: guotao
 * @LastEditTime: 2026-03-13 15:03:40
 * @FilePath: \course-tools\src\mooc\zsgl\video.ts
 * @Description: zsgl 视频任务模块
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */
import { Task, TaskType } from "@App/internal/app/task";
import { ZsglTask } from "./task";
import { CssBtn } from "../chaoxing/utils";
import { ZsglCourseControlBar } from "./course";
import { createBtn, protocolPrompt } from "@App/internal/utils/utils";
import { Application } from "@App/internal/application";
import { hookHttpRequest, TimerManager, setupEventPrevention, setupVideoEventPrevention, findElementByText } from "./utils/utils";
import { ZsglTaskControlBar } from "./task";
import { NewChromeClientMessage } from "@App/internal/utils/message";
import { TaskInfo } from "./types";
import { ZSGL_CONSTANTS } from "./constants";

/**
 * ZsglVideo 视频任务类
 */
export class ZsglVideo extends ZsglTask {
    /** 任务元素 */
    protected taskDiv: HTMLSpanElement;
    /** 视频元素 */
    protected video: HTMLVideoElement;
    /** 定时器管理器 */
    private timerManager: TimerManager = new TimerManager();
    /** 保持活跃的音频元素 */
    private keepAliveAudio: HTMLAudioElement | null = null;
    /** visibilitychange 处理函数引用(缓存引用以保证 removeEventListener 生效) */
    private visibilityHandler: ((e: Event) => void) | null = null;
    /** 自动恢复播放的连续重试次数 */
    private playRetryCount: number = 0;
    /** 是否已放弃自动恢复(黑屏/无源保护) */
    private playAborted: boolean = false;
    /** 自动恢复定时器是否处于运行状态 */
    private autoResumeActive: boolean = false;
    /** 自动恢复监听器是否已注册 */
    private autoResumeListenersAdded: boolean = false;

    public Start(): Promise<any> {
        return new Promise<void>(async (resolve, reject) => {
            Application.App.log.Debug("zsglVideo开始执行任务", this.taskDiv);
            this.setupVideoEndHandler(); // 设置视频结束处理函数
            // 处理页面的事件监听函数的检测(托管,Stop 时统一移除)
            this.cleanupFns.push(setupEventPrevention(window));
            this.cleanupFns.push(setupEventPrevention(document));
            this.cleanupFns.push(setupVideoEventPrevention(this.video));
            this.startKeepAlive();

            // 创建具名函数以便在触发后移除监听器
            const handleTaskDivClick = () => {
                this.initPlayer();
                this.setupVideoAutoResume();
                // 事件触发后移除监听器
                this.taskDiv.removeEventListener('click', handleTaskDivClick, true);
            };

            this.addManagedListener(this.taskDiv, 'click', handleTaskDivClick, true);
            this.taskDiv.click();
            resolve();
        });
    }

    /** 启动保持活跃机制 */
    private startKeepAlive(): void {
        if (this.keepAliveAudio) return;

        this.keepAliveAudio = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=");
        this.keepAliveAudio.loop = true;
        this.keepAliveAudio.volume = 0.001;

        this.keepAliveAudio.play().then(() => {
            Application.App.log.Info("[保持活跃] 已启动后台播放保持机制");
        }).catch((e) => {
            Application.App.log.Warn("[保持活跃] 启动失败:", e.message);
        });

        // 缓存绑定的处理函数引用,确保 removeEventListener 能正确匹配移除
        if (!this.visibilityHandler) {
            this.visibilityHandler = this.handleVisibilityChange.bind(this);
            document.addEventListener('visibilitychange', this.visibilityHandler);
        }
    }

    /** 停止保持活跃机制 */
    private stopKeepAlive(): void {
        if (this.keepAliveAudio) {
            this.keepAliveAudio.pause();
            this.keepAliveAudio = null;
        }
        if (this.visibilityHandler) {
            document.removeEventListener('visibilitychange', this.visibilityHandler);
            this.visibilityHandler = null;
        }
    }

    /** 处理页面可见性变化 */
    private handleVisibilityChange(): void {
        if (document.hidden) {
            Application.App.log.Debug("[保持活跃] 页面隐藏，继续后台播放");
            if (this.keepAliveAudio && this.keepAliveAudio.paused) {
                this.keepAliveAudio.play().catch(() => {});
            }
        } else {
            Application.App.log.Debug("[保持活跃] 页面显示");
        }
    }

    public Type(): TaskType {
        return 'video';
    }

    public Init(): Promise<any> {
        return new Promise<void>(async (resolve, reject) => {
            Application.App.log.Debug("zsglVideo开始初始化任务", this.taskinfo);

            const taskDiv = findElementByText('span', this.taskinfo.fileName);
            const video = document.querySelector(ZSGL_CONSTANTS.SELECTORS.COURSE_VIDEO) as HTMLVideoElement;

            if (taskDiv && video) {
                this.taskDiv = taskDiv;
                this.video = video;
                // this.setupVideoEndHandler();
                resolve();
            } else {
                Application.App.log.Error("初始化失败：未找到视频元素或任务元素");
                reject(new Error(ZSGL_CONSTANTS.ERROR_MESSAGES.TASK_NOT_FOUND));
            }
        });
    }

    public Stop(): Promise<void> {
        this.timerManager.clearAll();
        this.stopKeepAlive();
        this.runCleanup();
        return Promise.resolve();
    }

    /** 初始化播放器 */
    protected initPlayer(): void {
        Application.App.log.Debug("播放器初始化配置", {
            mute: Application.App.config.video_mute,
            multiple: Application.App.config.video_multiple,
        });

        this.video.volume = Application.App.config.video_mute ? 0 : this.video.volume;
        this.video.muted = false;

        // 监听播放速率变化
        this.watchPlaybackRate();

        // 等待视频源加载后再播放
        this.waitForVideoSourceAndPlay();

        // 延迟重置播放时间来实现未完成的任务时常不够的问题
        this.timerManager.setTimeout("playerInitDelay", () => {
            Application.App.log.Debug(this.video.currentTime, "播放时间");
            this.video.currentTime = 0;
            this.setPlaybackRate();
        }, ZSGL_CONSTANTS.PLAYER_INIT_DELAY_MS);
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

            // 继续等待(纳入 TimerManager,Stop 时可取消)
            this.timerManager.setTimeout("waitForSource", tryPlay, 1000);
        };

        // 立即尝试一次
        tryPlay();

        // 同时监听视频事件(托管,Stop 时统一移除)
        this.addManagedListener(this.video, 'loadedmetadata', () => {
            Application.App.log.Info("[视频事件] loadedmetadata - 视频元数据已加载");
            this.setPlaybackRate();
            if (Application.App.config.auto) {
                this.clickPlayButton();
            }
        }, { once: true });

        this.addManagedListener(this.video, 'canplay', () => {
            Application.App.log.Info("[视频事件] canplay - 视频可以播放");
            this.setPlaybackRate();
            if (Application.App.config.auto) {
                this.clickPlayButton();
            }
        }, { once: true });
    }

    /** 点击播放按钮 */
    private clickPlayButton(): void {
        // 已放弃自动恢复(黑屏/无源保护),但视频源延迟到达时自动复活
        if (this.playAborted) {
            if (this.hasVideoSource()) {
                Application.App.log.Info("[自动恢复] 视频源已到达，恢复自动播放");
                this.resetPlayRetry();
            } else {
                return;
            }
        }

        const vjsPlayBtn = document.querySelector('.vjs-big-play-button') as HTMLElement;

        // 先静音，绕过浏览器自动播放策略
        this.video.muted = true;

        if (vjsPlayBtn) {
            Application.App.log.Debug("[点击播放] 找到播放按钮，点击播放", vjsPlayBtn);
            vjsPlayBtn.click();
        } else {
            Application.App.log.Debug("[点击播放] 未找到播放按钮，尝试直接播放");
            this.video.play().then(() => {
                Application.App.log.Debug("[点击播放] 播放成功");
                this.resetPlayRetry();
            }).catch((e) => {
                // 失败后不再回点播放按钮,避免形成反馈死循环
                this.handlePlayFailure(e);
            });
        }
        this.setMute();
        this.setPlaybackRate();
    }

    /** 重置播放重试状态(视频成功播放后调用) */
    private resetPlayRetry(): void {
        this.playRetryCount = 0;
        this.playAborted = false;
    }

    /** 检查视频是否已有可用源 */
    private hasVideoSource(): boolean {
        return !!(this.video.src || this.video.currentSrc ||
                  this.video.querySelector('source')?.src || this.video.readyState >= 1);
    }

    /** 处理播放失败,超过上限后放弃自动恢复,避免黑屏死循环耗尽资源 */
    private handlePlayFailure(e: any): void {
        this.playRetryCount++;
        Application.App.log.Warn(`[点击播放] 播放失败(${this.playRetryCount}/${ZSGL_CONSTANTS.MAX_PLAY_RETRY}):`, e.message);
        if (this.playRetryCount >= ZSGL_CONSTANTS.MAX_PLAY_RETRY) {
            this.abortAutoResume();
        }
    }

    /** 放弃自动恢复并释放相关资源 */
    private abortAutoResume(): void {
        if (this.playAborted) {
            return;
        }
        this.playAborted = true;
        this.autoResumeActive = false;
        this.timerManager.clearInterval("videoAutoResume");
        this.stopKeepAlive();
        Application.App.log.Error("[自动恢复] 视频长时间无法播放(可能未加载视频源)，已停止自动恢复");
    }

    /** 设置视频自动恢复播放 */
    private setupVideoAutoResume(): void {
        // 监听器只注册一次,避免重复 Start 时累积
        if (!this.autoResumeListenersAdded) {
            this.autoResumeListenersAdded = true;

            // 确保视频在页面失去焦点时继续播放
            this.addManagedListener(this.video, 'pause', () => {
                Application.App.log.Debug('[视频事件] Video paused, attempting to resume...');
                setTimeout(() => {
                    if (this.video.paused && Application.App.config.auto) {
                        this.clickPlayButton();
                    }
                }, 100);
            }, true);

            // 监听播放事件，确保倍速和静音设置
            this.addManagedListener(this.video, 'play', () => {
                Application.App.log.Debug('[视频事件] Video playing, applying settings...');
                // 视频成功播放,重置重试状态并恢复定时器与保活机制
                this.resetPlayRetry();
                if (!this.autoResumeActive) {
                    this.startAutoResumeInterval();
                }
                if (!this.keepAliveAudio) {
                    this.startKeepAlive();
                }
                // 延迟设置，确保播放器初始化完成
                setTimeout(() => {
                    this.setPlaybackRate();
                    this.setMute();
                }, 100);
            }, true);
        }

        this.startAutoResumeInterval();
    }

    /** 启动自动恢复定时器 */
    private startAutoResumeInterval(): void {
        if (this.autoResumeActive) {
            return;
        }
        this.autoResumeActive = true;

        this.timerManager.setInterval("videoAutoResume", () => {
            if (!Application.App.config.auto) {
                return;
            }

            if (!this.video.paused) {
                // 播放正常,重置重试计数
                this.resetPlayRetry();
                return;
            }

            this.playRetryCount++;
            if (this.playRetryCount > ZSGL_CONSTANTS.MAX_PLAY_RETRY) {
                this.abortAutoResume();
                return;
            }

            Application.App.log.Debug(`[自动恢复] 视频暂停，尝试恢复播放(${this.playRetryCount}/${ZSGL_CONSTANTS.MAX_PLAY_RETRY})`);
            this.clickPlayButton();
        }, ZSGL_CONSTANTS.VIDEO_PLAY_RESUME_INTERVAL_MS);
    }

    /** 设置视频静音 */
    private setMute(): void {
        const mute = Application.App.config.video_mute;
        Application.App.log.Debug(`[静音设置] 设置静音状态为 ${mute}`);
        this.video.volume = mute ? 0 : 1;
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
        this.addManagedListener(this.video, 'ratechange', () => {
            if (this.video.playbackRate !== rate) {
                Application.App.log.Debug(`[播放速率] 检测到速率被重置为 ${this.video.playbackRate}x，重新设置为 ${rate}x`);
                this.video.playbackRate = rate;
            }
        });
    }

    /** 设置视频结束处理 */
    private setupVideoEndHandler(): void {
        this.addManagedListener(this.video, "ended", () => {
            Application.App.log.Info("[视频事件] 视频播放结束");
            Application.App.log.Debug("[视频事件] 视频播放结束");
            this.timerManager.clearInterval("videoAutoResume");
            this.autoResumeActive = false;
            this.stopKeepAlive();
            this.notifyVideoTaskComplete();
            this.callEvent("complete");
        }, { once: true });
    }

    /** 通知视频任务完成 */
    private notifyVideoTaskComplete(): void {
        if (this.taskinfo.courseId) {
            const videoKey = `zsgl_video_complete_${this.taskinfo.courseId}_${this.taskinfo.jobIndex}`;
            const videoStatus = {
                status: "finished",
                courseId: this.taskinfo.courseId,
                taskId: this.taskinfo.jobIndex,
                timestamp: Date.now()
            };
            localStorage.setItem(videoKey, JSON.stringify(videoStatus));
            Application.App.log.Info(`[视频完成通知] 已设置: ${videoKey}`);
            Application.App.log.Debug(`[视频完成通知] 已设置: ${videoKey}`, videoStatus);
        }
    }
}
