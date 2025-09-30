/*
 * @Author: guotao
 * @Date: 2025-09-28 14:35:39
 * @LastEditors: guotao
 * @LastEditTime: 2025-09-30 17:16:59
 * @FilePath: \course-tools\src\mooc\zsgl\video.ts
 * @Description: 
 * 
 * Copyright (c) 2025 by lzlj, All Rights Reserved. 
 */
import { Mooc } from "@App/internal/app/mooc";
import { MoocTaskSet } from "@App/internal/app/mooc";
import { Task, TaskType } from "@App/internal/app/task";
import { ZsglTask } from "./task";
import { CssBtn } from "../chaoxing/utils";
import { ZsglCourseControlBar } from "./course";
import {
  randNumber,
  post,
  substrex,
  protocolPrompt,
  createBtn,
} from "@App/internal/utils/utils";
import { Application } from "@App/internal/application";
import { resolve } from "path";
import { hookHttpRequest } from "./utils/utils";
import { isContext } from "vm";
import { ZsglTaskControlBar } from "./task";
import { NewChromeClientMessage } from "@App/internal/utils/message";

export class ZsglVideo extends ZsglTask {
    protected  taskDiv: HTMLSpanElement;
    protected video: HTMLVideoElement;
    public Start(): Promise<any> {
        return new Promise<void>(async (resolve, reject) => {
            console.log("zsglVideo开始执行任务", this.taskDiv);
            console.log(' Init window.onblur', window.onblur);
            document.addEventListener('blur', function (e) { e.stopImmediatePropagation(); e.stopPropagation(); }, true);
            document.onblur = null;
            document.onresize = null;
            document.onfullscreenchange = null;
            window.onblur = null
            window.onresize = null
            document.onvisibilitychange = null
            // window.removeEventListener('blur',); // 移除事件监听器
            this.taskDiv.click();
        })
    }
    public Type(): TaskType {
        return 'video';
    }
    public Init(): Promise<any> {
        return new Promise<void>(async (resolve, reject) => {
            // const taskKey = `zsgl_task_${this.taskinfo.courseId}`;
            // Application.App.log.Debug("zsglVideo开始初始化任务", taskKey);
            // const taskStorage = localStorage.getItem(taskKey);//获取任务状态
            // Application.App.log.Debug("zsglVideo任务状态", taskStorage);
            // if (taskStorage && Date.now() < JSON.parse(taskStorage).expire) {
            //     Application.App.log.Debug("zsglVideo任务完成", taskStorage);
            //     localStorage.setItem(taskKey, JSON.stringify({ status: 'finished', expire: Date.now() + 1000 * 60 * 60 * 10 }));//重置过期时间
            //     this.callEvent('taskComplete')
            // }
            console.log("zsglVideo开始初始化任务",this.taskinfo);
            const taskDiv = Array.from(document.querySelectorAll('span')).find((span) => { return span.textContent.includes(`${this.taskinfo.fileName}`) });
            console.log(taskDiv, "zsglVideo任务元素");
            if(taskDiv){
                this.taskDiv = taskDiv;
                resolve()
            }
        })
    }
    protected initPlayer() {
    Application.App.log.Debug("播放器初始化配置", {
      mute: Application.App.config.video_mute,
      multiple: Application.App.config.video_multiple,
    });

    this.video.muted = Application.App.config.video_mute;
    this.video.playbackRate = Application.App.config.video_multiple;
    this.video.currentTime = 0; //重置播放时间来实现未完成的任务失常不够的问题
    // setTimeout(() => {
    //     this.video.currentTime = 0;//重置播放时间来实现未完成的任务失常不够的问题
    //   }, 5000); 

    Application.App.config.auto && this.video.play();
  }
}