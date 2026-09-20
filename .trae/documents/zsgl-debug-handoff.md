# zsgl 模块:视频崩溃排查 + 日志捕获系统 — 交接文档

> 更新时间:2026-09-20 晚。本文档供 AI/开发者接手后续排查工作,包含:已完成的修改全貌、关键背景知识、待完成项与验证方法。

## 一、背景:这轮工作要解决什么

用户报告 zsgl 平台(https://zsgl.lzlj.com,hash SPA + React)三个问题(优先级从高到低):

1. **[进行中] 视频起播时整个浏览器冻死(CPU 100%)**,只能任务管理器强杀;曾伴随"转圈、内存增大"
2. **[已修复] 任务有限制时切窗会弹窗并终止任务**;切窗/最小化后控制台死循环打印、无法继续播放
3. **[已完成] 崩溃后拿不到控制台日志** → 建了崩溃可恢复的日志捕获系统

另有一个前置修复:考试答案分批返回导致的导出不完整(已完成,见 §2.1)。

## 二、当前修改内容(按文件)

### 2.1 src/mooc/zsgl/exam.ts — 考试答案分批累积
- **问题**:`queryQuestionDetail.do` 每批返回 10 题;原实现每批**整体替换** `questionList`,且第一批破解完就导出(只含 10 题),`answerExported` 置位后交卷时的导出全部被跳过
- **修改**:
  - 新增 `allQuestionMap: Map<questionId, QuestionInfo>` 累积全量题目;`mergeQuestionBatch()` 按 questionId 去重(first-seen 优先,保护已破解答案),合并后重建 `questionList`
  - 批次破解经 `autoAnswerChain` Promise 链**串行**执行(防共享策略实例被并发 `init()` 清空);`startAutoAnswering` 重构为 `crackQuestions(batch)`,只破解"未内嵌答案且未破解过"的题(去重靠 `crackScheduledIds`)
  - 新增 `maybeExportAllAnswers()`:`allQuestionMap.size >= questionIdList.length`(题目集齐)且破解链跑完时自动导出一次
  - 交卷(确认弹窗 `isSubmit`)→ `examComplete → tryExportAnswers()` 兜底导出(幂等);删除了 `OperateCard` 里 `jobIndex === questionList.length-1` 的提前 examComplete
- **未改动**:`answer-exporter.ts`(导出 Markdown,`answer_export_enabled` 开关)、两个答题策略类

### 2.2 src/internal/utils/log.ts — 整文件重写:LogRecorder 崩溃日志系统
- **结构**:内存环形缓冲(2000 行)→ 每 5s 落地 localStorage → 崩溃(pagehide 未触发)后,下一个页面加载 3s 后自动下载 `工具日志_上次崩溃_*.log`(仅 zsgl 域名)
- **关键设计**:
  - 双世界分区:主世界 PageLog key=`zsgl_log_main`,内容脚本 ConsoleLog key=`zsgl_log_cs`(mooc.ts/start.ts 传入);iframe/background 传 null 不落地
  - **按标签页隔离**:缓冲键 `zsgl_log_<world>_<tabId>`(tabId 存 sessionStorage);心跳键 `_hb_<tabId>` 每次落地刷新;心跳 >30s(LOG_HEARTBEAT_STALE_MS)视为标签页已死才允许导出+清理——防止抢占存活标签页
  - pagehide → 写 `_last`(正常退出转存)并清空本标签页缓冲/心跳
  - `record()` 不受 `Application.debug` 门控(崩溃诊断需要 debug 级);`ConsoleLog.Debug` 打印仍门控,主世界 `PageLog.Debug` 无条件打印
  - 全局捕获 `window.onerror` + `unhandledrejection` → 经 `errorToText` 记录(**必须用 Error.stack,JSON.stringify(Error) 得 "{}"**——曾因此丢堆栈)
  - 每次落地追加内存采样行:`[mem HH:MM:SS] JS堆 used/total/limit @页面hash`(performance.memory,仅 Chrome)
  - 手动导出:控制台执行 `window.__toolLogExport()`
  - **配置开关 `log_persist_enabled`**(默认开):关闭时 record/flush/pagehide/recover 全部不写。⚠️ 读取必须用 `isPersistEnabled()` 里"**先命名空间键 `zsgl_log_persist_enabled` 再全局键**"的写法——弹窗配置页经 `SetNamespaceConfig("zsgl",...)` 保存,实际键带 `zsgl_` 前缀;曾经只读全局键导致"开关不生效"
- **踩过的坑(勿重蹈)**:重写时曾丢掉 PageLog 的 `getNowTime()`/`first()` 方法 → 运行时 TypeError 导致学习地图页初始化全挂(webpack transpileOnly 不查类型);`recordAll` 曾把字符串当 `any[]` 传。改完务必跑 `npx tsc --noEmit` 对比基线

### 2.3 切窗检测双保险(问题 2)
- **根因**:站点在 `queryCourseDetail.do` 返回 `isOpenSwitchScreen:1` 时,用 **`window.onblur/onfocus/onresize = fn` 属性赋值**装切窗检测(deobfuscated.js L1832-1874),超限(`maxTimes`)后直接终止学习任务。事件阻止(setupEventPrevention)和 document.hidden 伪装(setupVisibilitySpoof)都拦不住属性赋值
- **修复 A**:[course.ts] Init 里 `hookAndModifyHttpResponse(QUERY_COURSE_DETAIL, ...)` 把 `body.isOpenSwitchScreen/isOpenScreenShot` 改 0(幂等守卫 `switchScreenHooked`)
- **修复 B**:[src/mooc/zsgl/utils/utils.ts] `setupSwitchScreenNeutralizer()`:Object.defineProperty 把 window.onblur/onfocus/onresize 的 setter 置 no-op(模块级 once-guard)

### 2.4 暂停风暴熔断(video.ts / scorm.ts)
- pause 监听器:顶部 `if (this.playAborted) return;`;60s 窗口内 pause ≥8 次(`PAUSE_STORM_MAX_COUNT/WINDOW_MS`)→ `abortAutoResume()` 并提示导出日志——防止"站点 pause ↔ 我们 play"逐秒死循环(切窗修复后理论上不会再触发,留作其它原因兜底)

### 2.5 播放点击限流(video.ts / scorm.ts / constants.ts)
- 日志证实视频起播时 loadedmetadata/canplay/源轮询**三个事件源在 1 秒内各点一次播放按钮**,可能令 DRM 播放器反复启停(伴随内存 50→123MB 突刺)
- `clickPlayButton()` 加 `PLAY_CLICK_MIN_INTERVAL_MS: 2000` 限流(在 playAborted 复活判断之后)

### 2.6 站点水印报错触发源移除(course.ts)
- 主世界日志拿到完整堆栈:站点 `a.getIsWatermark`(chunk 3646)每次课程页加载抛 `removeChild` TypeError
- [course.ts] OperateCard 原来往 `#watermarkFrame || body` prepend 一个**空 div**(控制栏创建已被注释,纯属无用代码)——疑似打断站点水印组件的 DOM 操作,**已删除**

### 2.7 其它
- [src/config.ts] zsgl 分组新增配置项:考试答案导出(`answer_export_enabled`)、日志转存(`log_persist_enabled`)
- [src/mooc.ts / src/start.ts] 传入日志落地 key
- `constants.ts` 新增:PAUSE_STORM_MAX_COUNT=8、PAUSE_STORM_WINDOW_MS=60000、PLAY_CLICK_MIN_INTERVAL_MS=2000

## 三、构建与调试须知(接手必读)

1. **构建**:`npm run build` → 输出 `build/cxmooc-tools/src`(用户 Edge 加载的扩展目录)。`build/zsgl-tools` 是 2026-09-16 的旧拷贝,**已过期勿用**。每次 build 后必须在 Edge 扩展管理页**点"重新加载"**,否则跑旧代码(曾因此误判)
2. **类型检查**:webpack ts-loader 是 `transpileOnly: true`,类型错误只在运行时暴露。用 `npx tsc --noEmit` 检查,但存在 ~60 个**改动前基线错误**(chaoxing/course163/views 的 .vue 引用等),对比时只看新增。本次改动文件(log/exam/course/video/scorm/utils/constants/mooc/start/config)已清零(仅剩 exam.ts 内 `self: any` 回调的 implicit-any 既有风格)
3. **崩溃日志解读**:`src/mooc/zsgl/log/工具日志_上次崩溃_*.log`,分段格式 `===== zsgl_log_<world>_<tabId> =====`;文件末尾可能有无头部的 `_last` 内容(正常退出页面的最后缓冲)。**生产模式下 cs 世界只有 mem 行**(ConsoleLog.Debug 被门控),**行为日志全在 main 世界缓冲**;cs 与 main 的 tabId 不同(隔离世界不共享 sessionStorage)
4. **出现多个导出文件 ≠ 多次崩溃**:任务管理器强杀 Edge 时所有标签页 pagehide 都不触发,全部缓冲同时变孤儿,一次强杀导出 N 份
5. 站点关键事实:`queryQuestionDetail.do` 每批 10 题;`queryStatus.do` 1s 心跳;DRM m3u8 播放(video.js + hls);切窗检测已用属性赋值方式装在 window 上(已被我们拦截);`isOpenSwitchScreen` 等开关在 queryCourseDetail 响应体里
6. 站点自带 bug:每次课程页加载 `getIsWatermark` 抛 removeChild TypeError(已移除我们侧疑似触发源,待观察是否消失)

## 四、待完成项(按优先级)

### P1 — CPU 100% 整浏览器冻死(核心未解)
- **已知**:JS 堆稳定(48~78MB,视频起播瞬时 123MB 后 GC 回落)→ **非 JS 内存泄漏,是 CPU 型**;用户常开 3+ 个 zsgl 标签页(多 tabId 证据),访问过 homePage(每日积分页)/resource 页;冻结时整个浏览器无响应
- **怀疑方向**(未证实):① 站点 DRM 播放器 4x 解码本身;② 多标签叠加(keepAliveAudio 使后台标签页不受 Chrome 节流,全速解码+跑站点定时器);③ 每日积分自动化(dailyPoints.ts,用户自有代码,未审查);④ 站点其它脚本
- **下一步**:用户重载扩展 + 单标签复现;日志转存保持**开启**;冻结后取 main 世界缓冲,看冻结前最后 5 秒的行为(请求洪流/播放事件循环/未知异常)。若主世界缓冲异常小或缺"已启用"启动行,先查主世界记录器
- **可选缓解**:跨标签互斥(localStorage 锁,同一时刻只允许一个标签页活跃播放);审查 dailyPoints.ts 是否有高频循环

### P2 — 修复项实机回归
- 切窗弹窗/暂停死循环是否消失(切屏防御日志应出现"已拦截 window.onblur 赋值")
- `getIsWatermark` 报错是否随 watermarkFrame prepend 移除而消失
- 考试答案导出:35 题分 4 批 → 集齐后自动导出完整文件;交卷兜底可导
- 日志转存开关:关闭后**两个世界**都应零写入、零下载(刚修的命名空间键读取,未实测)

### P3 — 工程化
- webpack 加 fork-ts-checker(或 CI 跑 `tsc --noEmit`),先清理/白名单基线错误
- `src/mooc/zsgl/log/` 下的日志与站点反编译产物建议 gitignore 或移出仓库
- cs 世界生产模式下几乎无日志价值(仅 mem 行),可考虑让 cs ConsoleLog 的 Debug 也不过门控(已在 record 层实现,打印层无必要)
- exam.ts implicit-any 基线清理(低优先)

## 五、关键源文件索引
| 文件 | 内容 |
| --- | --- |
| src/internal/utils/log.ts | LogRecorder 全部逻辑(重写,~580 行) |
| src/mooc/zsgl/exam.ts | 考试分批累积 + 导出时机 |
| src/mooc/zsgl/course.ts | 切屏响应改写钩子 + 中立化调用 + OperateCard |
| src/mooc/zsgl/video.ts / scorm.ts | 播放恢复、暂停风暴、点击限流 |
| src/mooc/zsgl/utils/utils.ts | HTTP 钩子机制、setupVisibilitySpoof、setupSwitchScreenNeutralizer |
| src/mooc/zsgl/utils/exam-utils.ts | 考试 API 签名/请求 |
| src/config.ts | 配置项声明(弹窗 UI 数据源) |
| src/mooc/zsgl/log/*.log | 崩溃日志样本(工具日志_上次崩溃_*) |
| src/mooc/zsgl/log/deobfuscated.js | 站点反编译代码(切窗检测 L1832+、getIsWatermark、queryStatus) |
