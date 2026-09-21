# 三节课（sanjieke）自动挂机特性 — 文档落地计划

## 概要

zsgl 平台新增"混合"型课程：课程详情页点击「立即学习」后跳转到三节课（`lzlj.b.sanjieke.cn`）学习页。本计划**本轮只落地需求/里程碑/任务/验收文档**（不改任何代码），为后续分里程碑开发提供决策完备的规格基线。

- 特性名：`sanjieke-auto-study`（三节课自动挂机 + 自动串联）
- 文档落点：`.trae/specs/sanjieke-auto-study/`（沿用项目现有 spec 三件套格式：`spec.md` / `tasks.md` / `checklist.md`）
- 同步登记：`src/mooc/zsgl/TODO.md`

## 现状分析

### 页面调研结论（已通过浏览器实测确认）

| 维度 | 结论 |
|------|------|
| 三方页面 URL | `https://lzlj.b.sanjieke.cn/study/0/{courseId}/{lessonId}`，React SPA |
| 播放器 | 西瓜播放器 xgplayer，`<video>` 元素**懒创建**（点击播放后才注入 DOM），选择器锚点 `.content-video-main`（如 `#content-video-main-36725563-*`） |
| 页面结构 | 左侧课时列表（本例 21 节，每节 4~13 分钟），右侧播放器 + 课后 `ai-quiz` 组件（选择题未作答时提交按钮 `.quiz-submit-button` 禁用） |
| 心跳上报 | `POST web-api.sanjieke.cn/b-side/api/web/study/0/{courseId}/record_duration` — **自页面加载起每 10s 固定一次，与是否播放无关**（页面停留心跳，非播放进度） |
| 课后题接口 | `GET /study/0/{courseId}/questions`，**响应直接包含 `answer` 字段**（用户已提供样例：`type: RADIO`、`options`、`answer: ["B"]`、`analysis`、`nextFlag`、`completedFlag`） |
| 完成判定接口 | `GET /study/cert/graduated?courseId={courseId}`（毕业状态）、`GET /study/0/{courseId}/content/tree`（内容树） |
| 鉴权 | Bearer token（存在 `POST /token/refresh`），XHR 钩子可直接复用页面已发出的请求响应 |
| zsgl 入口 | 课程详情页 `#/home/courseDetail/{id}`，「立即学习」为 MUI Button（React onClick），点击后新开三节课标签页；页面另有「完成规则」按钮 |

### 代码架构结论（可复用机制清单）

| 机制 | 位置 | 复用方式 |
|------|------|----------|
| XHR 响应钩子 | `src/mooc/zsgl/utils/utils.ts:51-178`（`hookHttpRequest`/`initializeHooks`，幂等、按 URL includes 匹配） | 三节课页 hook `content/tree`、`questions`、`cert/graduated` |
| 可见性伪装/事件防穿透 | 同上 `setupVisibilitySpoof`(:371)、`setupEventPrevention`(:273)、`setupSwitchScreenNeutralizer`(:340) | 三节课挂机防切屏暂停 |
| 定时器托管 | 同上 `TimerManager`(:404) | 三节课任务的定时器统一清理 |
| 任务基类 | `src/mooc/zsgl/task.ts:21-99`（`ZsglTask`：Init/Start/Stop、`addManagedListener`、`runCleanup`、`callEvent("taskComplete")`） | 三节课课时/课后题任务基类可直接继承 |
| 任务集驱动 | `src/internal/app/mooc.ts:36-48`（`MoocTaskSet`）+ `src/mooc/mooc.ts:86-154`（`MoocLauncher.runTask` 按 `config.auto`/`interval` 推进） | 三节课课程页实现 `MoocTaskSet`，课时即任务点 |
| 平台工厂 | `src/internal/app/mooc.ts:57-74`（`DefaultMoocFactory`）+ `src/mooc/zsgl/platform.ts:23-74`（URL hash 分发 + `SetNamespace`） | 新增 `SanjiekePlatform` 按域名分发，`SetNamespace("sanjieke")` |
| 配置系统 | `src/config.ts`（`SystemConfig.config[ns].items` 自动渲染 popup）+ `src/internal/utils/config.ts:5-34`（`ConfigItems` getter） | 新增 sanjieke 命名空间配置项，popup 零改动 |
| 课程完成→地图推进闭环 | `src/mooc/zsgl/course.ts:218-260`（`notifyStudyMapCourseComplete` 写 `zsgl_task_{courseId}` finished + `window.close()`）+ `src/mooc/zsgl/utils/utils.ts:219-231`（storage 事件触发地图页 reload）+ `studyMap.ts:282-314`（`findNextLevelAndStart`） | **学习地图驱动多课程串联直接复用此闭环** |
| zsgl 课程状态数据源 | `course.ts:134-204`（hook `queryCourseDetail.do`，`hasLearned` 字段判定完成） | zsgl 侧轮询自身接口确认三方课程完成 |
| 注入链路 | `build/zsgl-tools/manifest.json:21-33`（content_scripts matches）+ `src/config.ts:44-47`（`SystemConfig.match` 主世界注入正则） | **两处都需新增 `*://lzlj.b.sanjieke.cn/*`** |
| background 消息服务 | `src/background.ts:13-38`（`NewExtensionServerMessage("cxmooc-tools")`） | 备用跨域通知通道（详见技术决策 3） |

## 需求决议（用户已确认）

1. **自动答题**：三节课 question 接口响应自带答案 → 首版包含课后题自动作答（选择题自动选中正确项并提交）。
2. **串联调度归属：方案 A**：zsgl 标签页做调度器；结合决议 4，多课程串联由**学习地图页驱动**（复用现有"课程完成→关页→地图刷新→下一关"闭环），zsgl 课程详情页负责检测三方课程类型并自动点「立即学习」、轮询自身课程状态。
3. **需要倍速**：三节课播放器支持倍速设置（`playbackRate`），倍速可配置。
4. **本轮只产文档**：不改代码；交付 spec/tasks/checklist 三件套 + TODO.md 登记。
5. **首版不含三节课考试**（exam API 列为后续里程碑）。

## 交付物（本轮全部为文档）

### 1. `.trae/specs/sanjieke-auto-study/spec.md`（需求规格 + 里程碑）

结构沿用 `add-knowledge-task/spec.md` 惯例（Why / What Changes / Impact / 任务流程分析 / 实现方案），内容要点：

**Why**：zsgl"混合"型课程跳转三方（三节课）学习页，现有扩展不注入三方域名、无挂机能力，需人工逐节观看+答题。

**What Changes（面向后续编码轮次，本轮不实施）**：
- 新建 `src/mooc/sanjieke/` 模块（platform.ts / study.ts / video.ts / quiz.ts / constants.ts / types.ts / utils/）
- 修改 `build/zsgl-tools/manifest.json`（content_scripts 增加 sanjieke 域名）
- 修改 `src/config.ts`（`SystemConfig.match` 注入正则 + `SystemConfig.config.sanjieke.items` 配置项）
- 修改 `src/internal/app/mooc.ts`（`DefaultMoocFactory` 注册 `SanjiekePlatform`）
- 修改 `src/internal/utils/config.ts`（`ConfigItems` 接口 + getter，可选）
- 修改 `src/mooc/zsgl/course.ts`（识别三方课程 → 自动点「立即学习」→ 轮询课程状态；`URL`/三方类型从"暂不支持"改为可调度）

**三节课页面任务流程分析**（写入 spec 的目标流程）：

```
[学习地图页] 关卡发现未完成任务 → 打开课程详情页（现有流程）
      ↓
[zsgl 课程详情页] hook queryCourseDetail 识别三方/混合课程
      → 方案A：自动点击「立即学习」（window.open 三节课页）
      → 定时轮询 queryCourseDetail，全部 hasLearned=1 时走现有 courseTaskComplete 闭环
      ↓
[三节课学习页] SanjiekePlatform 识别 → SanjiekeStudy(MoocTaskSet)
      1. hook content/tree 枚举课时 → 任务列表
      2. 课时视频任务：等待 xgplayer 注入 video → 起播 → 倍速/静音/防暂停/可见性伪装
         → ended 推进下一课时
      3. 课后题任务（课时完成后出现 ai-quiz）：hook questions 取 answer
         → 选中正确项 → 点击提交 → 等待进入下一节
      4. 全部课时完成 → 检测毕业（hook cert/graduated 响应 / content/tree 全完成兜底）
      5. 写完成标记 → window.close()
      ↓
[zsgl 课程详情页] 轮询发现完成 → 现有闭环关页
      ↓
[学习地图页] storage/消息事件 reload → findNextLevelAndStart 下一关
```

**关键技术决策（写入 spec）**：
1. **跨域通信**：三节课与 zsgl 不同源，localStorage storage 事件不能跨域 → 完成信号不依赖跨域 localStorage；zsgl 侧以自身 `queryCourseDetail` 服务端状态为准轮询（三方直接回传进度，zsgl 数据最终一致）；三节课页完成时直接 `window.close()`（脚本打开的页面可脚本关闭）。
2. **挂机策略**：按"真实播放"实现（用户要求倍速），同时 record_duration 停留心跳天然随页面存续上报；防暂停/防切屏复用 `setupVisibilitySpoof` 等既有工具。
3. **自动答题范围**：仅作答接口返回了 `answer` 的客观题（RADIO 等）；开放性问题不作答、不阻塞课时推进；提交后依据响应 `nextFlag`/`completedFlag` 推进。
4. **配置命名空间**：`SetNamespace("sanjieke")`，新增配置项：`auto`（自动挂机）、`video_multiple`（倍速）、`video_mute`（静音）、`quiz_auto_answer`（自动答题）。popup 因遍历 `SystemConfig.config` 自动出现新 tab，零改动。

**里程碑划分（写入 spec）**：
- M1 文档基线（本轮）：spec/tasks/checklist 落地
- M2 平台接入骨架：manifest + SystemConfig.match + SanjiekePlatform + 配置项 + popup 验证
- M3 视频挂机：xgplayer 起播/倍速/静音/防暂停/ended 课时串联
- M4 课后题自动答题：questions 钩子 + 作答 + 提交推进
- M5 完成判定与串联闭环：graduated 检测、关页、zsgl 轮询、学习地图驱动下一关
- M6 稳定性与验收：熔断（复用暂停风暴策略思路）、日志、`__toolLogExport` 风格导出、实测验收

**待开发期验证项（写入 spec 的 Assumptions，均已有兜底方案）**：
- `cert/graduated` 与 `content/tree` 的响应体结构（XHR 钩子实测抓取，不阻塞开发）
- 三节课完成判定是否强制要求真实播放（策略已按真实播放实现，无风险敞口）
- 「立即学习」点击行为（当前 tab 跳转 or window.open）影响 `window.close()` 有效性 → 实测确认，兜底：通知 zsgl 页面轮询闭环，不依赖 close
- zsgl `queryCourseDetail` 对三方课程的 `hasLearned` 回写时延（决定轮询间隔，默认 30s）

### 2. `.trae/specs/sanjieke-auto-study/tasks.md`（任务分解）

按里程碑分组（M2~M6）的 Task/SubTask 清单（格式沿用 `add-knowledge-task/tasks.md`），含任务依赖关系（M2→M3→M4→M5→M6，M4/M3 可并行）。每个任务标注涉及文件路径（与 spec What Changes 一致）。本轮这些任务全部为未勾选状态。

### 3. `.trae/specs/sanjieke-auto-study/checklist.md`（验收清单）

两部分：
- **文档验收（本轮）**：三件套齐备、决议 1-5 全部体现、每个后续编码任务可追溯到 spec 决策、无代码改动
- **后续实现验收（M2~M6 逐项）**：域名注入生效、倍速/静音/防暂停生效、课时自动推进、选择题自动作答并提交、课程完成自动关页、学习地图自动进入下一关、无控制台报错、Stop/清理无泄漏

### 4. 更新 `src/mooc/zsgl/TODO.md`

登记新特性条目：三节课自动挂机（状态：文档阶段，链接 spec 目录）。

## 假设与约束

- 本轮**零代码改动**（TODO.md 登记除外——若用户视为代码文件可不改，默认修改）
- 文档语言：中文，与现有 `.trae/specs/` 一致
- 三节课考试、开放题作答、非 lzlj 定制域名（通用 sanjieke C 端）均不在首版范围
- 不触碰 zsgl 现有任务的稳定逻辑（video/knowledge/scorm/exam），`course.ts` 改动仅限三方课程分支

## 验证步骤

1. 检查 `.trae/specs/sanjieke-auto-study/` 三件套存在且格式与 `add-knowledge-task/` 一致
2. 对照本计划"需求决议"逐条核对 spec 是否体现（答题/方案A/倍速/文档先行/不含考试/地图驱动）
3. 核对 tasks.md 的文件路径引用与 spec What Changes 完全一致
4. `git status` 确认除新增文档与 TODO.md 外无其他变更
