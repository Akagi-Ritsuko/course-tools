type recvCallback = (data: any) => void

export interface Client {
    Recv(callback: recvCallback): void

    Send(msg: any): void
}

type serverRecvCallback = (client: Client, data: any) => void

export interface Server {
    Accept(callback: serverRecvCallback): void
}

/**
 * 三节课毕业完成通知消息类型
 * sanjieke 页 → zsgl 课程页闭环专用,study/course/start/background 四处共用单一常量源
 */
export const SANJIEKE_COURSE_COMPLETE_TYPE = "sanjieke_course_complete"

/**
 * 无媒体任务(resourceType=153)访问消息类型
 * zsgl 学习地图页(主世界) → start.ts 中继 → background chrome.tabs 开任务页
 * (页面侧 window.open 受用户激活/弹窗拦截限制,后台开页不受限且持 tabId 可精准关闭)
 */
export const ZSGL_PLAIN_TASK_VISIT_TYPE = "zsgl_plain_task_visit"

/**
 * 无媒体任务页自动关闭消息类型
 * 任务页 start.ts 按 URL 参数计时后发送,background 依据 sender.tab.id 关闭任务页
 * (MV3 SW 定时器不可靠,关页时机由任务页侧掌控)
 */
export const ZSGL_PLAIN_TASK_CLOSE_SELF = "zsgl_plain_task_close_self"

export function NewExtensionServerMessage(port: string): extensionServerMessage {
    return new extensionServerMessage(port)
}

class extensionServerMessage implements Server {
    private port: string;
    private acceptCallback: serverRecvCallback;

    constructor(port: string) {
        this.port = port;
        this.recv();
    }

    private recv(): void {
        //监听消息
        chrome.runtime.onConnect.addListener((port) => {
            if (port.name != this.port) {
                return;
            }
            port.onMessage.addListener((request) => {
                this.acceptCallback(new extensionClientMessage(port), request);
            });
        });
    }

    public Accept(callback: serverRecvCallback): void {
        this.acceptCallback = callback
    }

}

abstract class msg {
    protected tag: string;
    protected recvCallback: recvCallback;

    constructor(tag: string) {
        this.tag = tag;
    }

    public Recv(callback: recvCallback): void {
        this.recvCallback = callback;
    }
}

// 扩展中使用
export function NewExtensionClientMessage(tag: string): Client {
    return new extensionClientMessage(tag)
}

class extensionClientMessage extends msg implements Client {
    private conn: chrome.runtime.Port;

    constructor(param: string | chrome.runtime.Port) {
        if (typeof param === 'string') {
            super(param as string);
            this.connect();
        } else {
            // 修复 TS17009:派生构造函数中必须先调用 super 才能访问 this
            // (原 else 分支在运行时会抛 ReferenceError,属不可达死分支)
            super("");
            this.conn = param as chrome.runtime.Port;
        }
        this.recv();
    }

    private connect(): void {
        this.conn = chrome.runtime.connect({ name: this.tag });
    }

    private recv() {
        this.conn.onMessage.addListener((response) => {
            this.recvCallback(response);
        });
    }

    public Send(msg: any): void {
        this.conn.postMessage(msg);
    }
}

// 浏览器中使用
export function NewChromeServerMessage(tag: string): Server {
    return new chromeServerMessage(tag)
}

class chromeServerMessage implements Server {

    private tag: string;
    private acceptCallback: serverRecvCallback;

    constructor(tag: string) {
        this.tag = tag;
        this.recv();
    }

    private recv(): void {
        window.addEventListener('message', (event) => {
            if (event.data.tag == this.tag && event.data.conn_tag && event.data.source == "client") {
                this.acceptCallback(new chromeClientMessage(this.tag, event.data.conn_tag), event.data.msg)
            }
        });
    }

    public Accept(callback: serverRecvCallback): void {
        this.acceptCallback = callback
    }

}

export function NewChromeClientMessage(tag: string): Client {
    return new chromeClientMessage(tag)
}

class chromeClientMessage extends msg implements Client {

    private source: string;
    private connTag: number;

    constructor(tag: string, conn?: number) {
        if (conn !== undefined) {
            super(tag);
            this.connTag = conn;
            this.source = "server";
        } else {
            super(tag);
            this.connect();
            this.source = "client";
        }
    }

    private connect(): void {
        this.connTag = Math.random();
        window.addEventListener('message', (event) => {
            if (event.data.tag == this.tag && event.data.conn_tag == this.connTag && event.data.source == "server") {
                this.recvCallback && this.recvCallback(event.data.msg);
            }
        });
    }

    public Send(msg: any): void {
        window.postMessage({ tag: this.tag, conn_tag: this.connTag, msg: msg, source: this.source }, '*');
    }
}

