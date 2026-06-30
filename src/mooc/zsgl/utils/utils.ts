/*
 * @Author: guotao
 * @Date: 2025-03-15 10:55:02
 * @LastEditors: guotao
 * @LastEditTime: 2026-03-13 17:35:26
 * @FilePath: \course-tools\src\mooc\zsgl\utils\utils.ts
 * @Description: zsgl 模块工具函数
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */
import { Application } from "@App/internal/application";
import { ZSGL_CONSTANTS } from "../constants";
import {
  HttpRequestCallback,
  HttpResponse,
  EventPreventHandler,
} from "../types";

/**
 * 存储所有HTTP请求钩子的Map
 */
const httpHooks: Map<
  string,
  Array<{ callback: HttpRequestCallback; context: any }>
> = new Map();

/**
 * 存储所有修改响应的钩子
 */
const modifyHooks: Map<
  string,
  Array<{ modifier: (response: any) => any; context: any }>
> = new Map();

/**
 * 保存原始的XMLHttpRequest.prototype.open
 */
const originalOpen = XMLHttpRequest.prototype.open;

/**
 * 保存原始的 responseText getter
 */
let originalResponseTextGetter: (() => string) | null = null;

/**
 * 初始化HTTP钩子（只执行一次）
 */
let hooksInitialized = false;

function initializeHooks() {
  if (hooksInitialized) return;
  hooksInitialized = true;

  XMLHttpRequest.prototype.open = function(method: string, url: string) {
    Application.App.log.Debug("拦截到HTTP请求:", url);

    const xhr = this;

    httpHooks.forEach((hooks, urlMatch) => {
      if (url.includes(urlMatch)) {
        Application.App.log.Debug("匹配到钩子:", urlMatch);

        this.addEventListener("readystatechange", function() {
          if (this.readyState === 4 && this.status === 200) {
            try {
              const response: HttpResponse = this.responseText.startsWith("{")
                ? JSON.parse(this.responseText)
                : this.responseText;

              hooks.forEach((hook) => {
                hook.callback(response, hook.context, url);
              });
            } catch (e) {
              Application.App.log.Error("数据解析失败", e);
            }
          }
        });
      }
    });

    modifyHooks.forEach((modifiers, urlMatch) => {
      if (url.includes(urlMatch)) {
        Application.App.log.Debug("匹配到修改钩子:", urlMatch);

        this.addEventListener("readystatechange", function() {
          if (this.readyState === 4 && this.status === 200) {
            try {
              let response = this.responseText.startsWith("{")
                ? JSON.parse(this.responseText)
                : this.responseText;

              modifiers.forEach((modifier) => {
                response = modifier.modifier.call(modifier.context, response);
              });

              const modifiedText = JSON.stringify(response);

              Object.defineProperty(xhr, "responseText", {
                get: function() {
                  return modifiedText;
                },
                configurable: true,
              });

              Object.defineProperty(xhr, "response", {
                get: function() {
                  return modifiedText;
                },
                configurable: true,
              });

              Application.App.log.Debug("响应已被修改:", urlMatch);
            } catch (e) {
              Application.App.log.Error("修改响应失败", e);
            }
          }
        });
      }
    });

    return originalOpen.apply(this, arguments as any);
  };
}

/**
 * 封装的通用HTTP请求钩子函数
 * @param urlMatch URL匹配字符串
 * @param callback 回调函数
 * @param context 上下文对象
 */
export async function hookHttpRequest(
  urlMatch: string,
  callback: HttpRequestCallback,
  context: any,
): Promise<void> {
  initializeHooks();

  if (!httpHooks.has(urlMatch)) {
    httpHooks.set(urlMatch, []);
  }

  httpHooks.get(urlMatch)!.push({ callback, context });
  Application.App.log.Debug("注册HTTP钩子:", urlMatch);
}

/**
 * 拦截并修改HTTP响应
 * @param urlMatch URL匹配字符串
 * @param modifier 修改函数，接收原始响应，返回修改后的响应
 * @param context 上下文对象
 * @example
 * // 禁用切换屏幕检测
 * hookAndModifyHttpResponse("queryCourseDetail.do", (response) => {
 *   if (response.body) {
 *     response.body.isOpenSwitchScreen = 0;
 *     response.body.isOpenScreenShot = 0;
 *   }
 *   return response;
 * }, this);
 */
export async function hookAndModifyHttpResponse(
  urlMatch: string,
  modifier: (response: any) => any,
  context: any,
): Promise<void> {
  initializeHooks();

  if (!modifyHooks.has(urlMatch)) {
    modifyHooks.set(urlMatch, []);
  }

  modifyHooks.get(urlMatch)!.push({ modifier, context });
  Application.App.log.Debug("注册响应修改钩子:", urlMatch);
}
// 修正语法错误并添加类型声明
export interface StorageHandler {
  (event: StorageEvent): void;
  key?: string;
}

/**
 * 创建存储事件处理器
 * @param key 存储键名
 */
export function createStorageHandler(key: string): StorageHandler {
  const handler = function(event: StorageEvent) {
    if (event.key === key) {
      const taskStatus = JSON.parse(event.newValue || "{}");
      if (taskStatus.status === "finished") {
        window.removeEventListener("storage", handler);
        window.location.reload();
      }
    }
  } as StorageHandler;
  handler.key = key;
  return handler;
}

/**
 * 美化按钮样式
 * @param btn 按钮元素
 */
export function CssBtn(btn: HTMLButtonElement): HTMLButtonElement {
  btn.style.outline = "none";
  btn.style.border = "0";
  btn.style.background = "#7d9d35";
  btn.style.color = "#fff";
  btn.style.borderRadius = "4px";
  btn.style.padding = "2px 8px";
  btn.style.cursor = "pointer";
  btn.style.fontSize = "12px";
  btn.style.marginLeft = "4px";
  btn.style.zIndex = "10000";
  btn.onmousemove = () => {
    btn.style.boxShadow = "1px 1px 1px 1px #ccc";
  };
  btn.onmouseout = () => {
    btn.style.boxShadow = "";
  };
  return btn;
}

/**
 * 创建事件阻止处理器
 */
export function createEventPreventHandler(): EventPreventHandler {
  return function(this: any, e: Event) {
    // console.log(`${this?.name || "unknown"} ${e.type}事件触发`, e);
    e.stopImmediatePropagation();
    e.stopPropagation();
  };
}

/**
 * 设置事件阻止，防止页面检测
 * @param target 目标对象
 */
export function setupEventPrevention(
  target: Window | Document | HTMLElement,
): void {
  const handler = createEventPreventHandler();
  const events = [
    "blur",
    "resize",
    "visibilitychange",
    "fullscreenchange",
    "focus",
    "webkitfullscreenchange",
    "mouseout",
    "mouseleave",
    "focusout",
    "focusin",
    "pagehide",
    "pageshow",
    "beforeunload",
    "freeze",
    "resume",
  ];

  events.forEach((event) => {
    target.addEventListener(event, handler, true);
  });
}

/**
 * 设置视频事件阻止
 * @param video 视频元素
 */
export function setupVideoEventPrevention(video: HTMLVideoElement): void {
  const handler = createEventPreventHandler();
  const videoEvents = [
    "seeked",
    "seeking",
    "ratechange",
    "volumechange",
  ];

  videoEvents.forEach((event) => {
    video.addEventListener(event, handler, true);
  });
}

/**
 * 定时器管理器，统一管理所有定时器
 */
export class TimerManager {
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  setTimeout(key: string, callback: () => void, delay: number): void {
    this.clearTimeout(key);
    const id = setTimeout(() => {
      this.timers.delete(key);
      callback();
    }, delay);
    this.timers.set(key, id);
  }

  setInterval(key: string, callback: () => void, delay: number): void {
    this.clearInterval(key);
    const id = setInterval(callback, delay);
    this.intervals.set(key, id);
  }

  clearTimeout(key: string): void {
    const id = this.timers.get(key);
    if (id) {
      clearTimeout(id);
      this.timers.delete(key);
    }
  }

  clearInterval(key: string): void {
    const id = this.intervals.get(key);
    if (id) {
      clearInterval(id);
      this.intervals.delete(key);
    }
  }

  clearAll(): void {
    this.timers.forEach((id) => clearTimeout(id));
    this.intervals.forEach((id) => clearInterval(id));
    this.timers.clear();
    this.intervals.clear();
  }
}

/**
 * 等待元素出现
 * @param selector 选择器
 * @param options 配置选项
 */
export function waitForElement(
  selector: string,
  options: { timeout?: number; interval?: number } = {},
): Promise<HTMLElement | null> {
  const { timeout = 10000, interval = 500 } = options;

  return new Promise((resolve) => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      resolve(element);
      return;
    }

    let attempts = 0;
    const maxAttempts = Math.floor(timeout / interval);
    const timer = setInterval(() => {
      attempts++;
      const el = document.querySelector(selector) as HTMLElement;
      if (el) {
        clearInterval(timer);
        resolve(el);
      } else if (attempts >= maxAttempts) {
        clearInterval(timer);
        resolve(null);
      }
    }, interval);
  });
}

/**
 * 通过文本内容查找元素
 * @param tagName 标签名
 * @param text 文本内容
 */
export function findElementByText(
  tagName: string,
  text: string,
): HTMLElement | null {
  const elements = document.querySelectorAll(tagName);
  for (const el of Array.from(elements)) {
    if (el.textContent?.includes(text)) {
      return el as HTMLElement;
    }
  }
  return null;
}

/**
 * 延时函数
 * @param ms 毫秒数
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 检查元素是否可见
 * @param element 元素
 */
export function isElementVisible(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

const DEFAULT_TIMEOUT = 30000;

/**
 * API响应接口
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error: string | null;
  status: number;
}

/**
 * 发送API请求
 * @param method 请求方法
 * @param url 请求URL
 * @param params URL参数
 * @param body 请求体
 * @param headers 额外请求头
 * @param timeout 超时时间
 */
export async function sendApiRequest<T = any>(
  method: "GET" | "POST",
  url: string,
  params?: Record<string, string | number>,
  body?: Record<string, any>,
  headers?: Record<string, string>,
  timeout: number = DEFAULT_TIMEOUT,
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    let requestUrl = url;
    const fetchOptions: RequestInit = {
      method,
      signal: controller.signal,
      credentials: "include",
    };

    if (params && Object.keys(params).length > 0) {
      const queryString = Object.entries(params)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
        )
        .join("&");
      requestUrl = `${url}${url.includes("?") ? "&" : "?"}${queryString}`;
    }

    if (body && method === "POST") {
      fetchOptions.body = JSON.stringify(body);
    }

    const defaultHeaders: Record<string, string> = {
      Accept: "application/json",
      Pragma: "no-cache",
    };

    if (method === "POST") {
      defaultHeaders["Content-Type"] = "application/json";
    }

    fetchOptions.headers = {
      ...defaultHeaders,
      ...headers,
    };

    Application.App.log.Debug(`发送API请求: ${method} ${requestUrl}`);

    const response = await fetch(requestUrl, fetchOptions);
    clearTimeout(timeoutId);

    if (!response.ok) {
      Application.App.log.Error(
        `API请求失败: ${response.status} ${response.statusText}`,
      );
      return {
        success: false,
        data: null,
        error: `HTTP错误: ${response.status} ${response.statusText}`,
        status: response.status,
      };
    }

    const data = await response.json();
    Application.App.log.Debug(`API响应成功:`, data);

    return {
      success: true,
      data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if ((error as Error).name === "AbortError") {
      Application.App.log.Error(`API请求超时: ${url}`);
      return {
        success: false,
        data: null,
        error: "请求超时",
        status: 0,
      };
    }

    Application.App.log.Error(`API请求异常:`, error);
    return {
      success: false,
      data: null,
      error: (error as Error).message || "未知错误",
      status: 0,
    };
  }
}

