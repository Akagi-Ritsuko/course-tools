# ADR-001: 三方课程完成判定采用事件推送而非服务端轮询

- **状态**: accepted（2026-09-22 用户确认）
- **日期**: 2026-09-22
- **关联**: T-017、spec `.trae/specs/sanjieke-complete-push`、docs/zsgl/cn/03-详细设计 §3.5

## 背景（Context）

三方/混合课程（`courseFileArr` 含 `cwType === "URL"` 任务）的课程内容由三节课页（lzlj.b.sanjieke.cn）承载，与 zsgl（zsgl.lzlj.com）**不同源**，localStorage 不互通。zsgl 课程页需要感知"三节课已毕业"以走完成闭环（写 `zsgl_task_{courseId}` finished → 关页 → 学习地图刷新推进下一关）。

原实现为 zsgl 侧每 30s 主动重放 `queryCourseDetail` 轮询服务端 `hasLearned` 状态。实际运行中该请求返回"后台处理错误"：重放只复用了 URL（GET、无请求体），而正常请求为 POST + form body（`courseId=...`）+ `headerMap` 签名头；复刻签名需逆向站点算法并捕获原始请求体，成本高且维持 30s 级请求压力。

## 决策（Decision）

三节课页自身最清楚毕业时机（`SanjiekeStudy.courseComplete()`），改为**事件推送、双路冗余、免服务端校验**：

1. **A 路 opener 直推**：`window.opener.postMessage` 直达打开它的 zsgl 标签页（精准、零中间层）；站点 noopener/手动打开时自然失效。
2. **B 路扩展中转**：页面脚本 → start.js（内容脚本）→ background → 目标页 start.js → 页面脚本，经 `chrome.runtime/tabs` 消息；background 优先 `sender.tab.openerTabId` 精准回传，缺失时广播 zsgl 标签页。

zsgl 侧以 `sanjiekeCompleteHandled` 幂等去重（双路仅首次生效），`thirdPartyFlowStarted` 守卫防误达，收到即走既有 `courseTaskComplete` 闭环。三节课侧通知先行、延迟 500ms 关页（`COMPLETE_NOTIFY_CLOSE_DELAY_MS`）。消息类型常量 `SANJIEKE_COURSE_COMPLETE_TYPE` 以 `src/internal/utils/message.ts` 为单一来源。

## 备选方案（Rejected）

| 方案 | 拒绝理由 |
|------|----------|
| 修复轮询（复刻 headerMap 签名 + 捕获请求体重放） | 需逆向站点签名算法并扩展 HTTP 钩子捕获请求体，复杂且维持周期性请求压力 |
| 仅 B 路中转 | openerTabId 缺失时只能广播，无法精准关联"哪一个 zsgl 课程页"；A 路天然具备 opener 精准关联 |
| 仅 A 路直推 | noopener/手动打开场景 opener 为 null，通知丢失且无兜底 |
| 保留轮询作为第三兜底 | 轮询请求当前服务端报错不可用；A+B 双路已覆盖全部打开方式，冗余轮询只引入请求压力 |

## 影响（Consequences）

- **正面**：无周期性 API 请求；A/B 双路覆盖全部打开方式；闭环时延从最差 30s 降至毫秒级；各跳均有日志可观测（background 中转日志采用 Warn 级，规避 `ConsoleLog.Info` 在 production 的 debug 门控）。
- **取舍**：推送语义为"信任三节课客户端自述"，不再以 zsgl 服务端 `hasLearned` 为准。若三节课本地毕业而 zsgl 服务端同步滞后，学习地图下一关仍以服务端数据为准，风险可控。
- **保留**：被动 hook 的 `allCompleted` 判定（站点自身请求 course detail 时全部已学即闭环）与 `zsgl_close_course_*` 关闭通道未改动。
