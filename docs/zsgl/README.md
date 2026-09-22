# zsgl 模块文档索引

> 本目录是 zsgl 平台（zsgl.lzlj.com）适配模块的文档入口。模块代码位于 [src/mooc/zsgl/](../../src/mooc/zsgl/)。
> 协作纪律见 [docs/ai-collab.md](../ai-collab.md)；当前任务与进度见 [docs/tasks.md](../tasks.md)。

## 一、文档导航（docs/zsgl/cn/）

| 文档 | 定位 |
|---|---|
| [01-需求规格](cn/01-需求规格.md) | 功能需求清单（FR 编号）、业务规则、非功能需求与验收要点 |
| [02-概要设计](cn/02-概要设计.md) | 总体架构（宿主内核 + 平台适配层）、模块划分、核心流程时序图、依赖关系与设计决策 |
| [03-详细设计](cn/03-详细设计.md) | 各文件逐模块算法与行号定位：基础设施/路由/课程/任务/视频/SCORM/知识点/学习地图/考试/每日积分/考试 API 签名 |
| [04-数据库设计](cn/04-数据库设计.md) | 存储介质分层：chrome.storage 配置键表、localStorage 跨页信号键清单与状态机、内存运行时结构 |
| [05-API文档](cn/05-API文档.md) | A. 平台 HTTP 接口（拦截/主动请求/签名规范）；B. 扩展内部接口（Chrome 消息/postMessage/localStorage 契约/任务生命周期） |
| [06-测试计划](cn/06-测试计划.md) | 单元测试用例、边界与竞态测试、E2E 手工场景、进入/退出标准 |
| [07-部署手册与用户手册](cn/07-部署手册与用户手册.md) | 环境要求、源码构建、浏览器安装、配置项说明、升级回滚；用户侧快速上手与功能指南 |
| [08-用户指导](cn/08-用户指导.md) | 面向最终用户的精简指导：快速上手、配置速查、常见问题（媒体自动播放、切标签页暂停等） |

## 二、代码地图（src/mooc/zsgl/，职责与 02-概要设计 §1.2 / 03-详细设计 对应）

### 顶层模块

| 文件 | 职责 |
|---|---|
| [platform.ts](../../src/mooc/zsgl/platform.ts) | hash 路由识别页面（courseDetail/studyDetail/examDetail），返回对应 Mooc 实例；`SetNamespace("zsgl")` 必须最先执行 |
| [factory.ts](../../src/mooc/zsgl/factory.ts) | TaskFactory：按 cwType 创建课程任务（video/scorm→ZsglAudio/knowledge，其余暂不支持）；考试题目任务 |
| [task.ts](../../src/mooc/zsgl/task.ts) | ZsglTask 抽象基类与 ZsglTaskControlBar 控制栏 UI；hasLearned 判定 done |
| [course.ts](../../src/mooc/zsgl/course.ts) | 课程详情页任务集：拦截 queryCourseDetail、切屏开关改写钩子（isOpenSwitchScreen→0）、任务队列调度、完成上报、关页监听 |
| [video.ts](../../src/mooc/zsgl/video.ts) | 课程页视频任务：自动播放/倍速/静音/暂停恢复/保活/暂停风暴熔断/播放点击限流 |
| [scorm.ts](../../src/mooc/zsgl/scorm.ts) | SCORM 课件任务（类名 ZsglAudio）：跨 iframe 深度查找视频（deepFindVideo）并播放，xgplayer 播放键 |
| [knowledge.ts](../../src/mooc/zsgl/knowledge.ts) | 知识点任务：点击任务卡 →"立即学习"→ 等待 iframe → 按 playTime-learnedDuration 计时退出 |
| [studyMap.ts](../../src/mooc/zsgl/studyMap.ts) | 学习地图：关卡拦截与选择、任务跳转、localStorage 跨页握手、自动下一关 |
| [exam.ts](../../src/mooc/zsgl/exam.ts) | 考试模块：AES 解密、题目分批累积（allQuestionMap/mergeQuestionBatch）、串行破解链（crackQuestions）、答案提示与导出时机（maybeExportAllAnswers/交卷兜底） |
| [exam-answer-strategy.ts](../../src/mooc/zsgl/exam-answer-strategy.ts) | 单选题批量排除法策略（SingleChoiceAnswerStrategy，≤4 轮） |
| [exam-answer-strategy-test.ts](../../src/mooc/zsgl/exam-answer-strategy-test.ts) | 单选策略本地验证脚本（非运行时代码） |
| [dailyPoints.ts](../../src/mooc/zsgl/dailyPoints.ts) | 每日积分模式：互动→贡献→学习三类积分任务调度、积分校准、跨页课程完成等待 |
| [constants.ts](../../src/mooc/zsgl/constants.ts) | 常量集中：选择器、URL、AES 配置、存储前缀、时序参数（含 PAUSE_STORM_*、PLAY_CLICK_MIN_INTERVAL_MS） |
| [types.ts](../../src/mooc/zsgl/types.ts) | 领域类型定义（TaskInfo、QuestionInfo 等） |
| [decrypt-clean.ts](../../src/mooc/zsgl/decrypt-clean.ts) | 独立 AES 解密调试小工具（清理密文空白字符），非运行时依赖 |
| [TODO.md](../../src/mooc/zsgl/TODO.md) | 问题清单原始记录（已整理至 docs/tasks.md，不再更新） |

### utils/ 子目录

| 文件 | 职责 |
|---|---|
| [utils/utils.ts](../../src/mooc/zsgl/utils/utils.ts) | 通用工具：XHR Hook（hookHttpRequest/hookAndModifyHttpResponse/removeHttpRequestHook）、TimerManager、DOM 查找、事件阻止（setupEventPrevention/setupVideoEventPrevention）、切屏中立化（setupSwitchScreenNeutralizer）、可见性伪装（setupVisibilitySpoof）、createStorageHandler、sendApiRequest |
| [utils/exam-utils.ts](../../src/mooc/zsgl/utils/exam-utils.ts) | 考试 API 请求封装与签名：getSid、generateHeaderMap（md5 sign）、sendExamApiRequest 及 query/submit 封装 |
| [utils/exam-answer-strategy.ts](../../src/mooc/zsgl/utils/exam-answer-strategy.ts) | 多选题两阶段破解策略（MultipleChoiceAnswerStrategy：逐选项测试→组合验证） |
| [utils/exam-answer-strategy-test.ts](../../src/mooc/zsgl/utils/exam-answer-strategy-test.ts) | 多选策略本地验证脚本（非运行时代码） |
| [utils/exam-utils-test.ts](../../src/mooc/zsgl/utils/exam-utils-test.ts) | 考试 API 封装本地验证脚本（非运行时代码） |
| [utils/answer-exporter.ts](../../src/mooc/zsgl/utils/answer-exporter.ts) | 考试答案导出为 Markdown 文件（受 `answer_export_enabled` 配置开关控制） |
| [utils/1.json](../../src/mooc/zsgl/utils/1.json) | 本地测试数据 |

### log/ 子目录（非运行时代码）

站点 JS 反编译产物（deobfuscated.js、*.chunk.js）、请求/响应样本（queryQuestionAnswer.md、questionDetail.json）与崩溃日志样本（工具日志_上次崩溃_*.log）。仅作排查参考，建议移出仓库（见 tasks.md T-015）。

## 三、关键开发须知（摘自 [.trae/documents/zsgl-debug-handoff.md](../../.trae/documents/zsgl-debug-handoff.md) §三，接手必读）

1. **构建**：`npm run build` → 输出 `build/cxmooc-tools/src`（Edge 加载的扩展目录）。`build/zsgl-tools` 是 2026-09-16 的旧拷贝，**已过期勿用**。每次 build 后必须在 Edge 扩展管理页**点"重新加载"**，否则跑旧代码（曾因此误判）。
2. **类型检查**：webpack ts-loader 为 `transpileOnly: true`，类型错误只在运行时暴露。用 `npx tsc --noEmit` 检查，但存在 **~60 个改动前基线错误**（chaoxing/course163/views 的 .vue 引用等），对比时只看新增。
3. **崩溃日志解读**：`src/mooc/zsgl/log/工具日志_上次崩溃_*.log`，分段格式 `===== zsgl_log_<world>_<tabId> =====`。生产模式下 cs（内容脚本）世界只有 mem 行（Debug 被门控），**行为日志全在 main（主世界）缓冲**；cs 与 main 的 tabId 不同（隔离世界不共享 sessionStorage）。
4. **多个导出文件 ≠ 多次崩溃**：任务管理器强杀浏览器时所有标签页 pagehide 都不触发，全部缓冲同时变孤儿，一次强杀导出 N 份。
5. **手动导出日志**：控制台执行 `window.__toolLogExport()`；日志转存受 `log_persist_enabled` 配置控制（读取时先命名空间键 `zsgl_log_persist_enabled` 再全局键）。

## 四、当前待办速览

见 [docs/tasks.md](../tasks.md)（T-001~T-015）。核心未解：T-004 视频起播 CPU 100% 冻死排查；待回归：T-001 考试分批导出、T-002 日志系统、T-003 学习地图返回流程、T-005 切窗/水印修复。
