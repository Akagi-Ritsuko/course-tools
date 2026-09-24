# MV3 迁移复测步骤文档

> 对应 spec：`migrate-manifest-v3`，覆盖 checklist.md 中 6 项"需真实站点环境验证"的检查点。
> 全部通过后回到 checklist.md 勾选对应项。

## 准备工作

1. 确认已执行 `npm run build`，产物为最新（`build/cxmooc-tools/src/background.js` 中可搜索到 `update-check`）
2. Chrome 地址栏输入 `chrome://extensions` → 打开右上角**开发者模式** → **加载已解压的扩展程序** → 选择 `build/cxmooc-tools` 目录
3. 在扩展卡片上记录**扩展 ID**（一串小写字母，`chrome://serviceworker-internals` 里靠它定位）
4. 准备两个日志观察窗口：
   - **SW 控制台**：`chrome://extensions` → 网课小工具卡片 → 点击"Service Worker"链接（注意：打开它本身会唤醒 SW）
   - **页面内容脚本控制台**：在目标页按 F12 → Console → 左上角上下文下拉框从 `top` 切换到 `start.js`（不切换的话 `chrome` 对象不存在，会报 `chrome is not defined`）

## 测试 1：扩展加载与 SW 状态

对应 checklist：`Chrome 加载已解压扩展无 manifest 报错，SW 状态正常`

| 步骤 | 预期 |
|---|---|
| 加载后观察扩展卡片 | 无红色"错误"按钮（有则点开记录内容） |
| 点击"Service Worker"链接 | 能正常打开 SW 的 DevTools 控制台，无报错 |
| 打开 `chrome://serviceworker-internals`，按扩展 ID 找条目 | 状态为 activated/running |

## 测试 2：mooc.js 注入（zsgl / sanjieke）

对应 checklist：`zsgl 页面注入正常`、`sanjieke 页面注入正常`

> **MV3 变更**：注入改走 chrome.scripting MAIN world 通道，**不再产生 `injected-js` 节点**，验证方式以本节为准。
> **重要**：每次在 chrome://extensions 里 ↻ 刷新扩展后，**所有已打开的目标页必须手动 F5**，否则旧标签页的内容脚本已失效（Console 上下文里也看不到 start.js）。

| 步骤 | 预期 |
|---|---|
| 扩展刷新后手动 F5 目标页，Console（top 上下文）执行 `typeof window.configData` | 返回 `"object"`（configData 已由 MAIN world 注入，证明注入链路通） |
| Elements 面板 Ctrl+F 搜 `tools-logger-panel` | 找到可拖拽工具栏节点 |
| Console 上下文下拉框 | 能看到 `start.js`（内容脚本已注入；看不到 = 标签页未刷新或站点权限被限制） |
| Console 观察 | 无 inline script CSP 拦截报错、无红色异常 |
| zsgl 课程页开启自动挂机 | 视频正常推进/倍速/静音，日志输出功能信息 |
| 打开 sanjieke 页面重复上面检查 | 同上 |

> 若 `typeof window.configData` 为 `"undefined"` 且无 start.js 上下文：检查 chrome://extensions → 网课小工具 → 详情 → **网站访问权限**是否为"在所有网站上"（或至少包含当前站点）。

## 测试 3：无媒体任务端到端（resourceType=153）

对应 checklist：`无媒体任务关页不依赖 SW setTimeout`、`学习地图页刷新推进下一任务`

前置：学习地图中存在无媒体（图文）任务，开启自动挂机。

| 步骤 | 预期 |
|---|---|
| 挂机推进到 153 任务 | 学习地图日志：`[无媒体任务] resourceType=153,交由扩展后台打开任务页...` |
| 观察新标签页（非激活状态打开） | URL 形如 `.../knowledge-cloud/?cxPlainTaskClose=10000#/knowledgePage/{id}`（参数在 `#` 之前） |
| 任务页 Console（start.js 上下文） | `[无媒体任务] 检测到自动关页参数,停留 10000ms 后请求后台关闭` |
| 等待约 10 秒 | 任务页自动关闭，学习地图页刷新进入下一任务 |
| **关键加固点**：任务页开着时，去 `chrome://serviceworker-internals` 手动 Stop SW，然后等关页时刻 | 关页**仍然发生**（计时在任务页侧，不依赖 SW 存活；关页消息会唤醒 SW） |

## 测试 4：毕业通知中转 + SW 冷启动复测

对应 checklist：`sanjieke 毕业通知 ack 重试`、`SW 冷启动场景`

### 4a. 常规链路（SW 活着）

1. 标签页 A：zsgl 课程页；标签页 B：sanjieke 页面（建议从 A 页 `window.open` 打开以覆盖 opener 分支）
2. 两页 Console 均切到 `start.js` 上下文
3. 在 **B 页**执行：

```js
chrome.runtime.sendMessage(
  { type: "sanjieke_course_complete", courseId: "manual-test" },
  (resp) => console.log("ack:", resp)
);
```

4. 预期：
   - B 页打印 `ack: {success: true}`
   - A 页出现 `[每日积分] start: 收到消息 {type: 'sanjieke_course_complete', ...}`
   - A 页若三方流程已启动：`[三方课程] 收到三节课毕业通知,直接走课程完成闭环`；未启动则 `三方流程未启动,忽略`——**两者都算链路打通**
   - SW 控制台：`[三方课程] 收到三节课毕业通知,中转至 opener 标签页 N`（或"无 opener,广播 zsgl 标签页"）

### 4b. 冷启动复测（核心）

1. 打开 `chrome://serviceworker-internals`，按扩展 ID 找到条目，点 **Stop**
2. **不要碰 `chrome://extensions` 页面**（打开扩展卡片/其 DevTools 会把 SW 唤醒，白测）
3. 切回 B 页，立即再执行一次 4a 的 `sendMessage`
4. 预期：
   - `ack` 仍返回 `{success: true}`（冷启动慢几百毫秒属正常；首次无响应时 start.ts 的 `sendRelayWithAck` 会以 400ms 间隔自动重试最多 2 次）
   - A 页再次收到消息
   - `chrome://serviceworker-internals` 条目状态从 stopped 变回 running——证明消息唤醒了 SW

### 4c. 真实流程端到端（可选，最终验收）

让 zsgl 自动挂机跑到三节课课程快完成时掐点 Stop SW，等毕业通知自然发出，确认 A 页闭环执行。

## 测试 5：右键菜单唯一性

对应 checklist：`contextMenus 带 id 创建 + onClicked 监听，SW 重启后菜单不重复`

| 步骤 | 预期 |
|---|---|
| 任意网页选中一段文字，右键 | 菜单出现"使用 网课小工具 搜索题目"，**仅一项** |
| 去 serviceworker-internals Stop SW → 再触发任意消息唤醒 → 再次右键 | 菜单仍只有一项（没有重复堆积） |
| 点击菜单项 | 新标签页打开 `cx.icodef.com/query.html?q=<选中文字>` |

## 测试 6：每日积分 popup 链路

对应 checklist：`每日积分 popup 链路正常`

| 步骤 | 预期 |
|---|---|
| 点击扩展图标打开 popup | 界面正常渲染，无控制台报错（popup 上右键→检查） |
| 配置每日积分参数并启动 | 当前标签页跳转/刷新到目标 zsgl 页面 |
| 页面 Console（start.js 上下文） | 收到 `START_DAILY_POINTS` 转发日志，页面积分面板开始运行 |

## 常见坑

- **Console 上下文没切到 start.js**：`chrome is not defined`——先切上下文再执行命令
- **Stop 后又打开了 SW 的 DevTools**：DevTools 本身会唤醒 SW，等于没停
- **用普通网页测 sendMessage**：必须在与扩展匹配的 zsgl/sanjieke 页面上、且上下文为 start.js
- **zsgl/sanjieke 需登录态**：部分链路（学习地图、三节课任务）依赖企业账号登录

## 结果记录

| 测试项 | 通过 | 备注 |
|---|---|---|
| 1 扩展加载与 SW 状态 | ☐ | |
| 2 zsgl 注入 | ☐ | |
| 2 sanjieke 注入 + 挂机 | ☐ | |
| 3 无媒体任务闭环（含 Stop SW 加固点） | ☐ | |
| 4a 毕业通知常规链路 | ☐ | |
| 4b 冷启动复测 | ☐ | |
| 5 右键菜单唯一 | ☐ | |
| 6 每日积分 popup | ☐ | |
