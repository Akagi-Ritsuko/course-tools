/*
 * @Author: guotao
 * @Date: 2025-09-28 14:35:39
 * @LastEditors: guotao 1531188409@qq.com
 * @LastEditTime: 2025-10-05 17:57:20
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
    protected videoPlayOrPauseTimer:NodeJS.Timer;
    public Start(): Promise<any> {
        return new Promise<void>(async (resolve, reject) => {
            console.log("zsglVideo开始执行任务", this.taskDiv);
            console.log(' Init window.onblur', window.onblur);
            const eventPreventHandler = function (this: any,e:Event) {
                console.log(`${this.name} ${e.type}事件触发`, e);
                e.stopImmediatePropagation();
                e.stopPropagation();
            }
            //处理页面的事件监听函数的检测
            window.addEventListener('blur', eventPreventHandler, true);
            window.addEventListener('resize', eventPreventHandler, true);
            document.addEventListener('visibilitychange', eventPreventHandler, true);
            document.addEventListener('resize', eventPreventHandler, true);
            document.addEventListener('fullscreenchange', eventPreventHandler, true);
            document.addEventListener('focus', eventPreventHandler, true);
            document.addEventListener('webkitfullscreenchange', eventPreventHandler, true);
            document.addEventListener('blur', eventPreventHandler, true);
            this.video.addEventListener('seeked', eventPreventHandler, true);
            this.video.addEventListener('seeking', eventPreventHandler, true);
            // document.onblur = null;
            // document.onresize = null;
            // document.onfullscreenchange = null;
            // window.onblur = null
            // window.onresize = null
            // document.onvisibilitychange = null
            // window.removeEventListener('blur',); // 移除事件监听器
            // 创建具名函数以便在触发后移除监听器
            const handleTaskDivClick = () => {
                this.initPlayer(); // 初始化播放器
                this.videoPlayOrPauseTimer=setInterval(() => {
                    Application.App.config.auto && this.video.paused && this.video.play();
                }, 5000);
                // 事件触发后移除监听器
                this.taskDiv.removeEventListener('click', handleTaskDivClick, true);
            };
            this.taskDiv.addEventListener('click', handleTaskDivClick, true);
            this.video.addEventListener('pause', () => {
                console.log('Video paused by browser')
            });
            this.taskDiv.click();
            resolve();
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
            const video=document.querySelector('video#course-video_html5_api') as HTMLVideoElement;
            if(taskDiv && video){
                this.taskDiv = taskDiv;
                this.video = video;
                this.video.addEventListener('ended', () => {
                    clearInterval(this.videoPlayOrPauseTimer);
                    clearInterval(this.videoPlayOrPauseTimer);
                    this.callEvent('taskComplete')
                });
                resolve()
            }
        })
    }
    protected initPlayer() {
    Application.App.log.Debug("播放器初始化配置", {
      mute: Application.App.config.video_mute,
      multiple: Application.App.config.video_multiple,
    });

    this.video.volume = this.video.volume = Application.App.config.video_mute ? 0 : this.video.volume;
    this.video.muted = false;
    this.video.playbackRate = Application.App.config.video_multiple;
        setTimeout(() => {
        console.log(this.video.currentTime, "播放时间");
        this.video.currentTime = 0; 
        Application.App.config.auto && this.video.play();
    },5000);
    //重置播放时间来实现未完成的任务失常不够的问题
    // setTimeout(() => {
    //     this.video.currentTime = 0;//重置播放时间来实现未完成的任务失常不够的问题
    //   }, 5000); 

    Application.App.config.auto && this.video.play();
  }
}