# Tasks

- [x] Task 0: 新建迁移分支 `feature/mv3-migration`（基于当前 HEAD），后续所有改动在新分支提交
- [x] Task 1: 升级依赖与 manifest 改造
  - [x] SubTask 1.1: `package.json` 中 `@types/chrome` 升级到近期版本（需含 `chrome.action`/`chrome.alarms`/`chrome.contextMenus.onClicked` 类型），安装后确认 `npm run build` 不因类型报错失败（ts-loader 为 transpileOnly）
  - [x] SubTask 1.2: 改造 `build/cxmooc-tools/manifest.json` 为 MV3 规范（spec ADDED-1 全部字段）
  - [x] SubTask 1.3: 同步改造 `build/zsgl-tools/manifest.json`（与 1.2 保持一致）
- [x] Task 2: background.ts SW 兼容重构
  - [x] SubTask 2.1: 三个 `chrome.runtime.onMessage` 监听器（毕业通知中转 / 无媒体任务开页 / 移除后的顶层注册）提升到 SW 入口顶层同步注册，处理器内部惰性 await 配置与 logger
  - [x] SubTask 2.2: 删除热更新远程代码注入：`update()` 简化为"CheckUpdate → 有新版本则 badge 'new'"，删除 `dealScript`/`dealSymbol`/`this.source`/`this.lastHotVersion`/`sourceUrl` 热更分支
  - [x] SubTask 2.3: 删除 `injectedScript()` 死代码路径及其专属变量（`cache`/`cacheJsonText`/`regex` 等）
  - [x] SubTask 2.4: 每小时 `setInterval` 改 `chrome.alarms`（onInstalled 创建 period 60min alarm，顶层监听 alarms.onAlarm 触发版本检查）
  - [x] SubTask 2.5: 右键菜单迁移：`contextMenus.create` 带 id + `onClicked.addListener`，防 SW 重启重复创建（回调报"_duplicate id_"时忽略或先 removeAll）
  - [x] SubTask 2.6: API 更名：`chrome.extension.getURL`→`chrome.runtime.getURL`、`chrome.browserAction.*`→`chrome.action.*`
  - [x] SubTask 2.7: `ZSGL_PLAIN_TASK_VISIT_TYPE` 处理器简化：仅 `chrome.tabs.create` + `sendResponse({tabId})`，移除 `setTimeout` 关页逻辑；新增顶层消息类型 `ZSGL_PLAIN_TASK_CLOSE_SELF`（`chrome.tabs.remove(sender.tab.id)`）
- [x] Task 3: start.ts 内容脚本改造
  - [x] SubTask 3.1: `chrome.extension.getURL`→`chrome.runtime.getURL`
  - [x] SubTask 3.2: 新增无媒体任务页侧关页逻辑：检测 `location.search` 中 `cxPlainTaskClose` 参数，`setTimeout(delayMs)` 后 `chrome.runtime.sendMessage({type: ZSGL_PLAIN_TASK_CLOSE_SELF})`；幂等防重（hashchange 重复 init 不重复注册）
  - [x] SubTask 3.3: 毕业通知发送（`SANJIEKE_COURSE_COMPLETE_TYPE` 分支）改为等待 ack：`chrome.runtime.sendMessage` 回调校验响应，失败/超时重试最多 2 次
- [x] Task 4: 页面侧配合修改
  - [x] SubTask 4.1: [studyMap.ts](../../src/mooc/zsgl/studyMap.ts) `openPlainTask()` 构造 URL 时在 hash 前附加 `?cxPlainTaskClose=<PLAIN_COURSE_CLOSE_DELAY_MS>`
  - [x] SubTask 4.2: [sanjieke/study.ts](../../src/mooc/sanjieke/study.ts) `COMPLETE_NOTIFY_CLOSE_DELAY_MS` 500→1500，注释同步更新
- [ ] Task 5: 构建与功能验证
  - [x] SubTask 5.1: `npm run build` 通过，产物无编译错误（webpack compiled successfully；产物 start.js 含 cxPlainTaskClose/zsgl_plain_task_close_self，background.js 含自关处理器与 update-check alarm）
  - [ ] SubTask 5.2: Chrome 加载 `build/cxmooc-tools/`，对照 checklist.md 手动验证 zsgl/sanjieke 核心链路（注入、挂机、无媒体任务闭环、毕业通知中转含 SW 冷启动场景）——依赖真实站点登录环境，待用户执行

# Task Dependencies
- Task 0 是一切任务的前置
- Task 1 与 Task 2/3/4 的代码改造可并行推进，但 Task 2.5/2.6 依赖 1.1 的类型升级
- Task 5 依赖 Task 1-4 全部完成
