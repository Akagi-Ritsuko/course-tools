/*
 * @Author: guotao
 * @Date: 2025-09-28 14:35:39
 * @LastEditors: guotao
 * @LastEditTime: 2026-03-13 02:51:05
 * @FilePath: \course-tools1\src\mooc\zsgl\video.ts
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

    public Start(): Promise<any> {
        return new Promise<void>(async (resolve, reject) => {
            Application.App.log.Debug("zsglVideo开始执行任务", this.taskDiv);

            // 处理页面的事件监听函数的检测
            setupEventPrevention(window);
            setupEventPrevention(document);
            setupVideoEventPrevention(this.video);

            // 创建具名函数以便在触发后移除监听器
            const handleTaskDivClick = () => {
                this.initPlayer();
                this.setupVideoAutoResume();
                // 事件触发后移除监听器
                this.taskDiv.removeEventListener('click', handleTaskDivClick, true);
            };

            this.taskDiv.addEventListener('click', handleTaskDivClick, true);
            this.taskDiv.click();
            resolve();
        });
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
                this.setupVideoEndHandler();
                resolve();
            } else {
                Application.App.log.Error("初始化失败：未找到视频元素或任务元素");
                reject(new Error(ZSGL_CONSTANTS.ERROR_MESSAGES.TASK_NOT_FOUND));
            }
        });
    }

    public Stop(): Promise<void> {
        this.timerManager.clearAll();
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
        setTimeout(() => {
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
                Application.App.config.auto && this.video.play().catch((e) => {
                    Application.App.log.Warn("[播放尝试] 播放失败:", e.message);
                });
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
            Application.App.config.auto && this.video.play().catch((e) => {
                Application.App.log.Warn("[视频事件] 播放失败:", e.message);
            });
        }, { once: true });

        this.video.addEventListener('canplay', () => {
            Application.App.log.Info("[视频事件] canplay - 视频可以播放");
            this.setPlaybackRate();
            Application.App.config.auto && this.video.play().catch((e) => {
                Application.App.log.Warn("[视频事件] 播放失败:", e.message);
            });
        }, { once: true });
    }

    /** 设置视频自动恢复播放 */
    private setupVideoAutoResume(): void {
        this.timerManager.setInterval("videoAutoResume", () => {
            if (Application.App.config.auto && this.video.paused) {
                Application.App.log.Debug("[自动恢复] 视频暂停，尝试恢复播放");
                // 先静音再播放，绕过浏览器自动播放策略
                const wasMuted = this.video.muted;
                this.video.muted = true;
                this.video.play().then(() => {
                    // 播放成功后恢复静音状态
                    this.video.muted = wasMuted || Application.App.config.video_mute;
                    this.setMute();
                    this.setPlaybackRate();
                }).catch((e) => {
                    Application.App.log.Warn("[自动恢复] 播放失败:", e.message);
                });
            }
        }, ZSGL_CONSTANTS.VIDEO_PLAY_RESUME_INTERVAL_MS);

        // 确保视频在页面失去焦点时继续播放
        this.video.addEventListener('pause', () => {
            Application.App.log.Debug('[视频事件] Video paused, attempting to resume...');
            setTimeout(() => {
                if (this.video.paused && Application.App.config.auto) {
                    // 先静音再播放，绕过浏览器自动播放策略
                    const wasMuted = this.video.muted;
                    this.video.muted = true;
                    this.video.play().then(() => {
                        // 播放成功后恢复静音状态
                        this.video.muted = wasMuted || Application.App.config.video_mute;
                        this.setMute();
                    }).catch((e) => {
                        Application.App.log.Warn("[自动恢复] 播放失败:", e.message);
                    });
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

    /** 设置视频结束处理 */
    private setupVideoEndHandler(): void {
        this.video.addEventListener("ended", () => {
            Application.App.log.Info("[视频事件] 视频播放结束");
            // 清除自动恢复定时器
            this.timerManager.clearInterval("videoAutoResume");
            this.callEvent("taskComplete");
        }, { once: true });
    }
}
