/*
 * @Author: guotao
 * @Date: 2025-09-28 14:31:46
 * @LastEditors: guotao
 * @LastEditTime: 2025-10-11 10:14:01
 * @FilePath: \course-tools\src\mooc\zsgl\factory.ts
 * @Description:
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */

import {Question, QuestionStatusString, ToolsQuestionBankFacade} from "@App/internal/app/question";
import {CxQuestionFactory} from "@App/mooc/chaoxing/question";
import {Application} from "@App/internal/application";
import {CssBtn} from "@App/mooc/chaoxing/utils";
import { createBtn } from "@App/internal/utils/utils";
import { ZsglTask,ZsglTaskControlBar } from "./task";
import { ZsglAudio, ZsglAudioControlBar } from "./scorm";
import { ZsglVideo } from "./video";
import { ZsglQuestionTask } from "./exam";

// 任务工厂,创建对应的任务
export class TaskFactory {

    // public static CreateCourseTask(taskinfo: any): ZsglTask {
    //     return new ZsglTaskControlBar(new HTMLDivElement(), taskinfo)
    // }
    public static CreateCourseTask(taskinfo: any) {
        if (taskinfo.cwType != "video" && taskinfo.cwType != "knowledge" && taskinfo.cwType != "scorm"&&taskinfo.cwType!=="document"&& taskinfo.cwType != "audio"&&taskinfo.cwType!= "URL") {
            return null;
        }
        // let prev: HTMLElement;
        // const container = document.querySelector("#watermarkFrame") || document.body;
        // prev = document.createElement("div");
        // container.prepend(prev);
        let task: ZsglTask;
        switch (taskinfo.cwType) {
            case "scorm": {
                // let bar = new ZsglTaskControlBar(prev, new ZsglAudio(document,taskinfo));
                task=new ZsglAudio(document,taskinfo);
                break;
            }
            case "video": {
                task=new ZsglVideo(document,taskinfo);
            }
        
            default:
                break;
        }
        return task;

    }

  public static CreateQuestionTask(taskinfo: any) {
    return new ZsglQuestionTask(document, taskinfo);
  }
}
