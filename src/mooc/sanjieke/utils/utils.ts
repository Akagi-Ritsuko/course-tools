/*
 * @Description: 三节课（sanjieke）模块工具函数
 * 复用 zsgl/utils/utils.ts 的 HTTP 钩子与防切屏工具（薄封装转发）,
 * 并提供三节课专属的 URL 解析与课时完成标记工具
 *
 * Copyright (c) 2026 by lzlj, All Rights Reserved.
 */
import { SANJIEKE_CONSTANTS } from "../constants";
import { LessonDoneMark } from "../types";

// ---- 转发复用 zsgl 模块的通用工具(经 import 复用) ----
export {
  hookHttpRequest,
  removeHttpRequestHook,
  hookAndModifyHttpResponse,
  TimerManager,
  setupVisibilitySpoof,
  setupSwitchScreenNeutralizer,
  setupEventPrevention,
  waitForElement,
  findElementByText,
  sleep,
  sendApiRequest,
} from "../../zsgl/utils/utils";

/**
 * 解析三节课学习页 URL
 * 页面格式: /study/0/{courseId}/{lessonId}
 */
export function parseStudyUrl(): {
  courseId: string;
  lessonId: string;
} | null {
  const path = window.location.pathname;
  if (!path.startsWith(SANJIEKE_CONSTANTS.URL_PATTERNS.STUDY_PATH)) {
    return null;
  }
  const parts = path
    .substring(SANJIEKE_CONSTANTS.URL_PATTERNS.STUDY_PATH.length)
    .split("/")
    .filter((p) => p.length > 0);
  if (parts.length < 1) {
    return null;
  }
  return {
    courseId: parts[0],
    lessonId: parts.length > 1 ? parts[1] : "",
  };
}

/**
 * 写入课时完成标记(本域 localStorage)
 * 用于对抗 content/tree 完成状态回写延迟,防止页面重载后重复播放已学课时
 */
export function setLessonDoneMark(courseId: string, lessonId: string): void {
  if (!courseId || !lessonId) {
    return;
  }
  const mark: LessonDoneMark = {
    status: "finished",
    expire: Date.now() + SANJIEKE_CONSTANTS.LESSON_DONE_TTL_MS,
  };
  try {
    localStorage.setItem(
      `${SANJIEKE_CONSTANTS.STORAGE_PREFIX.LESSON_DONE}${courseId}_${lessonId}`,
      JSON.stringify(mark),
    );
  } catch (e) {
    // localStorage 不可用时静默失败,不影响主流程
  }
}

/**
 * 检查课时是否有有效(未过期)的完成标记
 */
export function isLessonDoneMarked(courseId: string, lessonId: string): boolean {
  if (!courseId || !lessonId) {
    return false;
  }
  try {
    const raw = localStorage.getItem(
      `${SANJIEKE_CONSTANTS.STORAGE_PREFIX.LESSON_DONE}${courseId}_${lessonId}`,
    );
    if (!raw) {
      return false;
    }
    const mark = JSON.parse(raw) as LessonDoneMark;
    return mark?.status === "finished" && mark.expire > Date.now();
  } catch (e) {
    return false;
  }
}

/**
 * 清除单个课时的完成标记
 * 用于以课程树完成状态为准校验本地标记:树判定未完成时清除,防止误跳过未完成课时
 */
export function clearLessonDoneMark(courseId: string, lessonId: string): void {
  if (!courseId || !lessonId) {
    return;
  }
  try {
    localStorage.removeItem(
      `${SANJIEKE_CONSTANTS.STORAGE_PREFIX.LESSON_DONE}${courseId}_${lessonId}`,
    );
  } catch (e) {
    // 忽略清理失败
  }
}

/**
 * 清理指定课程的全部课时完成标记(课程毕业时调用)
 */
export function clearLessonDoneMarks(courseId: string): void {
  try {
    const prefix = `${SANJIEKE_CONSTANTS.STORAGE_PREFIX.LESSON_DONE}${courseId}_`;
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keys.push(key);
      }
    }
    keys.forEach((key) => localStorage.removeItem(key));
  } catch (e) {
    // 忽略清理失败
  }
}
