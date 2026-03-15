import { Client, NewChromeServerMessage } from "@App/internal/utils/message";
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

class start implements Launcher {
  public async start() {
    let cacheJsonText = JSON.stringify(
      await Application.App.config.ConfigList(),
    );
    get(chrome.extension.getURL("src/mooc.js"), function(source: string) {
      Injected(
        document,
        "window.configData=" + cacheJsonText + ";\n" + source,
      );
    });
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
      return true;
    });
  }
}

async function init() {
  let component = new Map<string, any>()
    .set("config", new ChromeConfigItems(await NewBackendConfig()))
    .set("logger", new ConsoleLog());
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
