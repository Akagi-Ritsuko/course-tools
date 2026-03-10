/*
 * @Author: guotao
 * @Date: 2025-03-15 10:55:02
 * @LastEditors: guotao
 * @LastEditTime: 2025-03-09
 * @FilePath: \course-tools\src\mooc\zsgl\utils\utils.ts
 * @Description: zsgl 模块工具函数
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */
import { Application } from "@App/internal/application";
import { ZSGL_CONSTANTS } from "../constants";
import { HttpRequestCallback, HttpResponse, EventPreventHandler } from "../types";

/**
 * 存储所有HTTP请求钩子的Map
 */
const httpHooks: Map<string, Array<{ callback: HttpRequestCallback; context: any }>> = new Map();

/**
 * 保存原始的XMLHttpRequest.prototype.open
 */
const originalOpen = XMLHttpRequest.prototype.open;

/**
 * 初始化HTTP钩子（只执行一次）
 */
let hooksInitialized = false;

function initializeHooks() {
    if (hooksInitialized) return;
    hooksInitialized = true;

    XMLHttpRequest.prototype.open = function (method: string, url: string) {
        Application.App.log.Debug("拦截到HTTP请求:", url);
        
        httpHooks.forEach((hooks, urlMatch) => {
            if (url.includes(urlMatch)) {
                Application.App.log.Debug("匹配到钩子:", urlMatch);
                
                this.addEventListener('readystatechange', function () {
                    if (this.readyState === 4 && this.status === 200) {
                        try {
                            const response: HttpResponse = this.responseText.startsWith("{")
                                ? JSON.parse(this.responseText)
                                : this.responseText;
                            
                            hooks.forEach(hook => {
                                hook.callback(response, hook.context);
                            });
                        } catch (e) {
                            Application.App.log.Error("数据解析失败", e);
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
    context: any
): Promise<void> {
    initializeHooks();
    
    if (!httpHooks.has(urlMatch)) {
        httpHooks.set(urlMatch, []);
    }
    
    httpHooks.get(urlMatch)!.push({ callback, context });
    Application.App.log.Debug("注册HTTP钩子:", urlMatch);
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
    const handler = function (event: StorageEvent) {
        if (event.key === key) {
            const taskStatus = JSON.parse(event.newValue || "{}");
            if (taskStatus.status === "finished") {
                window.removeEventListener('storage', handler);
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
    btn.style.outline = 'none';
    btn.style.border = '0';
    btn.style.background = '#7d9d35';
    btn.style.color = '#fff';
    btn.style.borderRadius = '4px';
    btn.style.padding = '2px 8px';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '12px';
    btn.style.marginLeft = '4px';
    btn.style.zIndex = '10000';
    btn.onmousemove = () => {
        btn.style.boxShadow = '1px 1px 1px 1px #ccc';
    };
    btn.onmouseout = () => {
        btn.style.boxShadow = '';
    };
    return btn;
}

/**
 * 创建事件阻止处理器
 */
export function createEventPreventHandler(): EventPreventHandler {
    return function (this: any, e: Event) {
        console.log(`${this?.name || 'unknown'} ${e.type}事件触发`, e);
        e.stopImmediatePropagation();
        e.stopPropagation();
    };
}

/**
 * 设置事件阻止，防止页面检测
 * @param target 目标对象
 */
export function setupEventPrevention(target: Window | Document | HTMLElement): void {
    const handler = createEventPreventHandler();
    const events = [
        'blur', 'resize', 'visibilitychange', 'fullscreenchange',
        'focus', 'webkitfullscreenchange'
    ];

    events.forEach(event => {
        target.addEventListener(event, handler, true);
    });
}

/**
 * 设置视频事件阻止
 * @param video 视频元素
 */
export function setupVideoEventPrevention(video: HTMLVideoElement): void {
    const handler = createEventPreventHandler();
    video.addEventListener('seeked', handler, true);
    video.addEventListener('seeking', handler, true);
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
    options: { timeout?: number; interval?: number } = {}
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
    text: string
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
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 检查元素是否可见
 * @param element 元素
 */
export function isElementVisible(element: HTMLElement): boolean {
    return !!(
        element.offsetWidth ||
        element.offsetHeight ||
        element.getClientRects().length
    );
}
