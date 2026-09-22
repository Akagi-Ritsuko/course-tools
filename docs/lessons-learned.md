# 经验沉淀文档（zsgl / sanjieke）

> 目的：汇总 zsgl 与 sanjieke 两个模块开发/调试过程中**实际遇到过的问题**，按「问题现象 → 定位过程 → 根因 → 解决 → 经验教训」沉淀，供后续接手者避免重蹈覆辙。
> 来源：git 提交记录、`.trae/documents/` 排查报告（zsgl-debug-handoff、zsgl-video-storm-root-cause-report 等）、[changelog.md](changelog.md)、[tasks.md](tasks.md)、`src/mooc/zsgl/TODO.md`、`.trae/specs/`。
> 整理日期：2026-09-22。后续新增问题请在对应章节追加，并按 [ai-collab.md](ai-collab.md) 留痕。

## 目录

- [一、zsgl 平台问题](#一zsgl-平台问题)
  - [1.1 视频起播/切换时浏览器整机冻死（CPU 100%）](#11-视频起播切换时浏览器整机冻死cpu-100t-004)
  - [1.2 切窗弹窗、任务终止与暂停死循环](#12-切窗弹窗任务终止与暂停死循环t-005相关)
  - [1.3 崩溃后拿不到日志（LogRecorder 体系建设）](#13-崩溃后拿不到日志logrecorder-体系建设t-002)
  - [1.4 考试答案导出不完整](#14-考试答案导出不完整t-001)
  - [1.5 视频起播抢跑与起播死锁](#15-视频起播抢跑与起播死锁)
  - [1.6 站点水印组件报错](#16-站点水印组件报错)
  - [1.7 三方课程完成感知：轮询失效](#17-三方课程完成感知轮询失效adr-001)
  - [1.8 页面后台被浏览器冻结导致完成信号延迟](#18-页面后台被浏览器冻结导致完成信号延迟)
  - [1.9 学习地图任务完成后不返回](#19-学习地图任务完成后不返回t-003)
  - [1.10 其它已修复的历史问题速查](#110-其它已修复的历史问题速查)
- [二、sanjieke 平台问题](#二sanjieke-平台问题)
- [三、工程与调试通用经验](#三工程与调试通用经验)
- [四、问题→代码→文档 索引](#四问题代码文档-索引)

---

## 一、zsgl 平台问题

### 1.1 视频起播/切换时浏览器整机冻死（CPU 100%）【T-004】

**问题现象**
zsgl 课程页视频起播或切换视频时，整个浏览器冻死（CPU 100%），只能任务管理器强杀；强杀重启后同一视频可正常播放，切下一个视频问题复现。9-21 实机复现：**单标签**打开/刷新课程页 ~70s 内必现，多标签并非必要条件。

**定位过程（方法论最宝贵的一次排查）**
1. **先建观测**：崩溃后拿不到现场是最大障碍 → 先建 LogRecorder 日志系统（见 1.3），拿到崩溃前日志。
2. **旁路取证**：自动导出被 Edge"多个自动下载"拦截 → 从 `%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Local Storage\leveldb\` 直接提取（键 ASCII/UTF-8，值 UTF-16LE，需双编码搜索）。
3. **排除法**：风暴期间 JS 事件循环全程存活且空闲（mem 采样每 5s 不断、堆稳定 52~54MB）→ 排除扩展 JS 死循环与内存泄漏。
4. **进程级采样**：后台 PowerShell 每 3s 采样 `Get-Process`/`Win32_Process`，只记录 >5% 进程 → 高 CPU 在课程页渲染进程（~200%）+ 主进程连带（~180%）。
5. **杀进程实验**：风暴中仅 kill 课程页 renderer → 主进程余波后缓解 → 证明 renderer 是主要燃烧点。
6. **单变量 A/B 隔离阶梯**（关键）：
   - 实验 B（`--disable-extensions`，站点单独播放 4min）→ 干净 → 站点无辜；
   - E0（扩展注入但不起播）→ 干净 → 注入层无辜；
   - M1（auto=true，Start 只合成点击任务卡，零播放器干预）→ **风暴**；
   - M1b/M1c（扩展开 vs 无扩展 + **用户真实点击**）→ 扩展开=软解（renderer 100~137%/GPU ~10%），无扩展=硬解（renderer 8~26%/GPU 40~52%）→ **合成点击假设排除，真实点击同样触发**；
   - M1d（注释响应体改写 + 真实点击）→ 干净 → **改写=软解诱因实锤**；
   - FINAL（不改写 + 完整挂机含合成点击）→ 风暴 → **合成点击是第二独立诱因**。

**根因（两个相互独立的诱因，任一存在即触发）**
1. **响应体改写 → DRM 播放器软解**：[course.ts](file:///d:/learning_code/course-tools/src/mooc/zsgl/course.ts) 的 `hookAndModifyHttpResponse(QUERY_COURSE_DETAIL,...)` 把 `isOpenSwitchScreen/isOpenScreenShot` 改写为 0（原切窗防御手段），改写后的响应使站点播放器初始化走了**软件解码**路径（烧一个核，GPU 闲置）。
2. **合成点击任务卡 → renderer 非 JS 线程风暴**：[video.ts](file:///d:/learning_code/course-tools/src/mooc/zsgl/video.ts) Start 中的 `taskDiv.click()`（isTrusted=false）使站点打开播放器/重建 DRM 容器时，渲染进程**非 JS 线程**进入 ~200% 风暴（JS 线程全程空闲），与播放器干预动作（倍速/静音/currentTime）无关，真实鼠标点击不触发。

**解决**
- 诱因①：响应体改写注释（M1d 开关），切窗防御由 `setupSwitchScreenNeutralizer()`（window.onblur/onfocus/onresize setter 置 no-op）单独兜底。
- 诱因②：video 类型任务改**半自动模式**——移除合成点击与全部播放器干预（initPlayer/muted/currentTime/auto-resume/keepAlive/事件拦截），改为 play 事件应用用户配置的静音/倍速、ratechange 对抗平台重置、ended 完成检测，提示用户手动点击任务卡。scorm 任务保留自动点击。
- 附带：起播门控 readyState≥1、起播死锁兜底（见 1.5）。

**经验教训**
- **对第三方页面的"无害"改写可能有级联副作用**：改响应 JSON 会改变站点播放器的配置分支（软解/硬解协商），防御性改写需 A/B 实测解码路径。
- **合成点击 ≠ 真实点击**：`element.click()` 的 isTrusted=false 可能触发站点与真实点击完全不同的代码分支（此处直接引发媒体管线风暴），自动化点击前先做两者对照实验。
- **CPU 型问题与 JS 无关时，日志会"看起来正常"**：必须下探到进程/线程级采样。注意采样正则陷阱：新版 Chromium 命令行为 `--type=renderer`（无 `-process` 后缀），曾致渲染进程被误标为 browser、"双 browser"假象。
- **排查顺序模板**：先建观测 → 复现固定（单变量环境）→ 进程级采样定位燃烧进程 → A/B 隔离阶梯逐项剥离 → 真实/合成点击对照 → 旁路取证。
- 残留疑点：v3 半自动下 renderer 仍 128~142% 软解，疑似 play 事件写 `playbackRate` 即触发软解回退（"倍速与硬解疑似不可兼得"），v4 待验证。

### 1.2 切窗弹窗、任务终止与暂停死循环【T-005 相关】

**问题现象**
- 任务有时长限制时，切窗/最小化会弹窗并**终止学习任务**；
- 切窗后控制台**死循环打印**（每秒 `Video paused → 点击播放 → Video playing → queryStatus`），无法继续播放。

**定位过程**
- 拿到站点反编译代码 [deobfuscated.js](file:///d:/learning_code/course-tools/src/mooc/zsgl/log/deobfuscated.js)：站点在 `queryCourseDetail.do` 返回 `isOpenSwitchScreen:1` 时，用 **`window.onblur/onfocus/onresize = fn` 属性赋值**安装切窗检测（L1832-1874），超限后终止任务。
- 现有防御为何失效：`setupEventPrevention` 只能阻止 addEventListener、`setupVisibilitySpoof` 只伪装 document.hidden/hasFocus——**都拦不住 onXXX 属性赋值**。
- 死循环机理：站点每秒轮询 `queryStatus.do` 并反复 pause，我们的自动恢复反复 play，形成 1s 死循环；且每次 play 成功会 `resetPlayRetry()`，`MAX_PLAY_RETRY` 熔断**永不触发**。

**解决**
1. 双保险：① `hookAndModifyHttpResponse` 改写响应关闭切屏开关（后因软解副作用回退，见 1.1）；② 兜底 `setupSwitchScreenNeutralizer()` 用 Object.defineProperty 把 window.onblur/onfocus/onresize 的 setter 置 no-op（[utils/utils.ts](file:///d:/learning_code/course-tools/src/mooc/zsgl/utils/utils.ts)）。
2. 暂停风暴熔断：60s 窗口内 pause ≥8 次 → `abortAutoResume()` 并提示导出日志（`PAUSE_STORM_MAX_COUNT=8 / PAUSE_STORM_WINDOW_MS=60000`）。
3. 播放点击限流：日志证实 loadedmetadata/canplay/源轮询**三个事件源在 1 秒内各点一次播放按钮**，可能令 DRM 播放器反复启停 → `clickPlayButton()` 加 `PLAY_CLICK_MIN_INTERVAL_MS=2000` 限流。
4. pause 监听器顶部加 `if (this.playAborted) return;`，熔断后不再点击播放。

**经验教训**
- **事件拦截和 visibility 伪装挡不住 `window.onXXX = fn` 属性赋值**，对付属性赋值式监听要用 Object.defineProperty 劫持 setter。
- **熔断计数不能被"成功"重置**：暂停-恢复死循环里每次 play 都 reset 计数 → 熔断永不触发；熔断逻辑要按时间窗口内事件频率计算。
- 自动恢复播放要有**点击限流**：多个事件源（loadedmetadata/canplay/轮询）都可能触发起播，叠加会刺激 DRM 播放器反复启停（伴随内存 50→123MB 突刺）。

### 1.3 崩溃后拿不到日志（LogRecorder 体系建设）【T-002】

**问题现象**
浏览器崩溃/冻结强杀后没有任何现场可查；初期建好的日志系统又连环踩坑：
- main/cs 两个世界同时下载触发 Edge"**多个自动下载**"拦截；
- **下载失败仍无条件删除 localStorage 键** → 前两次会话的崩溃日志永久丢失。

**定位与解决**（[log.ts](file:///d:/learning_code/course-tools/src/internal/utils/log.ts) 整体重写）
- 结构：内存环形缓冲 2000 行 → 每 5s 落地 localStorage → 崩溃（pagehide 未触发）后下一个 zsgl 页面加载 3s 自动导出 `工具日志_上次崩溃_*.log`。
- 双世界分区（主世界 PageLog `zsgl_log_main` / 内容脚本 ConsoleLog `zsgl_log_cs`）、按标签页隔离（tabId 存 sessionStorage）、心跳 30s 判死防抢占存活标签页。
- 修复后：**单飞合并导出**（export_lock 15s 互斥，全世界孤儿键单文件下载）+ **归档替代删键**（`zsgl_log_arch` 400KB 滚动），杜绝"下载被拦 → 删键 → 日志丢失"。
- 每次落地追加 `[mem]` JS 堆采样行（区分内存泄漏 vs CPU 型问题）；全局捕获 `window.onerror` + `unhandledrejection`。

**经验教训**
- **错误对象不能 JSON.stringify**：`JSON.stringify(new Error("x"))` 得 `"{}"`，曾因此丢掉全部堆栈——必须用 `Error.stack`。
- **配置命名空间键陷阱**：弹窗配置页经 `SetNamespaceConfig("zsgl",...)` 保存的键带 `zsgl_` 前缀；log.ts 曾只读全局键导致"日志转存开关不生效"。读配置必须"先命名空间键 `zsgl_log_persist_enabled` 再全局键"。
- **重写共享模块务必类型检查**：log.ts 重写时曾丢掉 PageLog 的 `getNowTime()`/`first()` 方法 → 运行时 TypeError 导致学习地图页初始化全挂（webpack ts-loader `transpileOnly: true` 不查类型）。改完必须 `npx tsc --noEmit` 对比基线（存在 ~60 个改动前基线错误，只看新增）。
- **一次强杀导出 N 份日志 ≠ 崩溃 N 次**：强杀时所有标签页 pagehide 都不触发，全部缓冲同时变孤儿。
- 生产模式下 cs 世界只有 mem 行（ConsoleLog.Debug 被门控），行为日志全在 main 世界缓冲；cs 与 main 的 tabId 不同（隔离世界不共享 sessionStorage）。

### 1.4 考试答案导出不完整【T-001】

**问题现象**
35 题的考试只导出 10 题；交卷时的导出也被跳过。

**定位过程**
按日志时间线（zsgl.lzlj.com-1789879986283.log）逐条核对：`queryQuestionDetail.do` 每批返回 10 题（35 题分 4 批），而实现存在三重叠加 bug：
1. 每批响应**整体替换** `questionList`，任何时刻只留一批；
2. 第一批 10 题破解完就立即 `tryExportAnswers()` → 导出仅 10 题且置位幂等标记 `answerExported`；
3. 后续所有导出时机（后续批次/任务完成/交卷 `examComplete`）全被幂等标记跳过；且 `OperateCard` 里 `jobIndex === questionList.length-1` 会提前触发 `examComplete`（分批下"答完第一批最后一题"≠ 考试结束）。

**解决**（[exam.ts](file:///d:/learning_code/course-tools/src/mooc/zsgl/exam.ts)）
- 新增 `allQuestionMap: Map<questionId, QuestionInfo>` 跨批累积，`mergeQuestionBatch()` 按 questionId 去重（**first-seen 优先**，保护已破解答案），合并后重建 questionList；
- 批次破解经 `autoAnswerChain` Promise 链**串行**执行——防止多批并发时共享策略实例状态被 `init()` 清空（策略类含内部状态，不可并发）；
- 导出时机改为：题目集齐（`allQuestionMap.size >= questionIdList.length`）且破解链跑完自动导出一次 + 交卷兜底导出（幂等）；删除提前 examComplete。

**经验教训**
- 分页接口 + 幂等标记 + 提前触发信号三者组合极易出错；"首批完成"与"全部完成"必须区分。
- 共享的有状态策略实例**不能并发**，要么串行链要么每批新建实例。
- 幂等标记置位前先确认"这次导出的数据是不是完整的"。

### 1.5 视频起播抢跑与起播死锁

**问题现象**
- `waitForVideoSourceAndPlay` 在 readyState=0 仅 blob src 挂上时就判定 hasSource 并点击播放（抢跑，扰动 DRM 初始化）；
- 反向问题：部分 DRM 播放器**需先 play() 才拉流加载元数据**，与"等元数据才播放"互等死锁（音频任务也遇到过，41af22d 修复）。

**解决**（[video.ts](file:///d:/learning_code/course-tools/src/mooc/zsgl/video.ts) / [scorm.ts](file:///d:/learning_code/course-tools/src/mooc/zsgl/scorm.ts)）
- readyState≥1（HAVE_METADATA）才点击播放的门控；
- 轮询 8s 后若 blob 源已挂载则主动尝试起播的兜底。

**经验教训**
- DRM（MSE/EME）播放器加载时序**不遵循常规 video 模型**：既不能抢跑（readyState=0 点击），也不能死等元数据（有的必须先 play）。两个方向的兜底都要有。
- 2026-09-21 曾实施 readyState 门控后回归"未通过"（崩溃提前到 ~5s）——修复语义正确但根因另有其人（见 1.1），**单点修复后回归失败不代表修复错误，可能是多因叠加**。

### 1.6 站点水印组件报错

**问题现象**：站点 `a.getIsWatermark`（chunk 3646）每次课程页加载抛 `removeChild` TypeError（主世界日志拿到完整堆栈）。

**定位与解决**：[course.ts](file:///d:/learning_code/course-tools/src/mooc/zsgl/course.ts) OperateCard 原来往 `#watermarkFrame || body` prepend 一个**空 div**（控制栏创建已注释，纯属无用代码）——疑似打断站点水印组件的 DOM 操作，已删除。

**经验教训**：往站点 DOM 里插入"看似无害"的节点也可能打断站点组件（如 React 的 removeChild 断言）；无用代码直接删，不要留着碰运气。

### 1.7 三方课程完成感知：轮询失效【ADR-001】

**问题现象**
zsgl 课程页需感知三节课（不同源）毕业状态。原实现 zsgl 侧每 30s 重放 `queryCourseDetail` 轮询，实际返回"后台处理错误"。

**定位与解决**
- 根因：重放只复用了 URL（GET、无请求体），正常请求为 **POST + form body（courseId=...）+ headerMap 签名头**；复刻签名需逆向站点算法，成本高。
- 解决（[ADR-001](adr/ADR-001-sanjieke-complete-push.md)）：改**事件推送、双路冗余、免服务端校验**——A 路 `window.opener.postMessage` 直推 + B 路扩展中转（start→background→start，`openerTabId` 优先、缺失时广播）；zsgl 侧 `sanjiekeCompleteHandled` 幂等去重。

**经验教训**
- **不要假设"重放请求 URL"就能复现站点接口调用**——请求体与签名头缺一不可。
- 跨域（不同源标签页）完成信号不能靠 localStorage storage 事件（不互通）；推送设计要覆盖 opener 为 null（noopener/手动打开）的场景，双路冗余 + 幂等去重。

### 1.8 页面后台被浏览器冻结导致完成信号延迟

**问题现象**：三方课程课程页/学习地图页是**无媒体纯等待页**，后台超阈值被浏览器内存节省程序冻结，推送信号延迟。

**解决**：[utils.ts](file:///d:/learning_code/course-tools/src/mooc/zsgl/utils/utils.ts) 新增 `setupPageKeepAlive`——Web Locks shared 模式持锁（永不 resolve，页面销毁自动释放）进入冻结豁免名单；`navigator.locks` 不可用时静默跳过；并在 08-用户指导补浏览器"保持活动"站点设置作双保险。

**经验教训**：依赖"页面活着"的推送/轮询逻辑，必须考虑 Chrome 内存节省程序 / Edge 睡眠标签页的后台冻结；Web Locks 是标准豁免手段。

### 1.9 学习地图任务完成后不返回【T-003】

**问题现象**：学习地图页与任务页是不同页面，任务完成后任务页不关、地图页不刷新、无法自动串下一关。

**定位与解决**
- 原因：缺少跨页完成信号与关页逻辑。
- 解决：任务页完成时 `notifyStudyMapCourseComplete` 写 `zsgl_task_{courseId}` finished + `window.close()`（实际位于 [course.ts](file:///d:/learning_code/course-tools/src/mooc/zsgl/course.ts)，文档曾误写为 mooc.ts，一致性核对时已修正）；地图页 storage 事件触发 reload → `findNextLevelAndStart` 下一关。
- 附带：学习地图关卡筛选曾缺 `resourceType` 过滤、关卡只剩考试任务时未自动跳过（352f349 修复）。

**经验教训**：跨页面串联闭环必须明确"谁写信号、谁听信号、谁关页、谁推进"四件事；文档描述要与实际代码位置核对（一致性核对流程的价值）。

### 1.10 其它已修复的历史问题速查

| 日期/提交 | 问题 | 定位与解决 | 教训 |
|---|---|---|---|
| a29e590 (2026-03-25) | 任务切换**递归调用死锁** | async/await 递归调用 switchToNextTask 造成死锁；改循环模式，统一任务启动入口 | 任务推进链避免 async 递归，用循环/队列 |
| 298fbb2 (2026-03-14) | 视频结束处理函数**重复调用** | setupVideoEndHandler 被重复注册调用；去重注册 | 事件处理器注册要防重（once-guard） |
| c56f706 (2026-03-13) | 视频**倍速/静音设置失效** | 播放控制逻辑重构修复；后续 41af22d 又修播放设置**同步竞态** | 倍速/静音写入点要与播放器初始化时序对齐（见 1.1 v3 残留，play 事件写入仍可能触发软解） |
| 607ece8 (2025-10-12) | 视频任务初始化未正确绑定视频元素；课程详情数据未初始化数组 | 补绑定与初始化；加播放/暂停定时器检查 | SPA 页面元素是异步出现的，Init 绑定要轮询重试 |
| 5447846 (2025-10-10) | 考试任务点状态判断错误 | taskinfo 无 hasLearned 字段时默认**未完成**（原默认判定导致误跳过） | 对可选字段显式给安全默认值 |
| 99de374 (2025-10-10) | 视频完成后无法触发完成事件；考试题目加密 | AES 解密解析（constants.ts 配置）；hashchange 监听实现 SPA 页面切换自动初始化 | hash SPA 必须监听 hashchange，URL 变化不会重载页面 |
| 65714b1 (2026-09-17) | 对 `queryQuestionAnswer` 结果**理解错误** | 修正策略对响应语义的理解；统一答题结果上报 | 逆向接口响应字段含义必须实测验证 |
| 65714b1 (2026-09-17) | HTTP 钩子**重复注册** → 回调多次执行 | 钩子按 Map 去重只初始化一次 + `removeHttpRequestHook` 支持移除 | 全局钩子必须幂等 + 可拆卸 |
| 65714b1 (2026-09-17) | 判断题不支持 | questionType 为 "T" 的题纳入单选策略；去 HTML 标签提升日志可读性 | 题型枚举要覆盖站点全量取值 |
| b45964c 等 | md5 依赖不统一 | 替换为 crypto-js 的 MD5 | 加密库统一，避免多套实现行为差异 |
| df13090/352f349 (2026-03) | 积分任务重复切换/任务冲突；积分无变化检测 | 改进切换机制；优化无变化检测与上限检查（频率 10→2） | 轮询型积分逻辑要防重入 |
| d981d34/41d5c01 (2026-03-10) | 视频任务/关卡任务定时器管理混乱 | TimerManager 统一管理定时器与清理 | 定时器托管是防泄漏与防重复的基础设施 |

## 二、sanjieke 平台问题

### 2.1 content/tree 解析字段不匹配（课时全部被跳过）【T-016】

**问题现象**：任务永不构建、课时列表为空；控制台 `4.chunk.js:1137` 反复刷屏（后确认为站点自身 console.log 非报错）；页面每 ~2.1s 整页重载循环。

**定位过程**：实机日志 `lzlj.b.sanjieke.cn-1790087970472.log` + 课程 34002056 实测响应抓取，对照 [study.ts](file:///d:/learning_code/course-tools/src/mooc/sanjieke/study.ts) 的字段识别逻辑。

**根因**（凭命名猜字段的典型翻车）：
- 叶子节点 id 字段实测为 **`nodeId`**（原仅识别 id/lessonId/contentId）→ 全部课时被跳过；
- 完成标记实测为嵌套 `attribute.isFinish`（0/1 数字）→ 完成判定恒 false。

**解决**：`flattenLessons` 增加 nodeId 兜底；`isNodeFinished` 补 attribute.isFinish 判定（8327d25）。

**经验教训**
- **三方接口字段必须以实测响应为准**，不要凭命名或惯例猜；开发期把"响应体结构验证"列为必做项（spec 里原有兜底，实测优先）。
- 控制台刷屏先分清是站点自身输出还是扩展输出，避免误判方向。

### 2.2 课后题后台作答被 Chrome 定时器节流

**问题现象**：后台挂机时课后题每题耗时 ~3 分钟。

**定位**：Chrome intensive throttling——后台 >5min 且无声时 setTimeout 降为 1 次/分钟；quiz.ts 的定时器链（等组件轮询/选中延迟/提交推进）全部被拖慢。

**解决**（[quiz.ts](file:///d:/learning_code/course-tools/src/mooc/sanjieke/quiz.ts)）
- 定时器链改由**内联 Blob Worker 心跳驱动**（1s tick + 主线程等待队列），Worker 不受主线程节流；
- 等待超时改**墙钟判定**（Date.now，不受节流影响）；
- Worker 创建失败（如站点 CSP 限制 blob:）自动退化为原 setTimeout 链（仅变慢不阻塞）；
- finish/Stop 双路径终止 Worker。

**经验教训**：后台页面的 setTimeout/setInterval **不可信**；需要精确定时的后台逻辑用 Worker 心跳 + 墙钟判定，且必须留退化路径（CSP 可能禁 blob:）。

### 2.3 视频完成信号不可靠 → 平台信号确认制（迭代 2/M7）

**问题现象**：ended 事件推进不可靠（视频未真正完成即 ended / 站点未记录完成）。

**解决**（[video.ts](file:///d:/learning_code/course-tools/src/mooc/sanjieke/video.ts)）
- 视频完成改 **`setContentFinished` 平台信号确认制**：hook 响应按课时过滤，拦截到本课时响应即收口完成（幂等，含播放中段触发）；
- ended 未确认自动重播（去 once 监听，`VIDEO_REPLAY_MAX=3` 熔断，超限走任务集兜底）；Stop 移除钩子。
- 配套 quiz.ts：提交成功后判 `completedFlag === true` 精确收尾（优先于 idle 启发式）；自动点击「继续挑战」拉取下一题；答题轮次上限 30→12（af90adc，避免异常时循环过久）。

**经验教训**：挂机完成判定**优先用服务端/平台自身的确认信号**（hook 站点完成上报响应），本地事件（ended）只作触发与兜底；所有自动推进都要有重试上限熔断。

### 2.4 三节课页面特性（调研期结论，影响后续开发）

- 播放器为 xgplayer，`<video>` 元素**懒创建**（点击播放后才注入 DOM），不能在 Init 时假定元素存在；
- 心跳 `record_duration` 自页面加载起**每 10s 固定一次，与是否播放无关**（页面停留心跳非播放进度）——不要指望它反映播放状态；
- 课后题接口 `questions` 响应**直接包含 answer 字段**（自动答题的前提）；
- 三节课与 zsgl 不同源 → localStorage 不互通（见 1.7 推送方案）。

## 三、工程与调试通用经验

1. **构建与扩展重载**
   - `npm run build` → 输出 `build/cxmooc-tools/src`（Edge 实际加载目录）；`build/zsgl-tools` 是旧拷贝**已过期勿用**；
   - 每次 build 后必须在 Edge 扩展管理页点**"重新加载"**，否则跑旧代码——曾因此误判修复无效。
2. **类型检查**：webpack ts-loader `transpileOnly: true`，类型错误只在运行时暴露；`npx tsc --noEmit` 存在 ~60 个基线错误，对比时只看新增（P3 项：CI 加 fork-ts-checker/白名单）。
3. **站点反调试**：zsgl 页面脚本内嵌 `debugger;` checker——DevTools 打开期间页面 JS 被暂停，**关闭 DevTools 瞬间页面被导航到 about:blank**。zsgl 页面调试一律不可开 DevTools（如需 F12 先禁用断点再刷新），取证只依赖 LogRecorder（`__toolLogExport()` 在 DevTools 下也不可用）。
4. **崩溃取证旁路**：Edge LocalStorage LevelDB 位于 `%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Local Storage\leveldb\`，键为 ASCII/UTF-8、值为 UTF-16LE，需双编码搜索 `zsgl_log_`。
5. **进程采样陷阱**：新版 Chromium 渲染进程命令行为 `--type=renderer`（无 `-process` 后缀），解析进程类型的正则要同步更新，否则渲染进程被误标为 browser。
6. **观测优先方法论**（T-004 验证有效）：先建观测（日志/内存采样）→ 复现固定（单变量环境）→ 进程级采样定位燃烧进程 → A/B 隔离阶梯逐项剥离 → 真实/合成操作对照 → LevelDB 旁路取证。
7. **日志解读**：崩溃日志分段格式 `===== zsgl_log_<world>_<tabId> =====`；文件末尾可能有无头部的 `_last` 内容（正常退出页面的最后缓冲）。
8. **配置命名空间**：`SetNamespaceConfig("zsgl",...)` 保存的键带 `zsgl_` 前缀；代码读配置必须"先命名空间键再全局键"。
9. **防御式设计三件套**（本仓库反复出现的模式）：全局钩子幂等注册（once-guard）+ 可拆卸；所有自动重试/推进有熔断上限（暂停风暴 8 次/60s、播放点击 2s 限流、重播 3 次、答题轮次 12）；等待类逻辑有超时 + 墙钟判定。
10. **流程纪律**：跨模块改动前先核对模块归属（曾发生 sanjieke 需求误做到 zsgl/video.ts、以及误提交清空 sanjieke 实现，靠 revert + 恢复基线 21f33a6 补救）；每次提交按 ai-collab 同步 changelog/tasks 留痕（曾单日 3 次提交未留痕，事后补录成本高）。

## 四、问题→代码→文档 索引

| 问题 | 核心代码 | 深入文档 | 关键提交 |
|---|---|---|---|
| CPU 100% 整机冻死 | [video.ts](file:///d:/learning_code/course-tools/src/mooc/zsgl/video.ts)、[course.ts](file:///d:/learning_code/course-tools/src/mooc/zsgl/course.ts) | `.trae/documents/zsgl-video-storm-root-cause-report.md`、`.trae/documents/zsgl-debug-handoff.md` | 36c3379、3afffd6、768606c、65decb5 |
| 切窗弹窗/暂停死循环 | [utils/utils.ts](file:///d:/learning_code/course-tools/src/mooc/zsgl/utils/utils.ts)、[constants.ts](file:///d:/learning_code/course-tools/src/mooc/zsgl/constants.ts) | `.trae/documents/fix-zsgl-video-switchscreen-logging.md` | 69ed825、93d8c18 |
| 崩溃日志系统 | [log.ts](file:///d:/learning_code/course-tools/src/internal/utils/log.ts) | handoff §2.2 | 69ed825、b09f3fd 后续、T-002 单飞合并 |
| 考试答案导出不完整 | [exam.ts](file:///d:/learning_code/course-tools/src/mooc/zsgl/exam.ts) | `.trae/documents/fix-zsgl-exam-batch-export.md` | 69ed825 |
| 起播抢跑/死锁 | video.ts、[scorm.ts](file:///d:/learning_code/course-tools/src/mooc/zsgl/scorm.ts) | handoff §四P1 | b09f3fd、41af22d |
| 三方完成推送/页面保活 | sanjieke/study.ts、zsgl/course.ts、utils.ts | [ADR-001](adr/ADR-001-sanjieke-complete-push.md)、`.trae/specs/sanjieke-complete-push/` | 84cdf07 |
| 学习地图返回闭环 | studyMap.ts、course.ts | 03-详细设计 §8 | 69ed825 前、352f349 |
| sanjieke content/tree 解析 | [sanjieke/study.ts](file:///d:/learning_code/course-tools/src/mooc/sanjieke/study.ts) | `.trae/specs/sanjieke-auto-study/` | 8327d25 |
| sanjieke 后台节流 | [sanjieke/quiz.ts](file:///d:/learning_code/course-tools/src/mooc/sanjieke/quiz.ts) | 同上 checklist M7 | b20e306 后续 |
| sanjieke 完成确认制 | sanjieke/video.ts、quiz.ts | 同上 spec 迭代 2 | b20e306 |
