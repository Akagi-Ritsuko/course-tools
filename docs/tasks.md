# 任务清单（tasks.md）

> 状态取值：`todo` / `doing` / `done`。
> 当前清单范围：仅 zsgl 模块。
> 任务来源：`src/mooc/zsgl/TODO.md`（原始问题清单）与 `.trae/documents/zsgl-debug-handoff.md`（2026-09-20 调试交接）整理合并；整理后以本文件为第一入口。

| 编号 | 任务 | 状态 | 优先级 | 来源 | 关联文档 |
|---|---|---|---|---|---|
| T-001 | 考试答案获取与导出：分批累积（mergeQuestionBatch）、串行破解链、集齐自动导出、交卷兜底导出；待实机回归（35 题分 4 批场景） | doing | P1 | TODO#1 + handoff §2.1 | 03-详细设计 §9 |
| T-002 | 崩溃日志系统（LogRecorder）：~~恢复导出"下载失败仍删键"致日志丢失~~ **已修复并实机验证**（2026-09-21）：单飞合并导出（export_lock 互斥，全世界孤儿键单文件下载）+ 归档替代删键（zsgl_log_arch 400KB 滚动）；实机下载首次成功落地 Downloads | done | P1 | handoff §2.2 + §四P2 | 04-数据库设计 §3 |
| T-003 | 学习地图任务完成后返回流程端到端验证：学习地图 → 任务 → 任务页写 finished 信号并 window.close()（course.ts notifyStudyMapCourseComplete）→ 回学习地图（storage → reload）→ 自动下一任务 | doing | P0 | TODO#5 | 03-详细设计 §8 |
| T-004 | P1 核心排查：视频起播时 CPU 100% 整浏览器冻死。**已完成（2026-09-21，双诱因+半自动方案落地）**：①响应体改写→软解（已注释修复）②合成点击→renderer 风暴（video 改半自动规避，scorm 保留自动）；v3 实测播放/倍速/静音正常、主进程无风暴；已知残留=renderer 128~142% 软解（疑似 play 中写 playbackRate 触发，v4 待验证）；完整报告见 .trae/documents/zsgl-video-storm-root-cause-report.md | done | P0 | handoff §四P1 | 03-详细设计 §5/§10 |
| T-005 | P2 修复项实机回归：切窗弹窗与暂停死循环消失（应出现"已拦截 window.onblur 赋值"日志）；getIsWatermark 报错随 watermarkFrame prepend 移除而消失 | todo | P2 | handoff §四P2 | 03-详细设计 §1.3/§3.1 |
| T-006 | SCORM 子类型支持：`document` 文档任务（自动标记已读） | todo | P1 | TODO#2 | 03-详细设计 §4.2 |
| T-007 | SCORM 子类型支持：`audio` 音频任务（自动播放） | todo | P1 | TODO#2 | 03-详细设计 §4.2 |
| T-008 | SCORM 子类型支持：`URL` 链接任务（实现方案见 TODO#2.1：新建 url.ts，自动打开 + 标记完成 + auto_open_url 配置） | todo | P1 | TODO#2.1 | 03-详细设计 §4.2 |
| T-009 | knowledge 任务收尾：学习地图中的 knowledge 类型支持；iframe 加载判断优化（跨域处理） | todo | P1 | TODO#2 | 03-详细设计 §7/§8 |
| T-010 | 每日积分模式实机测试与验证（功能已实现）；顺带审查 dailyPoints.ts 是否存在高频循环（关联 T-004 排查怀疑方向③） | doing | P2 | TODO#3 + handoff §四P1 | 03-详细设计 §10 |
| T-011 | 学习地图选修部分支持：调研选修课程数据结构、确定判断逻辑、实现过滤/包含（study_elective_courses 配置设想见 TODO#4） | todo | P2 | TODO#4 | 03-详细设计 §8.2 |
| T-012 | 焦点变化/页面最小化视频暂停：验证 setupEventPrevention + setupVisibilitySpoof + setupVideoAutoResume 组合的实际效果；必要时 Object.defineProperty 重写 document.hidden | todo | P2 | TODO#6 | 03-详细设计 §1.3/§5.3 |
| T-013 | 考试错题记录按钮调研：getNewExamDetails，showErrorType=1，ishidenerrquestion=N | todo | P3 | TODO#7 | 05-API文档 A4/A5 |
| T-014 | 视频长时间转圈问题（0630 记录；与 T-004 播放点击限流、T-005 回归相关） | todo | P3 | TODO#8 | 03-详细设计 §5 |
| T-015 | 工程化：webpack 加 fork-ts-checker 或 CI 跑 `tsc --noEmit`（先清理/白名单 ~60 个基线错误）；`src/mooc/zsgl/log/` 反编译产物与日志样本 gitignore 或移出仓库 | todo | P3 | handoff §四P3 | — |
| T-016 | 三节课自动挂机（sanjieke-auto-study）：zsgl"混合"课程「立即学习」跳转 lzlj.b.sanjieke.cn 三方页面的自动挂机（xgplayer 起播/倍速/防暂停）+ 课后题自动答题（questions 接口自带 answer）+ 完成判定与学习地图串联闭环；里程碑 M1 文档已落地，M2~M6 待开发；2026-09-22 迭代 2（M7）完成代码：视频完成改 setContentFinished 平台信号确认制 + ended 未确认重播（3 次熔断）+ 课后题 completedFlag/「继续挑战」精确推进 + 课时切换改 interval 配置；同日修复 content/tree 解析字段不匹配（nodeId + attribute.isFinish，实机课程 34002056 定位）+ quiz 后台抗节流（Worker 心跳驱动定时器链），复测待做 | doing | P1 | .trae/specs/sanjieke-auto-study | .trae/specs/sanjieke-auto-study/spec.md |
| T-017 | 三方课程完成推送通知（去轮询，ADR-001）：三节课毕业 → A 路 opener 直推 + B 路扩展中转（start/background 双向桥接，openerTabId 优先）→ zsgl course.ts 幂等直达闭环；移除失效轮询（重放请求缺 courseId 请求体与 headerMap 签名，服务端报后台处理错误）；页面保活：setupPageKeepAlive Web Lock 持锁防后台冻结（三方课程课程页 + 学习地图页），08-用户指导 §五 补浏览器"保持活动"设置指引（双保险）；代码完成，build/tsc 通过，实机验证待做 | doing | P1 | .trae/specs/sanjieke-complete-push | docs/adr/ADR-001、docs/zsgl/cn/03 §3.5、docs/zsgl/cn/08 §五 |

## 备注

- 优先级综合 TODO.md"优先级排序"与 handoff §四（P0 < P1 < P2 < P3，数字越小越优先）。
- T-001/T-002/T-003 的"doing"表示代码已实现、待实机验证（handoff 标注）。
- 已在近期改动中关闭的事项不再列任务：切窗检测双保险（handoff §2.3，回归项归 T-005）、暂停风暴熔断与播放点击限流（handoff §2.4/§2.5）、水印触发源移除（handoff §2.6）。

## 文档体系建设（本 goal 内的协作文档任务）

| 编号 | 任务 | 状态 |
|---|---|---|
| T-901 | 初始化协作文档体系（ai-collab/changelog/tasks），整理任务清单并补录近期变更 | done |
| T-902 | 创建 docs/zsgl/README.md 文档索引与代码地图，更新 ai-collab 阅读顺序指向 | done |
| T-903 | docs/zsgl/cn/ 各文档与代码一致性核对修订（03/04/05/07） | done |
