# Manifest V3 迁移 Spec

## Why
Chrome 商店已停止接受 MV2 扩展并逐步禁用运行，迁移 MV3 不可避免。当前代码有三处与 MV3 不兼容/不可靠：`chrome.extension`/`browserAction`/`tabs.executeScript({code})` 等 API 被移除；background 将由常驻页面变为可随时休眠的 Service Worker（SW），两条后台中转链路（zsgl 无媒体任务开页关页、sanjieke 毕业通知）会失效或丢消息；热更新远程代码注入被 MV3 政策与技术双重禁止。需在保留 zsgl/sanjieke 全部功能的前提下完成迁移。

## What Changes
- 新建迁移分支 `feature/mv3-migration`，迁移工作全部在新分支进行（不影响当前工作区）
- 两份 manifest（`build/cxmooc-tools/`、`build/zsgl-tools/`）升级为 MV3 规范（见 ADDED-1）
- [background.ts](../../src/background.ts) 重构为 SW 兼容形态：监听器顶层同步注册、API 更名、`setInterval`→`chrome.alarms`、移除热更新与死代码
- [start.ts](../../src/start.ts) 注入链路 API 替换；新增无媒体任务页侧自动关页；sanjieke 毕业通知 ack 重试加固
- [studyMap.ts](../../src/mooc/zsgl/studyMap.ts) 构造任务页 URL 时携带关页延迟参数
- [sanjieke/study.ts](../../src/mooc/sanjieke/study.ts) 关页延迟 500ms→1500ms
- **BREAKING** 移除热更新远程代码注入（MV3 禁止 remote hosted code，且 `chrome.scripting` 无法注入字符串代码），降级为"检测到新版本→badge 提示"

## Impact
- Affected specs: 无既有 spec 覆盖扩展宿主层；间接相关 `sanjieke-complete-push`（B 路中转链路的加固）
- Affected code:
  - `build/cxmooc-tools/manifest.json`、`build/zsgl-tools/manifest.json`
  - `src/background.ts`（重构核心）
  - `src/start.ts`（API 替换 + 任务页关页 + ack 重试）
  - `src/mooc/zsgl/studyMap.ts`（openPlainTask URL 加参数）
  - `src/mooc/sanjieke/study.ts`（关页延迟常量）
  - `package.json`（升级 `@types/chrome`，当前 0.0.103 缺 `chrome.action`/`chrome.scripting` 类型）
- 不受影响：zsgl/sanjieke 所有主世界自动化逻辑（挂机、答题、导出、积分、日志），页面同源 fetch，`innerHTML` 注入方式（保留，内核兼容性最好，不引入 `world: "MAIN"`）

## ADDED Requirements

### Requirement: MV3 manifest 规范
两份 manifest SHALL 按 MV3 规范声明：
- `manifest_version: 3`
- `background: { service_worker: "src/background.js" }`（classic，不声明 module）
- `action` 替代 `browser_action`（字段内容不变）
- `permissions`: `storage`、`contextMenus`、`notifications`、`tabs`（新增，保证 `chrome.tabs.query({url})` 匹配不依赖 host 授权状态）
- `host_permissions`: `*://zsgl.lzlj.com/*`、`*://lzlj.b.sanjieke.cn/*`、`https://cx.icodef.com/*`（更新检查 fetch 需要跨域授权）
- `web_accessible_resources` 改为对象数组：`[{ resources: ["src/mooc.js"], matches: ["*://zsgl.lzlj.com/*", "*://lzlj.b.sanjieke.cn/*"] }]`（与 MV2 暴露范围等价）
- 移除 `content_security_policy` 字段（MV3 默认值 `script-src 'self'; object-src 'self'` 即所需，禁止 unsafe-eval）
- `match_about_blank: true` 改为 `match_origin_as_fallback: true`

#### Scenario: manifest 合法加载
- **WHEN** 在 Chrome 中以"加载已解压的扩展程序"载入 `build/cxmooc-tools/`
- **THEN** 扩展正常加载，无 manifest 报错，Service Worker 显示为活动状态

### Requirement: SW 生命周期兼容
background SHALL 满足：
- 所有 `chrome.runtime.onMessage` 监听器在 SW 入口**顶层同步注册**，异步初始化（config、logger）移入处理器内部惰性执行，消除冷启动丢消息窗口
- 每小时版本检查改用 `chrome.alarms`（period 60 分钟，`onInstalled` 时创建）
- 右键菜单改用 `chrome.contextMenus.onClicked.addListener`，并防止 SW 重启后重复 `create`（以 id 判重或 `onInstalled` 中创建）

#### Scenario: SW 冷启动消息不丢
- **WHEN** 在 `chrome://serviceworker-internals` 手动停止 SW 后，sanjieke 页立即发出毕业通知
- **THEN** SW 被唤醒，通知成功中转到 zsgl 课程页，闭环正常执行

#### Scenario: 右键菜单唯一
- **WHEN** SW 多次休眠/唤醒后检查右键菜单
- **THEN** "使用 网课小工具 搜索题目"仅出现一次

### Requirement: 无媒体任务页侧自动关页
resourceType=153 任务页的 10 秒自动关闭 SHALL 从 SW `setTimeout` 迁移到任务页侧执行：
- studyMap 构造任务页 URL 时在 hash 前附加查询参数（如 `?cxPlainTaskClose=<delayMs>`）
- 任务页的 start.ts 内容脚本检测该参数，计时 `delayMs` 后向 background 发送"关闭自身"消息（携带 sender.tab.id 由后台执行 `chrome.tabs.remove`）
- background 的 `ZSGL_PLAIN_TASK_VISIT_TYPE` 处理器简化为仅 `chrome.tabs.create` 并回传 tabId，不再持有定时器

#### Scenario: 任务页自动关闭
- **WHEN** 学习地图推进到无媒体任务，后台打开任务页并停留 10 秒
- **THEN** 任务页在约 10 秒后自动关闭（即使期间 SW 已休眠，关页消息本身会唤醒 SW），学习地图页刷新进入下一任务

### Requirement: 版本检查降级
版本检查 SHALL 仅保留：检测到新版本时通过 `chrome.action.setBadgeText` 显示 "new" 徽标，每小时由 alarm 触发。

#### Scenario: 新版本提示
- **WHEN** 更新接口返回比当前更高的扩展版本
- **THEN** 扩展图标显示红色 "new" 徽标，不再有任何远程代码拉取/注入行为

## MODIFIED Requirements

### Requirement: 主世界脚本注入链路
`src/mooc.js` 注入 SHALL 继续由内容脚本读取扩展资源后以 `innerHTML` 方式注入主世界（保留现有方式），仅将 `chrome.extension.getURL` 替换为 `chrome.runtime.getURL`（[start.ts L28](../../src/start.ts#L28) 等 5 处）。

#### Scenario: zsgl/sanjieke 注入正常
- **WHEN** 打开 zsgl 或 sanjieke 任意匹配页面
- **THEN** mooc.js 正常注入主世界（页面出现 injected-js 节点、功能日志输出），无 `chrome.extension is not defined` 报错

### Requirement: sanjieke 毕业通知 B 路加固
B 路中转（内容脚本→background→zsgl 课程页）SHALL 加固：
- sanjieke 页关页延迟 `COMPLETE_NOTIFY_CLOSE_DELAY_MS` 由 500ms 提至 1500ms
- start.ts 发送毕业通知后等待 background 的 `sendResponse({success:true})` ack，失败或超时则在窗口内重试（最多 2 次）

#### Scenario: ack 重试兜底
- **WHEN** 首次 sendMessage 因 SW 冷启动未及时获得 ack
- **THEN** start.ts 在 1.5 秒窗口内自动重试，最终 zsgl 课程页收到通知（A/B 两路幂等去重，不重复闭环）

## REMOVED Requirements

### Requirement: 热更新远程代码注入
**Reason**: MV3 政策禁止 remote hosted code（商店审核拒绝），技术上 `chrome.tabs.executeScript({code})` 被移除、`chrome.scripting` 仅支持 files/func，无法注入远程字符串代码。
**Migration**: 删除 [background.ts](../../src/background.ts) 中 `update()` 的远程 JS 拉取、`dealScript`/`dealSymbol`、`this.source`/`lastHotVersion` 内存缓存；`CheckUpdate` 仅用于 badge 提示。发版修复能力由扩展版本更新承担。

### Requirement: injectedScript 死代码路径
**Reason**: [background.ts L196-237](../../src/background.ts#L196-L237) 的 `injectedScript()` 监听 `{status:"loading"}` 消息，但全仓搜索无任何发送方（遗留于旧版 cxmooc 全平台构建），且依赖被移除的 `tabs.executeScript({code})`。
**Migration**: 整体删除；`cacheJsonText` 等仅为该路径服务的变量一并清理（start.ts 已独立从自身 config 构建注入内容）。

## 风险备注
- `GM_xmlhttpRequest` 后台跨域代理的作用域收窄为 `host_permissions` 三域；zsgl/sanjieke 模块当前无调用方（均为页面同源请求），如后续其他平台启用需补 host 权限
- MV3 要求 Chromium 88+；保留 `innerHTML` 注入方式以获得最佳旧内核兼容性，不使用 `world: "MAIN"`（需 111+）
- 页面侧 `<script>` innerHTML 注入受目标页面 CSP 约束，此约束在 MV2 下同样存在，非本次迁移新增风险
