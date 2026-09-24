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

# 补充任务（首次加载实测暴露）
- [x] Task 6: 修复 SW 环境不兼容的全局引用（实测加载报 `Service worker registration failed. Status code: 15` + `Uncaught ReferenceError: window is not defined`）
  - [x] SubTask 6.1: [views/common.ts](../../src/views/common.ts) 顶层 `window.addEventListener("load")` 加 `typeof window` 守卫（该模块经 background→log.ts 打包链路被副作用引入，顶层引用 window 导致 SW 求值失败）
  - [x] SubTask 6.2: [config.ts](../../src/internal/utils/config.ts) `ChromeConfigItems` 构造函数 `this.localCache = localStorage` 加守卫（SW 中无 localStorage，后台 init 会抛错）
  - [x] SubTask 6.3: 重建并通过 SW 全局环境求值冒烟测试（Node 模拟无 window/localStorage/document，`SW-EVAL OK`）
- [x] Task 7: 修复 zsgl-tools 分发目录产物陈旧问题（用户加载 zsgl-tools 报 5 个错误：MV3 manifest 指向旧 MV2 产物）
  - [x] SubTask 7.1: webpack.config.js 改为多编译器数组，同源输出到 build/cxmooc-tools 与 build/zsgl-tools
  - [x] SubTask 7.2: webpack.dev.js 适配数组配置（map + merge）
  - [x] SubTask 7.3: 双目录产物 SW-EVAL 冒烟测试通过，zsgl-tools 产物确认无 chrome.extension/browserAction 残留
- [x] Task 8: 补充 manifest `alarms` 权限（实测报 `Cannot read properties of undefined (reading 'onAlarm')`——MV3 中 `chrome.alarms` API 需显式声明权限）
  - [x] SubTask 8.1: 两份 manifest permissions 增加 `"alarms"`，spec ADDED-1 同步更新
- [x] Task 9: 修复弹窗空白与页面注入被 CSP 拦截（实测两问题）
  - [x] SubTask 9.1: 弹窗空白——popup.ts 运行时 `template:` 字符串依赖 Vue 运行时编译器（eval，MV3 扩展页 CSP 禁止），迁移为 SFC `PopupApp.vue`（vue-loader 构建期预编译），popup.ts 瘦身为仅挂载
  - [x] SubTask 9.2: 页面注入被页面 CSP 拦截（mooc.js innerHTML 内联注入失效 → 工具栏/自动化消失）——新增 `MOOC_INJECT_REQUEST` 消息，background 以 `chrome.scripting.executeScript` MAIN world 先注 configData（func+args）再注 mooc.js（files）；start.ts 失败时回退旧内联注入兼容旧内核
  - [x] SubTask 9.3: 两份 manifest 增加 `"scripting"` 权限；双目录重建 + SW-EVAL 冒烟通过；全 src 无运行时 `template:` 残留
- [x] Task 10: 修复工具栏不显示（MAIN world 注入晚于页面 load 事件导致面板监听器永不触发）
  - [x] SubTask 10.1: [log.ts](../../src/internal/utils/log.ts) PageLog 面板构建改 readyState 判断：loading 时挂 load 监听，否则直接构建
  - [x] SubTask 10.2: [dailyPointsPanel.ts](../../src/internal/utils/dailyPointsPanel.ts) 同款竞态修复
  - [x] SubTask 10.3: 双目录重建 + SW-EVAL 冒烟通过，mooc.js 产物含 readyState 守卫
  - [x] SubTask 10.4: 修复面板构建早于 Application 赋值的次生错误（`Cannot read properties of undefined (reading 'config')`）——PageLog 与 DailyPointsFloatingPanel 的面板启动均延迟一拍（setTimeout 0），此时 mooc.ts 同步块已完成 App 赋值
- [x] Task 11: 消除配置写入竞态报错（`Cannot set properties of undefined (setting 'sanjieke_video_multiple')`，功能无影响但为未处理拒绝噪声）
  - [x] SubTask 11.1: backendConfig 的 cxconfig 监听器加 cache 未就绪守卫（该写入点为全库唯一无守卫 `[key]=` 写法，updateCache 完成前到达的 cxconfig 消息会命中；忽略是安全的，因发送端已同步写 storage）
  - [x] SubTask 11.2: backendConfig.SetConfig 的 tabs.sendMessage/runtime.sendMessage 补 lastError 回调，消除 MV3 无回调 sendMessage 的未处理 Promise 拒绝噪声
