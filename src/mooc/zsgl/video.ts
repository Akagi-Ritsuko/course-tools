/*
 * @Author: guotao
 * @Date: 2025-09-28 14:35:39
 * @LastEditors: guotao
 * @LastEditTime: 2025-09-28 16:22:35
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
    public Start(): Promise<any> {
        throw new Error("Method not implemented.");
    }
    public Type(): TaskType {
        return 'video';
    }
    public Init(): Promise<any> {
        return new Promise<void>(async (resolve, reject) => {
            const client = NewChromeClientMessage("zsgl-tools");//创建消息通道
            const taskKey = `zsgl_task_${this.taskinfo.courseId}`;
            Application.App.log.Debug("zsglVideo开始初始化视频任务",this.taskinfo);
            client.Send({ type:taskKey , details: {message:'completed'} });//发送初始化消息
        })
     }
    
}