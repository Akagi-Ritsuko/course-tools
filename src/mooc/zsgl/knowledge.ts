/*
 * @Author: guotao
 * @Date: 2026-03-10
 * @Description: zsgl Knowledge 知识点任务模块
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */
import { Task, TaskType } from "@App/internal/app/task";
import { ZsglTask } from "./task";
import { Application } from "@App/internal/application";
import { TimerManager, findElementByText } from "./utils/utils";
import { TaskInfo } from "./types";
import { ZSGL_CONSTANTS } from "./constants";

/**
 * ZsglKnowledge 知识点任务类
 */
export class ZsglKnowledge extends ZsglTask {
    /** 任务元素 */
    protected taskDiv: HTMLSpanElement;
    /** 退出按钮 */
    protected exitBtn: HTMLSpanElement;
    /** iframe 元素 */
    protected iframe: HTMLIFrameElement;
    /** 定时器管理器 */
    private timerManager: TimerManager = new TimerManager();

    public Init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const taskDiv = findElementByText("span", this.taskinfo.fileName);

            Application.App.log.Debug("寻找 taskDiv", this.taskinfo.fileName);
            if (taskDiv) {
                this.taskDiv = taskDiv;
                Application.App.log.Debug("开始初始化 knowledge 任务", taskDiv);
                resolve();
            } else {
                Application.App.log.Error("未找到任务元素");
                reject(new Error(ZSGL_CONSTANTS.ERROR_MESSAGES.TASK_NOT_FOUND));
            }
        });
    }

    public async Start(): Promise<any> {
        await new Promise<void>(async (resolve, reject) => {
            Application.App.log.Debug("开始点击任务按钮", this.taskDiv);
            this.taskDiv.click();

            await this.waitForStartButton();

            await this.waitForIframeLoad();

            await this.waitAndExit();

            resolve();
        });
    }

    public Type(): TaskType {
        return "knowledge";
    }

    public Stop(): Promise<void> {
        this.timerManager.clearAll();
        return Promise.resolve();
    }

    /** 等待并点击开始按钮 */
    private waitForStartButton(): Promise<void> {
        return new Promise((resolve, reject) => {
            let attemptCount = 0;

            this.timerManager.setInterval("findStartBtn", () => {
                attemptCount++;
                Application.App.log.Debug(`[开始按钮查找] 第 ${attemptCount} 次尝试`);

                if (attemptCount > ZSGL_CONSTANTS.MAX_ATTEMPT_COUNT) {
                    this.timerManager.clearInterval("findStartBtn");
                    reject(new Error("未找到开始按钮"));
                    return;
                }

                const startButton = Array.from(
                    document.querySelectorAll("button.MuiButton-root")
                ).find(btn => btn.textContent?.includes("立即学习")) as HTMLButtonElement;

                if (startButton) {
                    this.timerManager.clearInterval("findStartBtn");
                    Application.App.log.Info("[开始按钮查找] 找到开始按钮，点击");
                    startButton.click();
                    resolve();
                }
            }, ZSGL_CONSTANTS.CHECK_INTERVAL_MS);
        });
    }

    /** 等待 iframe 加载 */
    private waitForIframeLoad(): Promise<void> {
        return new Promise((resolve, reject) => {
            let attemptCount = 0;

            this.timerManager.setInterval("findIframe", () => {
                attemptCount++;
                Application.App.log.Debug(`[iframe 查找] 第 ${attemptCount} 次尝试`);

                if (attemptCount > ZSGL_CONSTANTS.MAX_ATTEMPT_COUNT) {
                    this.timerManager.clearInterval("findIframe");
                    reject(new Error("未找到 iframe"));
                    return;
                }

                const iframe = document.querySelector("iframe") as HTMLIFrameElement;
                if (iframe && iframe.src) {
                    this.timerManager.clearInterval("findIframe");
                    this.iframe = iframe;
                    
                    this.exitBtn = document.querySelector(ZSGL_CONSTANTS.SELECTORS.EXIT_SPAN);
                    
                    Application.App.log.Info("[iframe 查找] iframe 加载完成");
                    resolve();
                }
            }, ZSGL_CONSTANTS.CHECK_INTERVAL_MS);
        });
    }

    /** 计算剩余学习时长（毫秒） */
    private calculateRemainingTime(): number {
        const playTime = (this.taskinfo.playTime || 0) * 1000;
        const learnedDuration = this.taskinfo.learnedDuration || 0;
        return playTime - learnedDuration;
    }

    /** 等待后退出 */
    private async waitAndExit(): Promise<void> {
        const remainingTime = this.calculateRemainingTime();

        Application.App.log.Info("学习时长信息", {
            playTime: this.taskinfo.playTime,
            learnedDuration: this.taskinfo.learnedDuration,
            remainingTime: remainingTime / 1000 + "秒"
        });

        if (remainingTime <= 0) {
            Application.App.log.Info("学习时长已满足，直接退出");
            this.exitBtn?.click();
            this.callEvent("taskComplete");
            return;
        }

        Application.App.log.Info(`等待学习时长: ${remainingTime / 1000} 秒`);

        await new Promise<void>(resolve => {
            this.timerManager.setTimeout("waitDuration", () => {
                Application.App.log.Info("学习时长已满足，退出");
                this.exitBtn?.click();
                this.callEvent("taskComplete");
                resolve();
            }, remainingTime);
        });
    }
}
