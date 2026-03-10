/*
 * @Author: guotao
 * @Date: 2025-09-26 17:51:14
 * @LastEditors: guotao
 * @LastEditTime: 2025-03-09
 * @FilePath: \course-tools1\src\mooc\zsgl\task.ts
 * @Description: zsgl 任务基类
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */
import { CssBtn } from "@App/mooc/chaoxing/utils";
import { createBtn, get } from "@App/internal/utils/utils";
import { Application } from "@App/internal/application";
import { Task, TaskEvent } from "@App/internal/app/task";
import { TaskInfo } from "./types";
import { ZSGL_CONSTANTS } from "./constants";

/**
 * ZsglTask 抽象任务基类
 */
export abstract class ZsglTask extends Task {
    /** 任务索引 */
    public jobIndex: number;
    /** 任务信息 */
    public taskinfo: TaskInfo;
    /** 上下文 */
    protected context: any;
    /** 是否完成 */
    public done: boolean;

    public constructor(context: any, taskinfo: TaskInfo) {
        super();
        this.taskinfo = taskinfo;
        this.context = context;
        
        if (!this.taskinfo?.hasLearned) {
            // exam 没有hasLearned字段
            this.done = false;
            return;
        }
        
        this.done = this.taskinfo.hasLearned !== '0';
    }

    protected callEvent(event: TaskEvent, ...args: any): void {
        if (event === "taskComplete") {
            this.done = true;
        }
        super.callEvent(event, ...args);
    }

    public Init(): Promise<any> {
        return Promise.resolve(true);
    }

    public abstract Start(): Promise<any>;

    public Submit(): Promise<void> {
        return Promise.resolve();
    }

    /** 停止任务 */
    public Stop(): Promise<void> {
        return Promise.resolve();
    }

    public Done(): boolean {
        return this.done;
    }
}

/**
 * ZsglTaskControlBar 任务控制栏类
 */
export class ZsglTaskControlBar {
    /** 任务对象 */
    public task: ZsglTask;
    /** 前置元素 */
    protected prev: HTMLElement;

    constructor(prev: HTMLElement, task: ZsglTask = null) {
        this.task = task;
        this.prev = document.createElement("div");
        this.prev.className = ZSGL_CONSTANTS.CSS_CLASSES.TOOLS_BAR;
        prev.style.textAlign = "center";
        prev.style.width = "100%";
        prev.prepend(this.prev);
        this.defaultBtn();
    }

    /** 默认按钮 */
    public defaultBtn(): void {
        const startBtn = CssBtn(
            createBtn(
                Application.App.config.auto ? ZSGL_CONSTANTS.BUTTON_TEXT.STOP_AUTO : ZSGL_CONSTANTS.BUTTON_TEXT.START_AUTO,
                "点击开始自动挂机",
                ZSGL_CONSTANTS.CSS_CLASSES.CX_BTN
            )
        );

        startBtn.onclick = () => {
            if (startBtn.innerText === ZSGL_CONSTANTS.BUTTON_TEXT.STOP_AUTO) {
                Application.App.config.auto = false;
                startBtn.innerText = ZSGL_CONSTANTS.BUTTON_TEXT.START_AUTO;
                startBtn.title = "点击开始自动挂机";
                Application.App.log.Info("挂机停止了");
            } else {
                Application.App.config.auto = true;
                startBtn.innerText = ZSGL_CONSTANTS.BUTTON_TEXT.STOP_AUTO;
                startBtn.title = "停止挂机,开始好好学习";
                Application.App.log.Info("挂机开始了");
                this.task?.Start();
            }
        };

        this.prev.append(startBtn);
    }

    /**
     * 追加元素
     * @param el 元素
     */
    public append(el: HTMLElement): void {
        this.prev.append(el);
    }

    /** 下载按钮 */
    public download(): HTMLElement {
        if (!this?.task?.taskinfo?.property?.objectid) {
            return document.createElement('div');
        }

        const download = CssBtn(
            createBtn(
                ZSGL_CONSTANTS.BUTTON_TEXT.DOWNLOAD_RESOURCE,
                "我要下载下来好好学习",
                ZSGL_CONSTANTS.CSS_CLASSES.CX_BTN
            )
        );
        download.style.background = "#999999";

        download.onclick = () => {
            (get("https://mooc1-1.chaoxing.com/ananas/status/" + '111', (data: string) => {
                const json = JSON.parse(data);
                prompt("如果打开下载失败，请复制下面链接手动下载", json.download);
                window.open(json.download);
            }) as any).error(() => {
                alert("资源信息获取失败");
            });
        };

        return download;
    }
}
