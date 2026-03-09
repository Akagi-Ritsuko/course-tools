/*
 * @Author: guotao
 * @Date: 2025-09-28 14:35:39
 * @LastEditors: guotao
 * @LastEditTime: 2025-03-09
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
    /** 视频播放/暂停定时器 */
    protected videoPlayOrPauseTimer: NodeJS.Timeout;
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
                this.videoPlayOrPauseTimer = setInterval(() => {
                    Application.App.config.auto && this.video.paused && this.video.play();
                }, ZSGL_CONSTANTS.VIDEO_PLAY_RESUME_INTERVAL_MS);
                // 事件触发后移除监听器
                this.taskDiv.removeEventListener('click', handleTaskDivClick, true);
            };

            this.taskDiv.addEventListener('click', handleTaskDivClick, true);
            this.video.addEventListener('pause', () => {
                Application.App.log.Debug('Video paused by browser');
            });
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
                this.video.addEventListener('ended', () => {
                    clearInterval(this.videoPlayOrPauseTimer);
                    this.callEvent('taskComplete');
                });
                resolve();
            } else {
                Application.App.log.Error("初始化失败：未找到视频元素或任务元素");
                reject(new Error(ZSGL_CONSTANTS.ERROR_MESSAGES.TASK_NOT_FOUND));
            }
        });
    }

    public Stop(): Promise<void> {
        clearInterval(this.videoPlayOrPauseTimer);
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
        this.video.playbackRate = Application.App.config.video_multiple;

        setTimeout(() => {
            Application.App.log.Debug(this.video.currentTime, "播放时间");
            this.video.currentTime = 0;
            Application.App.config.auto && this.video.play();
        }, ZSGL_CONSTANTS.PLAYER_INIT_DELAY_MS);
        //重置播放时间来实现未完成的任务失常不够的问题

        Application.App.config.auto && this.video.play();
    }
}
