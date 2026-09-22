/*
 * @Description: 三节课（sanjieke）模块类型定义文件
 *
 * Copyright (c) 2026 by lzlj, All Rights Reserved.
 */

/**
 * content/tree 内容树节点
 * 注意:响应体结构属 spec Assumption #1(开发期实测验证),此处字段取宽泛命名,
 * 由 ContentTreeHelper 做多字段兼容解析,不依赖单一字段名
 */
export interface ContentTreeNode {
  id?: number | string;
  name?: string;
  title?: string;
  nodeType?: string | number;
  /** 常见的完成状态字段(兼容多种命名) */
  isFinished?: boolean;
  finished?: boolean;
  studyStatus?: number;
  completedFlag?: boolean;
  hasLearned?: string | number;
  children?: ContentTreeNode[];
  [key: string]: any;
}

/** 课时信息(内容树叶节点归一化结果) */
export interface LessonInfo {
  lessonId: string;
  lessonName: string;
  finished: boolean;
}

/** 课后题信息(GET /study/0/{courseId}/questions 响应元素,直接含 answer) */
export interface QuestionInfo {
  id: number;
  /** RADIO: 单选, MULTI: 多选, 其余视为开放性问题 */
  type: string;
  question: string;
  options: { [letter: string]: string };
  /** 正确答案字母数组,如 ["B"];开放性问题无此字段 */
  answer?: string[];
  analysis?: string;
  correctFlag?: boolean;
  feedbackStatus?: any;
  nextFlag?: boolean;
  completedFlag?: boolean;
}

/** 三节课任务上下文信息 */
export interface SanjiekeTaskInfo {
  courseId: string;
  lessonId: string;
  lessonName?: string;
  index: number;
}

/** 课时完成标记(本域 localStorage,防树状态回写延迟) */
export interface LessonDoneMark {
  status: "finished";
  expire: number;
}
