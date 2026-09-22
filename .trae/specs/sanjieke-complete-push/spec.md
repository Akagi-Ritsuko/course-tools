# 三节课毕业完成推送通知（A+B 混合，去服务端轮询）Spec

## Why
三方课程流程中，zsgl 课程页目前靠每 30s 轮询 `queryCourseDetail` 判断三节课是否完成；且该轮询用 `sendApiRequest("GET", courseDetailRequestUrl)` 重放请求——缺少 `courseId` 请求体与 `headerMap` 签名头（正常请求为 POST + form body + headerMap sign），服务端返回"后台处理错误"，校验实际不可用。三节课页自身最清楚毕业时机（`courseComplete()`），应改为事件推送，不再做服务端校验。

## What Changes
- 三节课 `courseComplete()` 毕业时、关页前发出完成通知（双路冗余）：
  - **A 路**：`window.opener?.postMessage(...)` 直推打开它的 zsgl 课程页（精准、零中间层）
  - **B 路**：mooc.js（页面）→ start.js（内容脚本）→ background → zsgl start.js → zsgl mooc.js 扩展消息链中转（覆盖 opener 缺失：noopener / 手动打开场景）
- zsgl course.ts 增加页面消息监听，收到推送**直接**走现有 `courseTaskCompleteFc()` 闭环（写 `zsgl_task_{courseId}` finished + 关页），**不做服务端二次校验**
- **移除三方课程轮询**：`thirdPartyPoll` 定时器、`pollThirdPartyCourseStatus` 方法、`courseDetailRequestUrl` 捕获、`THIRD_PARTY_POLL_INTERVAL_MS` 常量、course.ts 的 `sendApiRequest` 导入
- 关页时序调整：毕业通知发出后延迟（500ms）再 `window.close()`，防止页面销毁早于消息发出
- 消息类型常量单一来源：`src/internal/utils/message.ts` 导出 `SANJIEKE_COURSE_COMPLETE_TYPE`，四处（sanjieke study / zsgl course / start / background）统一引用
- 页面保活：`navigator.locks` 持共享锁使 zsgl 课程页（三方流程）与学习地图页进入浏览器内存节省程序的冻结豁免名单（锁随页面生命周期自动释放）；用户指导文档补充浏览器"保持活动"设置指引作为用户级可选双保险
- 文档留痕（docs/ai-collab.md 约定）：changelog.md、docs/tasks.md（T-017）、docs/zsgl/cn/03-详细设计.md（05/08 按需）、08-用户指导.md 新增设置指引章节、新增 docs/adr/ADR-001

## Impact
- Affected specs: sanjieke-auto-study（毕业闭环机制语义更新：轮询收口 → 推送收口）
- Affected code:
  - `src/mooc/sanjieke/study.ts`（courseComplete 推送 + 延迟关页）
  - `src/mooc/zsgl/course.ts`（移除轮询 + 消息监听 + 幂等闭环 + 三方流程保活）
  - `src/mooc/zsgl/studyMap.ts`（Init 保活）
  - `src/mooc/zsgl/utils/utils.ts`（setupPageKeepAlive 工具函数）
  - `src/mooc/zsgl/constants.ts`（删 THIRD_PARTY_POLL_INTERVAL_MS，增保活锁名常量）
  - `src/internal/utils/message.ts`（新增消息类型常量）
  - `src/start.ts`（双向桥接 case）
  - `src/background.ts`（runtime → tabs 消息中转）
  - `docs/zsgl/cn/08-用户指导.md`（浏览器"保持活动"设置指引）

## ADDED Requirements

### Requirement: 三节课毕业推送（sanjieke/study.ts）
三节课 `courseComplete()` SHALL 在关页前发出完成通知：A 路 opener 直推 + B 路扩展桥接，消息体含 `type = "sanjieke_course_complete"` 与 `courseId`。

#### Scenario: A 路 opener 直推
- **WHEN** 三节课毕业且 `window.opener` 存在且未关闭
- **THEN** 向 opener postMessage `{type, courseId}`
- **AND** opener 失效/异常仅告警，不阻断 B 路

#### Scenario: B 路扩展中转
- **WHEN** 三节课毕业
- **THEN** mooc.js 经 `Application.App.Client.Send`（cxmooc-tools 桥）发给本页 start.js
- **AND** start.js `chrome.runtime.sendMessage` 通知 background
- **AND** background 优先转发给 `sender.tab.openerTabId` 对应标签页；无 openerTabId 时广播到 `zsgl.lzlj.com` 所有标签页（转发失败吞 lastError）
- **AND** 目标页 start.js 收到后 `window.postMessage` 转入页面上下文

#### Scenario: 关页时序
- **WHEN** 毕业通知已发出
- **THEN** 延迟 500ms 后 `window.close()`；再 1s 后仍存活则告警"请手动关闭"

### Requirement: zsgl 推送接收闭环（zsgl/course.ts）
zsgl 课程页 SHALL 监听页面 `message` 事件中的 `sanjieke_course_complete`，在三方流程已启动的前提下直接触发 `courseTaskCompleteFc()`。

#### Scenario: 收到推送（A/B 双路去重）
- **GIVEN** `thirdPartyFlowStarted === true`（课程详情已加载、三方流程已启动）
- **WHEN** 收到 `sanjieke_course_complete`（A 路与 B 路可能先后到达）
- **THEN** 以 `sanjiekeCompleteHandled` 幂等去重，仅首次触发 `courseTaskCompleteFc()`
- **AND** 全程不发起任何主动 `queryCourseDetail` 请求

#### Scenario: 流程未启动时收到推送
- **WHEN** 收到推送但三方流程未启动（如手动打开三节课页、广播误达）
- **THEN** 忽略并告警，不改变页面状态

### Requirement: 页面保活（Web Lock）
zsgl 课程页（三方流程）与学习地图页 SHALL 在启动时通过 Web Locks API 持有共享锁（`mode: "shared"`，同名共存），使页面进入 Chrome/Edge 内存节省程序的冻结豁免名单；锁随页面关闭/导航自动释放，无需显式管理。`navigator.locks` 不存在（旧环境/非安全上下文）时静默跳过。

#### Scenario: 三方流程课程页保活
- **WHEN** zsgl 课程页进入三方流程（`startThirdPartyFlow`）
- **THEN** 请求保活锁，页面后台挂机期间不被浏览器冻结，毕业推送可即时送达

#### Scenario: 学习地图页保活
- **WHEN** 学习地图页初始化（`ZsglStudyMap.Init`）
- **THEN** 请求保活锁，等待任务完成通知期间不被冻结

#### Scenario: 环境不支持 Web Locks
- **WHEN** `navigator.locks` 为 undefined
- **THEN** 静默跳过并 Debug 日志记录，不阻断主流程（冻结风险退化为"解冻后闭环延迟"，不丢失）

## MODIFIED Requirements

### Requirement: 三方课程自动化流程（course.ts startThirdPartyFlow）
**原逻辑**：自动点「立即学习」+ 每 30s 轮询 `queryCourseDetail` 判断完成。
**新逻辑**：仅自动点「立即学习」打开三节课页；完成判定由三节课毕业推送驱动（A/B 双路），推送即闭环。

## REMOVED Requirements

### Requirement: 三方课程完成状态轮询
**Reason**: 轮询重放请求缺少 `courseId` 请求体与 `headerMap` 签名头，服务端返回"后台处理错误"，校验失效；推送机制下不再需要主动校验。
**Migration**: 删除 `pollThirdPartyCourseStatus`、`thirdPartyPoll` 定时器、`courseDetailRequestUrl` 字段及捕获、`THIRD_PARTY_POLL_INTERVAL_MS` 常量、course.ts 的 `sendApiRequest` 导入；被动 hook 的 `allCompleted` 判定（站点自身请求 course detail 时）保留不动。

## 非目标（明确排除）
- 不复刻/修复轮询请求（不捕获请求体、不实现 headerMap 签名）
- 不做三节课 ↔ zsgl 的 courseId 映射（两套 ID 空间独立，闭环用 zsgl 本页 `currentCourseId`）
- 不改动被动 hook `allCompleted` 闭环与 `zsgl_close_course_*` 关闭通道
- 三节课页与普通课程页不加保活锁（视频播放即豁免冻结，ended 间隙为分钟级，到不了冻结门槛）
- 浏览器"保持活动"站点名单是用户级手动设置（Edge/Chrome 各有入口），扩展无 API 代改，仅在用户指导文档中提供指引，作为 Web Lock 之外的双保险
