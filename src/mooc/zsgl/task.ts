/*
 * @Author: guotao
 * @Date: 2025-09-26 17:51:14
 * @LastEditors: guotao
 * @LastEditTime: 2025-09-27 16:44:59
 * @FilePath: \course-tools1\src\mooc\zsgl\task.ts
 * @Description: 
 * 
 * Copyright (c) 2025 by lzlj, All Rights Reserved. 
 */
import { CssBtn } from "@App/mooc/chaoxing/utils";
import { createBtn, get } from "@App/internal/utils/utils";
import { Application } from "@App/internal/application";
import { Task, TaskEvent } from "@App/internal/app/task";

export abstract class ZsglTask extends Task {
    public jobIndex: number;
    public taskinfo: any;
    protected context: any;
    public done: boolean;

    public constructor(context: any, taskinfo: any) {
        super();
        this.taskinfo = taskinfo;
        this.context = context;
        if (this.taskinfo.hasLearned==='0') {
            this.done = false;
        } else {
            this.done = true;
        }
    }

    protected callEvent(event: TaskEvent, ...args: any) {
        if (event == "taskComplete") {
            this.done = true;
        }
        super.callEvent(event, ...args);
    }

    public Init(): Promise<any> {
        return new Promise(resolve => {
            resolve(true);
        });
    }

    public abstract Start(): Promise<any>

    public Submit(): Promise<void> {
        return new Promise(resolve => {
            resolve();
        });
    }

    //TODO:停止
    public Stop(): Promise<void> {
        return new Promise(resolve => {
            resolve();
        });
    }

    public Done(): boolean {
        return this.done;
    }
}

export class ZsglTaskControlBar {
    public task: ZsglTask;
    protected prev: HTMLElement;

    constructor(prev: HTMLElement, task: ZsglTask=null) {
        this.task = task;
        this.prev = document.createElement("div");
        this.prev.className='zsgl-tools-bar1'
        prev.style.textAlign = "center";
        prev.style.width = "100%";
        prev.prepend(this.prev);
        this.defaultBtn();
    }

    public defaultBtn() {
        let startBtn = CssBtn(createBtn(Application.App.config.auto ? "暂停挂机" : "开始挂机", "点击开始自动挂机", "cx-btn"));
        startBtn.onclick = () => {
            if (startBtn.innerText == '暂停挂机') {
                Application.App.config.auto = false;
                startBtn.innerText = "开始挂机";
                startBtn.title = "点击开始自动挂机";
                Application.App.log.Info("挂机停止了");
            } else {
                Application.App.config.auto = true;
                startBtn.innerText = '暂停挂机';
                startBtn.title = "停止挂机,开始好好学习";
                Application.App.log.Info("挂机开始了");
                this.task.Start();
            }
        };
        this.prev.append(startBtn);
    }

    public append(el: HTMLElement): void {
        this.prev.append(el);
    }

    public download(): HTMLElement {
        if (!this?.task?.taskinfo.property.objectid) {
            return;
        }
        let download = CssBtn(createBtn("下载资源", "我要下载下来好好学习", "cx-btn"));
        download.style.background = "#999999";
        download.onclick = () => {
            (<any>get("https://mooc1-1.chaoxing.com/ananas/status/" +'111', (data: string) => {
                let json = JSON.parse(data);
                prompt("如果打开下载失败，请复制下面链接手动下载", json.download);
                window.open(json.download);
            })).error(() => {
                alert("资源信息获取失败");
            });
        };
        return download;
    }
}