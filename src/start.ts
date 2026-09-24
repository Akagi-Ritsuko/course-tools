import {
  Client,
  MOOC_INJECT_REQUEST,
  NewChromeServerMessage,
  SANJIEKE_COURSE_COMPLETE_TYPE,
  ZSGL_PLAIN_TASK_CLOSE_SELF,
  ZSGL_PLAIN_TASK_VISIT_TYPE,
} from "@App/internal/utils/message";
import {
  get,
  HttpUtils,
  Injected,
  InjectedBySrc,
  Noifications,
  NotificationOptions,
} from "@App/internal/utils/utils";
import { Application, Content, Launcher } from "@App/internal/application";
import {
  ChromeConfigItems,
  NewBackendConfig,
} from "@App/internal/utils/config";
import { ConsoleLog } from "./internal/utils/log";
import sources = chrome.devtools.panels.sources;

// 无媒体任务(resourceType=153)页侧自动关页:
// 关页 URL 参数由 studyMap.openPlainTask 写入(query 在 hash 之前),
// 页面自身计时后请求后台关闭自身(MV3 SW 定时器不可靠,时机由任务页掌控)
let plainTaskCloseScheduled = false;

function schedulePlainTaskCloseIfRequested(): void {
  if (plainTaskCloseScheduled) {
    return;
  }
  plainTaskCloseScheduled = true;
  const rawDelay = new URLSearchParams(location.search).get(
    "cxPlainTaskClose",
  );
  const delay = rawDelay ? parseInt(rawDelay, 10) : NaN;
  if (isNaN(delay) || delay <= 0) {
    return;
  }
  Application.App.log.Info(
    "[无媒体任务] 检测到自动关页参数,停留 " + delay + "ms 后请求后台关闭",
  );
  window.setTimeout(() => {
    chrome.runtime.sendMessage(
      { type: ZSGL_PLAIN_TASK_CLOSE_SELF },
      () => void chrome.runtime.lastError,
    );
  }, delay);
}

// 毕业通知 B 路发送:等待后台 ack,失败或无响应时小间隔重试
// (SW 冷启动可能延迟首次应答;最多重试 2 次,总窗口 < 关页延迟 1500ms)
function sendRelayWithAck(payload: any, retries: number = 2): void {
  chrome.runtime.sendMessage(payload, (resp: any) => {
    if (chrome.runtime.lastError || !resp?.success) {
      if (retries > 0) {
        window.setTimeout(() => sendRelayWithAck(payload, retries - 1), 400);
      }
    }
  });
}

// 请求 background 以 chrome.scripting MAIN world 注入 configData + mooc.js
// (浏览器侧注入不受页面 CSP 约束;失败时由调用方回退内联注入)
function requestMainWorldInject(configJson: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage(
        { type: MOOC_INJECT_REQUEST, configJson: configJson },
        (resp: any) => {
          if (chrome.runtime.lastError || !resp?.ok) {
            resolve(false);
            return;
          }
          resolve(true);
        },
      );
    } catch (e) {
      resolve(false);
    }
  });
}

class start implements Launcher {
  public async start() {
    schedulePlainTaskCloseIfRequested();
    const cacheJsonText = JSON.stringify(
      await Application.App.config.ConfigList(),
    );
    // MV3:优先交由 background 以 chrome.scripting MAIN world 注入(浏览器侧注入
    // 不受页面 CSP 约束);失败(旧内核无 world:MAIN/后台异常)时回退内联注入
    const mainWorldInjected = await requestMainWorldInject(cacheJsonText);
    if (!mainWorldInjected) {
      get(chrome.runtime.getURL("src/mooc.js"), function(source: string) {
        Injected(
          document,
          "window.configData=" + cacheJsonText + ";\n" + source,
        );
      });
    }
    let msg = NewChromeServerMessage("cxmooc-tools");
    msg.Accept((client, data) => {
      switch (data.type) {
        case "GM_xmlhttpRequest": {
          HttpUtils.SendRequest(client, data);
          break;
        }
        case "GM_notification": {
          Noifications(data.details);
          break;
        }
        case "GM_setValue": {
          Application.App.Client.Send({
            type: "GM_setValue",
            details: data.details,
          });
          break;
        }
        case SANJIEKE_COURSE_COMPLETE_TYPE: {
          // 三节课毕业通知:经后台中转回 zsgl 课程页(opener 直推失效时的兜底通路)
          // sendRelayWithAck 等待后台 ack,SW 冷启动无响应/失败时自动重试,
          // 确保页面在关页延迟(1500ms)内送达
          sendRelayWithAck({
            type: SANJIEKE_COURSE_COMPLETE_TYPE,
            courseId: data.details?.courseId,
          });
          break;
        }
        case ZSGL_PLAIN_TASK_VISIT_TYPE: {
          // 无媒体任务访问中转:学习地图页(主世界) → 后台 chrome.tabs 开任务页
          // (页面侧 window.open 受用户激活/弹窗拦截限制,后台开页不受限)
          chrome.runtime.sendMessage(
            {
              type: ZSGL_PLAIN_TASK_VISIT_TYPE,
              url: data.url,
              delayMs: data.delayMs,
            },
            (resp: any) => {
              // 回传后台创建的 tabId 供学习地图页日志追踪
              client.Send({
                type: "ZSGL_PLAIN_TASK_VISIT_RESULT",
                tabId: resp?.tabId,
              });
            },
          );
          break;
        }
      }
    });
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log("[每日积分] start: 收到消息", request);
      if (request.type && request.type == "cxconfig") {
        window.postMessage(
          { type: "cxconfig", key: request.key, value: request.value },
          "/",
        );
      }
      if (request.type === "START_DAILY_POINTS") {
        console.log(
          "[每日积分] start: 转发START_DAILY_POINTS消息到页面",
          request.data,
        );
        window.postMessage(
          { type: "START_DAILY_POINTS", data: request.data },
          "*",
        );
        sendResponse({ success: true });
      }
      if (request.type === "STOP_DAILY_POINTS") {
        console.log("[每日积分] start: 转发STOP_DAILY_POINTS消息到页面");
        window.postMessage({ type: "STOP_DAILY_POINTS" }, "*");
        sendResponse({ success: true });
      }
      if (request.type === "UPDATE_PROGRESS") {
        console.log(
          "[每日积分] start: 转发UPDATE_PROGRESS消息到页面",
          request.data,
        );
        window.postMessage(
          { type: "UPDATE_PROGRESS", data: request.data },
          "*",
        );
        sendResponse({ success: true });
      }
      if (request.type === SANJIEKE_COURSE_COMPLETE_TYPE) {
        // 后台中转回的三节课毕业通知:转入页面上下文,由 zsgl 课程页监听闭环
        window.postMessage(
          {
            type: SANJIEKE_COURSE_COMPLETE_TYPE,
            courseId: request.courseId,
          },
          "*",
        );
        sendResponse({ success: true });
      }
      return true;
    });
  }
}

async function init() {
  // 内容脚本世界:日志落地 localStorage(key 与注入世界区分,避免互相覆盖)
  let component = new Map<string, any>()
    .set("config", new ChromeConfigItems(await NewBackendConfig()))
    .set("logger", new ConsoleLog("zsgl_log_cs"));
  let application = new Application(Content, new start(), component);
  application.run();
}
init();
window.addEventListener("hashchange", () => {
  console.log("Hash changed:", location.hash);
  if (location.hash.includes("home/studyDetail")) {
    init();
  }
});
