/*
 * @Author: guotao
 * @Date: 2025-03-15 10:55:02
 * @LastEditors: guotao
 * @LastEditTime: 2025-03-15 12:38:44
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
