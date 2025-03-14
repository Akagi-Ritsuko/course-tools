import { Application } from "@App/internal/application";

// 封装的通用工具函数
export function hookHttpRequest(urlMatch: string, callback: (response: any, context: any) => void, context: any) {
    const originalOpen = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function(method: string, url: string) {
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
