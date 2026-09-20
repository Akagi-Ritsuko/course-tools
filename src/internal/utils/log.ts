import { Application } from "../application";
import "../../views/common";
import { Noifications } from "@App/internal/utils/utils";

export interface Logger {
    Debug(...args: any): Logger;

    Info(...args: any): Logger;

    Warn(...args: any): Logger;

    Error(...args: any): Logger;

    Fatal(...args: any): Logger;
}

/** 日志落地 localStorage key 前缀 */
const LOG_STORAGE_PREFIX = "zsgl_log_";
/** 环形缓冲上限(行数),超出丢弃最旧日志 */
const LOG_BUFFER_MAX_LINES = 2000;
/** 定时落地间隔(ms),崩溃时最多丢失该时间窗口内的日志 */
const LOG_FLUSH_INTERVAL_MS = 5000;

/** 安全序列化,失败时退化为 String() */
function safeStringify(value: any): string {
    if (value === null || value === undefined) return String(value);
    if (typeof value !== "object") return String(value);
    try {
        return JSON.stringify(value);
    } catch (e) {
        try {
            return String(value);
        } catch (e2) {
            return "[unserializable]";
        }
    }
}

function formatClock(): string {
    const time = new Date();
    return time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
}

function formatFileTimestamp(): string {
  const now = new Date();
  const pad = (n: number): string => String(n).padStart(2, "0");
  return (
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
    `-${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`
  );
}

/** 提取错误完整信息(Error 的 message/stack 不可枚举,直接 JSON.stringify 会得到 {}) */
function errorToText(reason: any): string {
  if (reason instanceof Error) {
    return reason.stack || `${reason.name}: ${reason.message}`;
  }
  return safeStringify(reason);
}

/** 下载文本文件(保存到浏览器默认下载目录) */
function downloadTextFile(filename: string, content: string): void {
    try {
        const blob = new Blob(["\ufeff" + content], {
            type: "text/plain;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
        /* 下载失败不影响主流程 */
    }
}

/** 日志转存开关的配置键(配置页"知识管理"分组) */
const LOG_PERSIST_KEY = "log_persist_enabled";

/**
 * 读取日志转存开关(默认开启)
 * 配置页在平台分组下保存,实际键为 "zsgl_log_persist_enabled"(带命名空间前缀),
 * 因此优先读命名空间键,再兼容全局键;应用未就绪时视为开启
 */
function isPersistEnabled(): boolean {
    try {
        const app = (Application as any).App;
        if (!app || !app.config) return true;
        let enabled: string | undefined;
        if (typeof app.config.GetNamespaceConfig === "function") {
            enabled = app.config.GetNamespaceConfig(
                "zsgl",
                LOG_PERSIST_KEY,
                undefined,
            );
        }
        if (enabled == undefined || enabled === "") {
            enabled = app.config.GetConfig(LOG_PERSIST_KEY, "true");
        }
        return String(enabled).toLowerCase() !== "false";
    } catch (e) {
        return true;
    }
}

/** 心跳超过该时长视为标签页已死亡(存活标签页每次落地都会刷新心跳) */
const LOG_HEARTBEAT_STALE_MS = 30000;

/** 获取当前标签页会话ID(sessionStorage 按标签页隔离,同标签页刷新后保持) */
function getTabId(): string {
    try {
        let id = sessionStorage.getItem("zsgl_log_tab_id");
        if (!id) {
            id =
                Date.now().toString(36) +
                Math.random().toString(36).substring(2, 8);
            sessionStorage.setItem("zsgl_log_tab_id", id);
        }
        return id;
    } catch (e) {
        return "t" + Date.now().toString(36);
    }
}

/**
 * 日志记录器:内存环形缓冲 + localStorage 定时落地
 * 缓冲按"世界 + 标签页"隔离,心跳判定存活,页面崩溃/被杀后遗留的缓冲
 * 由下一个页面加载时自动导出(pagehide 已正常转存的除外)
 * 写入行为受配置 log_persist_enabled 控制,关闭时不产生任何本地存储写入
 */
class LogRecorder {
  private lines: string[] = [];
  /** 遗留缓冲是否已检查过(延迟到配置就绪后执行一次) */
  private orphanChecked: boolean = false;
  /** 当前标签页会话ID */
  private tabId: string;

  constructor(private storageKey: string) {
        this.tabId = getTabId();
        // 启动诊断:写进缓冲本身,用于验证各世界的记录器是否正常工作
        this.record("info", `[日志转存] 已启用 key=${storageKey} tabId=${this.tabId}`);
        // 延迟检查遗留缓冲:确保 Application/config 已就绪,能正确读到开关配置
        setTimeout(() => this.recoverOrphanedBuffer(), 3000);
        setInterval(() => {
            if (this.orphanChecked) this.flush();
        }, LOG_FLUSH_INTERVAL_MS);
        window.addEventListener("pagehide", () => this.onPageHide());
    }

  private get bufferKey(): string {
    return `${this.storageKey}_${this.tabId}`;
  }

  private get hbKey(): string {
    return `${this.storageKey}_hb_${this.tabId}`;
  }

  private get lastKey(): string {
    return `${this.storageKey}_last`;
  }

  /** 追加一行并执行环形缓冲裁剪 */
  private pushLine(line: string): void {
    this.lines.push(line);
    if (this.lines.length > LOG_BUFFER_MAX_LINES) {
      this.lines.splice(0, this.lines.length - LOG_BUFFER_MAX_LINES);
    }
  }

  /** 记录当前 JS 堆占用(仅 Chrome 支持)与页面标识,用于定位内存暴涨类崩溃 */
  private recordMemoryUsage(): void {
    try {
      const mem = (performance as any).memory;
      if (!mem) return;
      const mb = (n: any): string => (Number(n) / 1048576).toFixed(1);
      const page = (location.hash || location.pathname).substring(0, 60);
      this.pushLine(
        `[mem ${formatClock()}] JS堆 used ${mb(
          mem.usedJSHeapSize,
        )}MB / total ${mb(mem.totalJSHeapSize)}MB / limit ${mb(
          mem.jsHeapSizeLimit,
        )}MB @ ${page}`,
      );
    } catch (e) {
      /* 忽略 */
    }
  }

  /** 追加一条日志(环形缓冲,超限丢最旧);转存关闭时不记录 */
  public record(level: string, args: any[]): void {
    if (!isPersistEnabled()) return;
    try {
      const text = args.map(safeStringify).join(" ");
      this.pushLine(`[${level} ${formatClock()}] ${text}`);
    } catch (e) {
      /* 记录失败不影响主流程 */
    }
  }

  /** 定时落地到 localStorage 并刷新心跳;转存关闭时不写入 */
  private flush(): void {
    if (!isPersistEnabled()) return;
    this.recordMemoryUsage();
    if (this.lines.length === 0) return;
    try {
      localStorage.setItem(this.bufferKey, this.lines.join("\n"));
      localStorage.setItem(this.hbKey, String(Date.now()));
    } catch (e) {
      /* 配额超限等异常忽略 */
    }
  }

  /** 正常退出(含页面跳转):转存到 _last 并清空本标签页缓冲;转存关闭时不写入 */
  private onPageHide(): void {
    if (!isPersistEnabled()) return;
    this.flush();
    try {
      localStorage.setItem(this.lastKey, this.lines.join("\n"));
      localStorage.removeItem(this.bufferKey);
      localStorage.removeItem(this.hbKey);
    } catch (e) {
      /* 忽略 */
    }
  }

  /**
   * 启动时检查遗留缓冲:心跳过期的标签页=已崩溃/被杀,
   * zsgl 站点自动导出其缓冲;心跳新鲜的是其他存活标签页,不能抢占
   */
  private recoverOrphanedBuffer(): void {
    this.orphanChecked = true;
    try {
      if (!isPersistEnabled()) return;
      const orphans: string[] = [];
      const staleKeys: string[] = [];
      const keyPrefix = this.storageKey + "_";
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith(keyPrefix)) continue;
        if (key === this.lastKey) continue;
        if (key.startsWith(this.storageKey + "_hb_")) continue;
        const tabId = key.substring(keyPrefix.length);
        const hb = Number(
          localStorage.getItem(this.storageKey + "_hb_" + tabId) || 0,
        );
        if (hb && Date.now() - hb <= LOG_HEARTBEAT_STALE_MS) {
          continue;
        }
        orphans.push(`===== ${key} =====\n${localStorage.getItem(key) || ""}`);
        staleKeys.push(key, this.storageKey + "_hb_" + tabId);
      }
      if (orphans.length === 0) return;
      if (window.location.host.includes("zsgl")) {
        downloadTextFile(
          `工具日志_上次崩溃_${formatFileTimestamp()}.log`,
          orphans.join("\n") +
            "\n" +
            (localStorage.getItem(this.lastKey) || ""),
        );
      }
      staleKeys.forEach((k) => localStorage.removeItem(k));
    } catch (e) {
      /* 忽略 */
    }
  }
}

const recorderCache: Map<string, LogRecorder> = new Map();

function recordAll(level: string, args: any[]): void {
    recorderCache.forEach((recorder) => recorder.record(level, args));
}

/** 全局异常捕获:写入缓冲便于崩溃后定位(浏览器默认仍会打印,此处只记录不阻断) */
let globalCaptureInstalled = false;
function installGlobalErrorCapture(): void {
    if (globalCaptureInstalled) return;
    globalCaptureInstalled = true;
    try {
        window.addEventListener("error", (e) => {
            recordAll(
                "error",
                [`Uncaught: ${e.message} @ ${e.filename}:${e.lineno}:${e.colno}`],
            );
        });
        window.addEventListener("unhandledrejection", (e) => {
            const reason = (e as PromiseRejectionEvent).reason;
            recordAll("error", [`UnhandledRejection: ${errorToText(reason)}`]);
        });
    } catch (e) {
        /* 忽略 */
    }
}

/** 手动导出全部落地日志(控制台执行 __toolLogExport()) */
let exportInstalled = false;
function installExportFunction(): void {
    if (exportInstalled) return;
    exportInstalled = true;
    try {
        const w = window as any;
        w.__toolLogExport = () => {
            const parts: string[] = [];
            try {
                for (let i = 0; i < localStorage.length; i++) {
                                                                const key = localStorage.key(
                                                                  i,
                                                                );
                                                                // 排除心跳 key(时间戳噪声),只导出缓冲与正常退出转存
                                                                if (
                                                                  key &&
                                                                  key.startsWith(
                                                                    LOG_STORAGE_PREFIX,
                                                                  ) &&
                                                                  !key.includes(
                                                                    "_hb_",
                                                                  )
                                                                ) {
                                                                  parts.push(
                                                                    `===== ${key} =====\n${localStorage.getItem(
                                                                      key,
                                                                    ) || ""}`,
                                                                  );
                                                                }
                                                              }
            } catch (e) {
                /* 忽略 */
            }
            downloadTextFile(
                `工具日志_${formatFileTimestamp()}.log`,
                parts.join("\n---\n") || "无日志",
            );
        };
    } catch (e) {
        /* 忽略 */
    }
}

/**
 * 获取/创建记录器
 * 仅顶层窗口落地(iframe 世界与未传 key 的场景返回 null,只输出控制台)
 */
function getRecorder(storageKey: string | null): LogRecorder | null {
    if (!storageKey) return null;
    try {
        if (window.top !== window) return null;
    } catch (e) {
        return null;
    }
    let recorder = recorderCache.get(storageKey);
    if (!recorder) {
        recorder = new LogRecorder(storageKey);
        recorderCache.set(storageKey, recorder);
        installGlobalErrorCapture();
        installExportFunction();
    }
    return recorder;
}

// 开发者工具f12处打印日志
export class ConsoleLog implements Logger {
  /** 日志落地记录器(null 表示不落地) */
  private recorder: LogRecorder | null;

  constructor(storageKey: string | null = null) {
    this.recorder = getRecorder(storageKey);
  }

  protected getNowTime(): string {
    let time = new Date();
    return time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
  }

  public Debug(...args: any): Logger {
    // record 不受 debug 开关门控,崩溃诊断需要 debug 级日志
    this.recorder?.record("debug", args);
    Application.App.debug &&
      console.info("[debug", this.getNowTime(), "]", ...args);
    return this;
  }

  public Info(...args: any): Logger {
    this.recorder?.record("info", args);
    Application.App.debug &&
      console.info("[info", this.getNowTime(), "]", ...args);
    return this;
  }

  public Warn(...args: any): Logger {
    this.recorder?.record("warn", args);
    console.warn("[warn", this.getNowTime(), "]", ...args);
    return this;
  }

  public Error(...args: any): Logger {
    this.recorder?.record("error", args);
    console.error("[error", this.getNowTime(), "]", ...args);
    return this;
  }

  public Fatal(...args: any): Logger {
    this.recorder?.record("fatal", args);
    console.error("[fatal", this.getNowTime(), "]", ...args);
    return this;
  }
}

export class PageLog implements Logger {
  protected el: HTMLElement;
  protected div: HTMLElement;
  protected is_notify: boolean;
  /** 日志落地记录器(null 表示不落地) */
  private recorder: LogRecorder | null;

  constructor(storageKey: string | null = null) {
    this.el = undefined;
    this.recorder = getRecorder(storageKey);
    window.addEventListener("load", () => {
      this.div = document.createElement("div");
      // 主要布局
      this.div.innerHTML = `
            <div class="head" id="tools-head">
               <span>小工具通知条</span>
               <label class="switch" style="width:90px">
                  <input class="checkbox-input" id="checkbox" type="checkbox" checked="checked">
                  <label class="checkbox" for="checkbox"></label>
                  <span>桌面通知</span>
               </label>
               <span class="close" style="float:right; cursor:pointer; margin-right:5px;">x</span>
            </div>
            <div class="main">
               <div class="tools-notice-content"></div>
            </div>
            `;

      this.div.className = "tools-logger-panel";
      document.body.appendChild(this.div);
      this.el = this.div.querySelector(".tools-notice-content");
      (<HTMLButtonElement>this.div.querySelector(".close")).onclick = () => {
        this.el = undefined;
        this.div.remove();
      };
      let checkbox = <HTMLInputElement>this.div.querySelector("#checkbox");
      checkbox.checked =
        (Application.App.config.GetConfig("is_notify") || "true") == "true";
      this.is_notify = checkbox.checked;
      if (!checkbox.checked) {
        checkbox.removeAttribute("checked");
      }
      let self = this;
      checkbox.addEventListener("change", function() {
        self.is_notify = this.checked;
        Application.App.config.SetConfig("is_notify", this.checked.toString());
      });

      //支持拖拽移动
      function getProperty(ele: HTMLElement, prop: any) {
        return parseInt(window.getComputedStyle(ele)[prop]);
      }

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const containerWidth = getProperty(this.div, "width");
      const containerHeight = getProperty(this.div, "height");
      let x = parseInt(
        Application.App.config
          .GetConfig("notify_tools_x", "60px")
          .replace("px", ""),
      );
      if (x < 0) {
        x = 0;
      }
      if (x >= windowWidth - containerWidth) x = windowWidth - containerWidth;
      this.div.style.left = x + "px";
      let y = parseInt(
        Application.App.config
          .GetConfig("notify_tools_y", "40px")
          .replace("px", ""),
      );
      if (y < 0) {
        y = 0;
      }
      if (y >= windowHeight - containerHeight)
        y = windowHeight - containerHeight;
      this.div.style.top = y + "px";

      let head = <HTMLElement>this.div.querySelector("#tools-head");
      head.onmousedown = (downEvent) => {
        let relaX = downEvent.clientX - this.div.offsetLeft;
        let relaY = downEvent.clientY - this.div.offsetTop;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const containerWidth = getProperty(this.div, "width");
        const containerHeight = getProperty(this.div, "height");

        document.onmousemove = (moveEvent) => {
          let targetX = moveEvent.clientX - relaX;
          let targetY = moveEvent.clientY - relaY;

          if (targetX <= 0) targetX = 0;
          if (targetY <= 0) targetY = 0;
          if (targetX >= windowWidth - containerWidth)
            targetX = windowWidth - containerWidth;
          if (targetY >= windowHeight - containerHeight)
            targetY = windowHeight - containerHeight;

          this.div.style.left = targetX + "px";
          this.div.style.top = targetY + "px";
        };
        document.onmouseup = () => {
          document.onmouseup = null;
          document.onmousemove = null;
          Application.App.config.SetConfig(
            "notify_tools_x",
            this.div.style.left,
          );
          Application.App.config.SetConfig(
            "notify_tools_y",
            this.div.style.top,
          );
        };
      };
    });
  }

  protected getNowTime(): string {
    let time = new Date();
    return time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
  }

  first(text: string, color: string, background: string) {
    let new_log = document.createElement("div");
    new_log.innerHTML =
      `
                <div class="log" style="border-color: ` +
      background +
      `; background-color: ` +
      background +
      `;">
                    <p><span style="color:` +
      color +
      `;">` +
      text +
      `</span></p>
                </div>
            `;
    //插入第一个元素前
    var first = document
      .getElementsByClassName("tools-notice-content")[0]
      .getElementsByTagName("div");
    document
      .querySelector(".tools-notice-content")
      .insertBefore(new_log, first[0]);
  }

  protected toStr(...args: any): string {
    let text = "";
    for (let i = 0; i < args.length; i++) {
      if (typeof args[i] == "object") {
        text += args[i].toString() + "\n";
      } else {
        text += args[i] + "\n";
      }
    }
    return text.substring(0, text.length - 1);
  }

  public Debug(...args: any): Logger {
    this.recorder?.record("debug", args);
    console.info("[debug", this.getNowTime(), "]", ...args);
    return this;
  }

  public Info(...args: any): Logger {
    this.recorder?.record("info", args);
    let text = this.toStr(...args);
    if (this.el) {
      this.first(text, "#409EFF", "rgba(121, 187, 255, 0.2)");
    } else {
      console.info("[info", this.getNowTime(), "]", ...args);
    }
    return this;
  }

  public Warn(...args: any): Logger {
    this.recorder?.record("warn", args);
    let text = this.toStr(...args);
    if (this.el) {
      this.first(text, "#5C3C00", "rgba(250, 236, 216, 0.4)");
    }
    console.warn("[warn", this.getNowTime(), "]", ...args);
    if (document.hidden && localStorage["is_notify"] == "true") {
      Noifications({
        title: "网课小工具",
        text: text + "\n3秒后自动关闭",
        timeout: 3000,
      });
    }
    return this;
  }

  public Error(...args: any): Logger {
    this.recorder?.record("error", args);
    let text = this.toStr(...args);
    if (this.el) {
      this.first(text, "#FFF0F0", "rgba(253, 226, 226, 0.5)");
    }
    console.error("[error", this.getNowTime(), "]", ...args);
    if (localStorage["is_notify"] == "true") {
      Noifications({
        title: "网课小工具",
        text: text,
      });
    }
    return this;
  }

  public Fatal(...args: any): Logger {
    this.recorder?.record("fatal", args);
    let text = this.toStr(...args);
    if (this.el) {
      this.first(text, "#ff0000", "rgba(253, 226, 226, 0.5)");
    }
    console.error("[fatal", this.getNowTime(), "]", ...args);
    Noifications({
      title: "网课小工具",
      text: text,
    });
    return this;
  }
}

export class EmptyLog implements Logger {
    public Debug(...args: any): Logger {
        return this;
    }

    public Info(...args: any): Logger {
        return this;
    }

    public Warn(...args: any): Logger {
        return this;
    }

    public Error(...args: any): Logger {
        return this;
    }

    public Fatal(...args: any): Logger {
        return this;
    }
}
