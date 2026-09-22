# Checklist

## 代码实现
- [x] `src/internal/utils/message.ts` 导出 `SANJIEKE_COURSE_COMPLETE_TYPE`，sanjieke/study.ts、zsgl/course.ts、start.ts、background.ts 四处均引用该常量（grep 确认无散落字符串字面量；sanjieke/constants.ts 的 `COURSE_COMPLETE: "sanjieke_course_complete_"` 为 localStorage 键前缀，语义不同属正常）
- [x] sanjieke `courseComplete()`：先 A 路（opener 直推）+ B 路（桥接 Send）发通知，再延迟 500ms `window.close()`，1s 后告警兜底；原 localStorage 毕业标记 / clearLessonDoneMarks / timerManager.clearAll 行为不变
- [x] sanjieke 两路通知均有 try/catch，单路失败不阻断另一路与关页
- [x] start.ts：页面→runtime（Accept case）与 runtime→页面（onMessage case）双向转发均实现；桥接消息（带 tag/source）与转发消息（纯 type）不会互相回环
- [x] background.ts：openerTabId 优先精准转发，缺失时按 `zsgl.lzlj.com` 广播；lastError 均被吞掉；不影响既有 injectedScript 的 onMessage 监听
- [x] zsgl course.ts：消息监听已注册；幂等（A/B 双路只触发一次闭环）；`thirdPartyFlowStarted` 未启动时忽略并告警；收到推送后 `courseTaskCompleteFc()` 直达闭环，全程无主动 `queryCourseDetail` 请求
- [x] 轮询彻底移除：`pollThirdPartyCourseStatus` / `thirdPartyPoll` / `courseDetailRequestUrl`（含 hook 内捕获块）/ `THIRD_PARTY_POLL_INTERVAL_MS` / course.ts `sendApiRequest` 导入，全仓库无残留引用
- [x] 被动 hook `allCompleted`（courseFileArr 全 hasLearned=1）判定与 `zsgl_close_course_*` 关闭通道未被改动

## 页面保活（追加需求）
- [x] `zsgl/constants.ts` 新增 `KEEPALIVE_LOCK_NAME: 'zsgl_keepalive'`
- [x] `setupPageKeepAlive()`（zsgl/utils/utils.ts）：`navigator.locks` shared 模式持锁、永不 resolve、页面销毁自动释放；`navigator.locks` 不可用时 Debug 日志静默跳过；try/catch + request().catch() 双兜底
- [x] 接入点：`startThirdPartyFlow()`（course.ts）与 `ZsglStudyMap.Init()`（studyMap.ts）；三节课页/普通课程页不加锁（视频豁免，spec 非目标）

## 验证
- [x] `npm run build` 成功（webpack 5.105.4 compiled successfully）
- [x] `npx tsc --noEmit` 无基线外新增错误（输出全为 course163/exam/popup/sanjieke-task 等既有基线错误，本次改动 4 文件零错误）
- [x] grep 确认 `SANJIEKE_COURSE_COMPLETE_TYPE` 引用一致（1 定义 + 4 消费文件）、`setupPageKeepAlive`（1 定义 + 2 接入点）、`KEEPALIVE_LOCK_NAME`（1 定义 + 1 使用）

## 文档留痕（ai-collab 约定）
- [x] `docs/changelog.md` 已追加两条变更行（去轮询改推送 + 保活与设置指引）
- [x] `docs/tasks.md` 已新增 T-017 并标注状态 doing（代码完成、实机验证待做），含保活与设置指引描述
- [x] `docs/zsgl/cn/03-详细设计.md` §3.5 已修订（推送 + 保活机制），§12 补 KEEPALIVE_LOCK_NAME，文档自身"变更日志"小节已留痕（1.26.922.2）
- [x] `docs/zsgl/cn/08-用户指导.md` 新增 §五「浏览器标签页保持活动设置（推荐）」（Edge/Chrome 路径、双保险定位），文档自身"变更日志"小节已留痕
- [x] `docs/adr/ADR-001-sanjieke-complete-push.md` 已创建，status: accepted，含备选方案与拒绝理由
