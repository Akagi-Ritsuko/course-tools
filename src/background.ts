import {
  NewExtensionServerMessage,
  SANJIEKE_COURSE_COMPLETE_TYPE,
  ZSGL_PLAIN_TASK_VISIT_TYPE,
  ZSGL_PLAIN_TASK_CLOSE_SELF,
} from "./internal/utils/message";
import { HttpUtils } from "./internal/utils/utils";
import { Application, Backend, Launcher } from "./internal/application";
import { ConsoleLog } from "./internal/utils/log";
import { ChromeConfigItems, NewBackendConfig } from "./internal/utils/config";

const UPDATE_CHECK_ALARM = "cxmooc-update-check";
const QUERY_SELECTION_MENU_ID = "cxmooc-query-selection";

// SW 冷启动时事件可能先于初始化到达:监听器顶层同步注册,处理器内部惰性等待初始化完成
let appReady: Promise<Application>;

// GM 桥接(主世界 mooc.js ↔ 扩展):NewExtensionServerMessage 构造函数内同步注册 onConnect,
// 此处模块顶层构造即满足 SW 顶层注册要求
const server = NewExtensionServerMessage("cxmooc-tools");
server.Accept((client, data) => {
  void appReady.then(() => {
    switch (data.type) {
      case "GM_xmlhttpRequest": {
        HttpUtils.SendRequest(client, data);
        break;
      }
      case "GM_notification": {
        chrome.notifications.create(
          {
            title: data.details.title,
            message: data.details.text,
            iconUrl: chrome.runtime.getURL("img/logo.png"),
            type: "basic",
          },
          (id) => {
            if (data.details.timeout) {
              setTimeout(() => {
                chrome.notifications.clear(id);
              }, data.details.timeout);
            }
          },
        );
        break;
      }
      case "GM_setValue": {
        Application.App.config.SetConfig(data.details.key, data.details.val);
        break;
      }
    }
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create(UPDATE_CHECK_ALARM, { periodInMinutes: 60 });
  // removeAll 防止 SW 重启后菜单 id 重复创建报错
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: QUERY_SELECTION_MENU_ID,
      title: "使用 网课小工具 搜索题目",
      contexts: ["selection"],
    });
  });
  checkUpdate();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === UPDATE_CHECK_ALARM) {
    checkUpdate();
  }
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== QUERY_SELECTION_MENU_ID || !info.selectionText) {
    return;
  }
  chrome.tabs.create({
    url:
      "https://cx.icodef.com/query.html?q=" +
      encodeURIComponent(info.selectionText),
  });
});

// 三节课毕业通知中转 / 无媒体任务开页 / 任务页自关:顶层同步注册
chrome.runtime.onMessage.addListener((msg: any, sender, sendResponse) => {
  if (msg?.type === SANJIEKE_COURSE_COMPLETE_TYPE) {
    const payload = {
      type: SANJIEKE_COURSE_COMPLETE_TYPE,
      courseId: msg.courseId,
    };
    const forward = (tabId: number) => {
      chrome.tabs.sendMessage(
        tabId,
        payload,
        () => void chrome.runtime.lastError,
      );
    };
    const openerTabId = sender.tab && sender.tab.openerTabId;
    if (openerTabId) {
      appReady.then(() =>
        Application.App.log.Warn(
          "[三方课程] 收到三节课毕业通知,中转至 opener 标签页 " + openerTabId,
        ),
      );
      forward(openerTabId);
    } else {
      appReady.then(() =>
        Application.App.log.Warn(
          "[三方课程] 收到三节课毕业通知,无 opener,广播 zsgl 标签页",
        ),
      );
      chrome.tabs.query({ url: "*://zsgl.lzlj.com/*" }, (tabs) => {
        (tabs || []).forEach((t) => t.id && forward(t.id));
      });
    }
    sendResponse({ success: true });
    return; // 同步应答 ack
  }
  if (msg?.type === ZSGL_PLAIN_TASK_VISIT_TYPE) {
    // 开页后不持定时器:关页由任务页侧按 URL 参数计时发起(ZSGL_PLAIN_TASK_CLOSE_SELF)
    chrome.tabs.create({ url: msg.url, active: false }, (tab) => {
      const tabId = tab?.id;
      appReady.then(() =>
        Application.App.log.Info(
          "[无媒体任务] 后台已打开任务页,停留满足后由任务页请求关闭",
          msg.url,
          "tabId=" + tabId,
        ),
      );
      sendResponse({ tabId });
    });
    return true; // 异步应答
  }
  if (msg?.type === ZSGL_PLAIN_TASK_CLOSE_SELF) {
    const tabId = sender.tab?.id;
    if (tabId !== undefined) {
      chrome.tabs.remove(tabId, () => void chrome.runtime.lastError);
    }
    sendResponse({ success: true });
    return;
  }
});

// 版本检查降级:MV3 禁止远程代码注入,仅保留"发现新版本 → badge 提示"
async function checkUpdate() {
  await appReady;
  Application.CheckUpdate((isnew, _data) => {
    if (isnew) {
      chrome.action.setBadgeText({ text: "new" });
      chrome.action.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
    }
  });
}

class background implements Launcher {
  public start() {
    // MV3 SW 生命周期要求:全部事件监听器已在模块顶层同步注册,此处无需再注册
  }
}

async function init(): Promise<Application> {
  let component = new Map<string, any>()
    .set("logger", new ConsoleLog())
    .set("config", new ChromeConfigItems(await NewBackendConfig()));
  let application = new Application(Backend, new background(), component);
  application.run();
  return application;
}

appReady = init();
