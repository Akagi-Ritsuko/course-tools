/*
 * @Author: guotao
 * @Date: 2025-03-09
 * @Description: zsgl 模块类型定义文件
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */

export interface TaskInfo {
    fileName: string;
    cwType: CourseWorkType;
    hasLearned: string;
    jobIndex: number;
    courseId?: string;
    property?: TaskProperty;
}

export interface TaskProperty {
    objectid?: string;
}

export type CourseWorkType = 'video' | 'knowledge' | 'scorm' | 'document' | 'audio' | 'URL';

export interface CourseDetailItem {
    hasLearned: string;
    fileName: string;
    cwType: CourseWorkType;
    jobIndex: number;
    courseId: string;
}

export interface QuestionInfo {
    questionText: string;
    sectionRespList: QuestionSection[];
}

export interface QuestionSection {
    sectionText: string;
    isCorrect: string;
}

export interface StudyMapData {
    gateName: string;
    gateNameIndex: number;
    status: number;
    finishTaskNum: number;
    taskNum: number;
}

export interface GateTaskData {
    taskName: string;
    resourceId: string;
    status: number;
}

export interface TaskStatus {
    status: 'started' | 'finished';
    expire: number;
}

export interface HttpResponse {
    body: any;
    isCompleted?: string;
    courseFileArr?: any[];
    courseId?: string;
}

export type HttpRequestCallback = (response: HttpResponse, context: any) => void;

export interface EventPreventHandler {
    (this: any, e: Event): void;
}
