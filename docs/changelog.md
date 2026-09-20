# 变更日志（changelog.md）

> 格式：`日期 | 变更内容 | 涉及文件 | 关联任务/文档`
> 当前记录范围：仅 zsgl 模块相关变更。标注"补录"的条目为按 `.trae/documents/zsgl-debug-handoff.md` 回填的历史变更。

| 日期 | 变更内容 | 涉及文件 | 关联 |
|---|---|---|---|
| 2026-09-20 | 初始化协作文档体系（ai-collab.md / changelog.md / tasks.md 骨架） | docs/ai-collab.md、docs/changelog.md、docs/tasks.md | — |
| 2026-09-20 | 整理 T-001~T-015 任务清单（合并 TODO.md 问题清单与 handoff 待完成项） | docs/tasks.md | T-001~T-015 |
| 2026-09-20 | 补录：考试答案分批累积与导出时机重构（allQuestionMap 去重合并、autoAnswerChain 串行破解、集齐自动导出、交卷兜底导出，移除提前 examComplete） | src/mooc/zsgl/exam.ts | T-001（补录） |
| 2026-09-20 | 补录：log.ts 整文件重写为 LogRecorder 崩溃日志系统（环形缓冲 2000 行、5s 落地、按标签页隔离、心跳 30s 判死、pagehide 转存 `_last`、崩溃后自动导出） | src/internal/utils/log.ts | T-002（补录） |
| 2026-09-20 | 补录：切窗检测双保险——hookAndModifyHttpResponse 改写 isOpenSwitchScreen/isOpenScreenShot 为 0 + setupSwitchScreenNeutralizer 中和 window.onblur/onfocus/onresize 属性赋值 | src/mooc/zsgl/course.ts、src/mooc/zsgl/utils/utils.ts | T-005（补录） |
| 2026-09-20 | 补录：暂停风暴熔断（60s 窗口 ≥8 次 pause → abortAutoResume）与播放点击限流（PLAY_CLICK_MIN_INTERVAL_MS=2000） | src/mooc/zsgl/video.ts、src/mooc/zsgl/scorm.ts、src/mooc/zsgl/constants.ts | T-004/T-014（补录） |
| 2026-09-20 | 补录：移除 OperateCard 向 #watermarkFrame/body prepend 空 div 的代码（疑似站点水印组件报错触发源） | src/mooc/zsgl/course.ts | T-005（补录） |
| 2026-09-20 | 补录：新增配置项"考试答案导出（answer_export_enabled）""日志转存（log_persist_enabled）"，均默认开启 | src/config.ts | T-001/T-002（补录） |
| 2026-09-20 | 补录：mooc.ts / start.ts 传入日志落地 key（主世界 PageLog / 内容脚本 ConsoleLog 分区） | src/mooc.ts、src/start.ts | T-002（补录） |
| 2026-09-20 | 创建 docs/zsgl/README.md：01~07 文档导航、src/mooc/zsgl/ 全量代码地图、关键开发须知（摘自 handoff §三）；ai-collab 阅读顺序指向同步更新 | docs/zsgl/README.md、docs/ai-collab.md | T-902 |
