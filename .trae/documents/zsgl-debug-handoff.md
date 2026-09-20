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
> **2026-09-21 复现记录(AI 实机排查,单标签,解压缩扩展重载后)**:
> - **复现 3/3 次**:打开/刷新 `#/home/courseDetail/N008085` 后 **~70 秒内**整机冻死(视频自动播放开始后);强杀重启刷新**立即再崩**(与用户"首次打开会崩"吻合)。多标签并非必要条件。
> - **崩溃前日志已提取**(自动下载被 Edge"多个自动下载"限制拦截,改从 Edge LocalStorage LevelDB 旁路提取,见本地 `.trae/log-extract/log_1~12.txt`,tabId=mua1vrv35q06lm):
>   - 0:48:24 页面加载 → 工具初始化/拦截/切屏中立化全部正常 → 0:48:26 视频任务启动(**multiple:1、mute:true**;`waitForVideoSourceAndPlay` 在 **readyState=0 仅 blob src 挂上**时即判定 hasSource 并点击播放)→ "[视频事件] Video playing"
>   - **0:48:27 起扩展完全静默**:无暂停风暴、无播放点击循环、无请求洪流、无 error;mem 采样 52.2→54.0MB 稳定(至 0:49:34 最后一次落地)
>   - 时序:浏览器 UI 进程先失响应(UIA ~0:48:49 已超时),渲染进程主世界 JS 存活至 0:49:34 —— **排除扩展 JS 死循环与 JS 内存泄漏,指向 GPU/DRM 解码与合成进程 hang**
> - **嫌疑排序**:① DRM(m3u8/EME)解码+GPU 合成(冷启动 GPU 进程状态差异或 MSE/EME 初始化被抢跑点击扰动,可解释"重启后同视频正常");② readyState=0 抢跑点击的时序诱因(修复成本低,建议先改:readyState≥1 才 clickPlayButton);③ 站点自身脚本(无证据)
> - **修复回归(2026-09-21 01:06,tabId=mua2iml0f0oqxk,日志 .trae/log-extract/fix_1~8.txt)**:已实施 readyState≥1 门控(video.ts/scorm.ts 的 waitForVideoSourceAndPlay + hasVideoSource),日志确认不再抢跑(播放尝试 readyState:0/hasSource:false)。**回归未通过**:本次崩溃提前到加载后 ~5s——readyState 始终 0、视频从未真正解码播放,站点 play 事件已触发,hls 刚请求第一个分片(1764857593165_s_0.ts)即死。两次会话共同点收窄至 **DRM 流初始化链路(getPlaylist→getPlayParams→分片拉取/EME)**,崩溃窗口有波动(68s→5s)。注:本次会话加载时恢复导出尝试了旧键下载(被 Edge 拦),为额外变量,暂无法排除其影响。
> - **修复回归 2(2026-09-21 01:13~01:18,含 T-002 导出修复)**:log.ts 恢复导出改为**单飞合并**(export_lock 15s 互斥,扫描全部世界孤儿键,单文件下载)+**归档替代删键**(zsgl_log_arch,400KB 滚动)。结果:**崩溃日志首次成功落地 Downloads**(工具日志_上次崩溃_2026-09-21-01-13-47.log,合并 main+cs,中文正常,已存 .trae/log-extract/)——"下载被拦+删键丢日志"缺陷闭环。
> - **CPU 采样结论(后台 3s 采样,.trae/log-extract/cpu-sample.csv)**:冻结期高 CPU 在 **browser 主进程(23412,~180-192%)与伴生无 --type 进程(5680,~200%)**,GPU 进程仅 ~25%,**渲染进程全程安静**;风暴自 ≥01:13:47(早于采样启动)持续至 01:17:10(≥3.5min)后**自行缓解**(5680 退出,主进程回落 ~7%,浏览器恢复响应并完成日志下载)。
> - **根因改写(重要)**:非 GPU/DRM 解码、非渲染进程 JS——**browser 主进程(浏览器 UI/调度进程)CPU 风暴**。与渲染侧日志静默+堆稳定完全吻合:主进程忙→IPC/UI 线程饿死→用户体感"整机冻死";风暴不恢复时=用户强杀场景;"重启后同视频正常"=风暴窗口已过。DRM 起播时序可能只是巧合诱因。
> - **下一步**:①主进程风暴定位需 IPC 追踪(风暴期 Edge 内置任务管理器 Shift+Esc 看哪个子进程最忙/ETW tracing);②排除篡改猴共存注入变量(本轮未禁用);③排查主进程消息风暴源(storage.onChanged 广播/通知服务/postMessage);④跨标签互斥暂缓(与根因无关)
> - **隔离实验与线程级结论(2026-09-21 01:22~01:44,采样 csv B/A 两份)**:
>   - **实验 B(--disable-extensions,仅站点,视频正常播放 4min)**:133 行采样**无任何进程 >40%** → 站点/DRM 单独运行干净
>   - **实验 A(仅启用解压缩扩展,篡改猴已禁用)**:风暴复现(01:33:20 起)——⚠️ 勘误:采样脚本正则漏匹配新版 `--type=renderer`(无 -process 后缀),此前"双 browser"实为**主进程(~180%)+课程页渲染进程(~200-212%)**
>   - **杀 renderer 实验**:风暴中 taskkill 仅杀课程页 renderer(46720)→ 主进程仍 103% 一段时间后缓解 → renderer 非唯一燃烧点,主进程有独立负载(疑为处理 renderer IPC 洪流的连带)
>   - **风暴会话日志(tabId=mua3hfm504kg52,.trae/log-extract/storm_*.txt)**:cs 世界 mem 行 **1:33:19→1:35:49 每 5s 不断**(JS 事件循环全程存活),行为日志完全静默 → **renderer 的 ~200% 不是 JS 执行**,指向媒体/合成/IPC 等非 JS 线程
>   - **根因画像(当前)**:工具的起播操作(点击任务卡→视频容器/DRM 重建→currentTime 重置/倍速/静音切换)诱发课程页 renderer **非 JS 线程异常**+主进程连带;无扩展时同一页面播放无此现象;风暴可自行缓解(数分钟)也可致死锁(用户强杀场景)
>   - **下一步(收窄后)**:①chrome://tracing(渲染进程 media/compositor/viz 类目)抓风暴期线程;②缓解实验:起播动作最小化(不重置 currentTime/不设倍速静音/不模拟点击,靠站点自动续播)逐项开关对比;③确认 CDM/Widevine 进程形态
> - **附带发现(重要)**:
>   1. **恢复导出缺陷**:两个世界同时 downloadTextFile 触发 Edge"多个自动下载"拦截,**下载失败仍无条件删除 localStorage 键**(recoverOrphanedBuffer 尾部 removeItem)→ 前两次会话崩溃日志已永久丢失。建议:合并为单文件导出/错峰导出/延迟删除(归 T-002)
>   2. **站点反调试 debugger-checker**:页面脚本(3646 chunk)内嵌 `debugger;`,**DevTools 打开期间页面 JS 被暂停**;关闭 DevTools 瞬间页面被导航到 `about:blank?a=1&b={"isOpen":true,"checkerName":"debugger-checker"}`。**zsgl 页面调试一律不可开 DevTools**,崩溃取证只依赖 LogRecorder(控制台 `__toolLogExport()` 也不可用)
>   3. 下载被拦时的替代取证:强杀 Edge 后从 `%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Local Storage\leveldb\*.log` 以 **ASCII/UTF-8** 搜 `zsgl_log_`(键为 ASCII,值为 UTF-16LE)提取
- **已知**:JS 堆稳定(48~78MB,视频起播瞬时 123MB 后 GC 回落)→ **非 JS 内存泄漏,是 CPU 型**;用户常开 3+ 个 zsgl 标签页(多 tabId 证据),访问过 homePage(每日积分页)/resource 页;冻结时整个浏览器无响应。**9-21 复现:单标签即崩,多标签非必要条件**
- **怀疑方向**(9-21 更新):① 站点 DRM 播放器/GPU 解码合成(**日志支持,首选**);② readyState=0 抢跑点击扰动 MSE/EME 初始化(待 A 修复验证);③ 多标签叠加(已排除必要性);④ 每日积分自动化(dailyPoints.ts,静默期无活动,基本排除);⑤ 站点其它脚本
- **下一步**:① `waitForVideoSourceAndPlay` 改 readyState≥1 再点播放 → 回归;② 冻结前**提前打开**任务管理器置顶,冻结时抓 GPU 进程 vs 渲染进程 CPU 份额(本次任务管理器也被拖死,拿不到份额);③ 对比开关"硬件加速"复现;④ 可选缓解:跨标签互斥(localStorage 锁)

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
