/*
 * @Author: guotao
 * @Date: 2025-09-28 14:31:46
 * @LastEditors: guotao
 * @LastEditTime: 2026-03-09 22:52:44
 * @FilePath: \course-tools1\src\mooc\zsgl\factory.ts
 * @Description: zsgl 任务工厂
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */

import { Application } from "@App/internal/application";
import { createBtn } from "@App/internal/utils/utils";
import { ZsglTask, ZsglTaskControlBar } from "./task";
import { ZsglAudio } from "./scorm";
import { ZsglVideo } from "./video";
import { ZsglQuestionTask } from "./exam";
import { TaskInfo, CourseWorkType } from "./types";
import { SUPPORTED_COURSE_TYPES } from "./constants";
import { CssBtn } from "./utils/utils";

/**
 * TaskFactory 任务工厂类
 * 用于创建对应的任务对象
 */
export class TaskFactory {
    /**
     * 创建课程任务
     * @param taskinfo 任务信息
     */
    public static CreateCourseTask(taskinfo: TaskInfo): ZsglTask | null {
        if (!this.isSupportedType(taskinfo.cwType)) {
            return null;
        }
        console.log(`创建课程任务: ${taskinfo.cwType}`);
        switch (taskinfo.cwType) {
            case "scorm":
                return new ZsglAudio(document, taskinfo);
            case "video":
                return new ZsglVideo(document, taskinfo);
            case "knowledge":
            case "document":
            case "audio":
            case "URL":
                Application.App.log.Debug(`暂不支持的课程类型: ${taskinfo.cwType}`);
                return null;
            default:
                return null;
        }
    }

    /**
     * 检查是否为支持的类型
     * @param type 类型
     */
    private static isSupportedType(type: string): type is CourseWorkType {
        return SUPPORTED_COURSE_TYPES.includes(type);
    }

    /**
     * 创建题目任务
     * @param taskinfo 任务信息
     */
    public static CreateQuestionTask(taskinfo: any): ZsglQuestionTask {
        return new ZsglQuestionTask(document, taskinfo);
    }
}
