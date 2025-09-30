/*
 * @Author: guotao
 * @Date: 2025-03-15 10:55:02
 * @LastEditors: guotao
 * @LastEditTime: 2025-09-30 14:17:34
 * @FilePath: \course-tools\src\mooc\zsgl\utils\utils.ts
 * @Description: 
 * 
 * Copyright (c) 2025 by lzlj, All Rights Reserved. 
 */
import { Application } from "@App/internal/application";

// 封装的通用工具函数
export async function hookHttpRequest(urlMatch: string, callback: (response: any, context: any) => void, context: any) {
    const originalOpen = XMLHttpRequest.prototype.open;

     XMLHttpRequest.prototype.open =function(method: string, url: string) {
        if (url.includes(urlMatch)) {
            this.addEventListener('readystatechange', function() {
                if (this.readyState === 4 && this.status === 200) {
                    try {
                        const response = JSON.parse(this.responseText);
                        callback(response, context);
                    } catch (e) {
                        Application.App.log.Error("数据解析失败", e);
                    }
                }
            });
        }
        return originalOpen.apply(this, arguments as any);
    };
}
// 修正语法错误并添加类型声明
export interface StorageHandler {
    (event: StorageEvent): void;
    key?: string;
}

export function createStorageHandler(key: string): StorageHandler {
    const handler = function(event: StorageEvent) {
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
 * 美化按钮
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
