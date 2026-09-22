# 三节课（sanjieke）自动挂机 Spec

> 特性名：`sanjieke-auto-study`（三节课自动挂机 + 自动串联）
> 里程碑基线：M1 文档（本文档）；编码范围：M2~M6
> 关联计划：`.trae/documents/sanjieke-auto-study-plan.md`

## Why

zsgl 平台存在"混合"型课程：课程详情页点击「立即学习」后跳转到三节课（`lzlj.b.sanjieke.cn`）学习页。当前扩展存在三个缺口：

1. 扩展不注入三方域名，三节课页面完全无自动化能力，需人工逐节观看 4~13 分钟的视频并作答课后题；
2. 三方课程在 `TaskFactory.CreateCourseTask` 中属于 `URL`/三方类型，当前仅打日志"暂不支持的课程类型"并跳过（`src/mooc/zsgl/factory.ts:44-48`）；
3. 学习地图的多课程串联闭环在"三方课程"这一任务类型上断链。

需要新增三节课自动挂机能力，并接入现有"课程完成 → 关页 → 地图刷新 → 下一关"的串联体系。

## What Changes

> 本节为 M2~M6 编码轮次的改动清单，本轮（M1）不实施。

### 新建 `src/mooc/sanjieke/` 模块

| 文件 | 职责 |
|------|------|
| `platform.ts` | `SanjiekePlatform implements MoocFactory`：按域名 `lzlj.b.sanjieke.cn` + 路径 `/study/0/{courseId}/{lessonId}` 识别，`SetNamespace("sanjieke")`，返回 `SanjiekeStudy` |
| `study.ts` | `SanjiekeStudy extends EventListener<MoocEvent> implements MoocTaskSet`：hook `content/tree` 枚举课时 → 构建任务列表 → 课时串联推进 |
| `video.ts` | `SanjiekeVideo` 课时视频任务：等待 xgplayer 注入 `<video>` → 起播 → 倍速/静音/防暂停 → ended 推进 |
| `quiz.ts` | `SanjiekeQuiz` 课后题任务：hook `questions` 取 answer → 自动选中 → 提交 → 依 `nextFlag`/`completedFlag` 推进 |
| `constants.ts` | URL 模式、API 端点、DOM 选择器、重试/熔断常量 |
| `types.ts` | `ContentTreeNode`、`QuestionInfo`（含 `answer`）、`TaskInfo` 等类型 |
| `utils/utils.ts` | 复用 `zsgl/utils/utils.ts` 的 `hookHttpRequest` 等工具（经 import 复用或薄封装） |

### 修改既有文件

| 文件 | 改动 |
|------|------|
| `build/zsgl-tools/manifest.json` | `content_scripts.matches` 新增 `*://lzlj.b.sanjieke.cn/*` |
| `src/config.ts` | ① `SystemConfig.match` 新增 sanjieke 注入正则；② 新增 `SystemConfig.config.sanjieke.items` 配置项 |
| `src/internal/app/mooc.ts` | `DefaultMoocFactory.CreateMooc()` 优先尝试 `ZsglPlatform`，未命中再尝试 `SanjiekePlatform` |
| `src/internal/utils/config.ts` | `ConfigItems` 接口 + `ChromeConfigItems` getter（`video_multiple` 等按需） |
| `src/mooc/zsgl/course.ts` | 识别三方/混合课程分支：自动点击「立即学习」→ 定时轮询 `queryCourseDetail` 完成状态 → 走现有 `courseTaskComplete` 闭环 |

### 配置项（`SystemConfig.config.sanjieke.items`，popup 自动渲染新 tab）

| key | 类型 | 默认 | 说明 |
|-----|------|------|------|
| `auto` | checkbox | true | 自动挂机总开关 |
| `video_multiple` | text | "1" | 播放倍速 |
| `video_mute` | checkbox | true | 视频静音 |
| `quiz_auto_answer` | checkbox | true | 课后题自动答题 |

## 页面调研结论（实测）

| 维度 | 结论 |
|------|------|
| 三方页面 URL | `https://lzlj.b.sanjieke.cn/study/0/{courseId}/{lessonId}`，React SPA（lzlj 定制 B 端版） |
| 播放器 | 西瓜播放器 xgplayer，锚点 `.content-video-main`（实例 id 形如 `content-video-main-36725563-*`）；`<video>` 元素**懒创建**，点击播放后才注入 DOM |
| 页面结构 | 左侧课时列表（每节 4~13 分钟），右侧播放器 + 课后 `ai-quiz` 组件；选择题未作答时提交按钮 `.quiz-submit-button` 禁用 |
| 心跳上报 | `POST /b-side/api/web/study/0/{courseId}/record_duration` — 自页面加载起每 10s 固定一次，**与是否播放无关**（页面停留心跳）。结论：保持页面存续即可维持时长上报，播放行为由其他逻辑判定 |
| 课后题接口 | `GET /study/0/{courseId}/questions`，响应直接含 `answer` 字段。样例：`{"id":37391482,"type":"RADIO","question":"…","options":{"A":"…","B":"…"},"answer":["B"],"analysis":"…","correctFlag":false,"feedbackStatus":null,"nextFlag":true,"completedFlag":false}` |
| 完成判定接口 | `GET /study/cert/graduated?courseId={courseId}`（毕业状态）；`GET /study/0/{courseId}/content/tree`（内容树，课时列表+状态） |
| 鉴权 | Bearer token（`POST /token/refresh` 刷新）；XHR 钩子直接消费页面已发出的请求响应即可，无需自行携带 token |
| zsgl 入口 | 课程详情页 `#/home/courseDetail/{id}`，「立即学习」为 MUI Button（React onClick），点击后打开三节课页面；页面另有「完成规则」按钮 |

## 任务流程分析

### 目标流程全景

```
[学习地图页] 关卡发现未完成任务 → 打开课程详情页（现有流程，不改）
      ↓
[zsgl 课程详情页] hook queryCourseDetail 识别三方/混合课程
      → 方案A：自动点击「立即学习」（打开三节课页）
      → 定时轮询 queryCourseDetail，全部 hasLearned=1 时走现有 courseTaskComplete 闭环（关页）
      ↓
[三节课学习页] SanjiekePlatform 识别 → SanjiekeStudy(MoocTaskSet)
      1. hook content/tree 枚举课时 → 任务列表（已学课时 Done()=true 跳过）
      2. 课时视频任务：等待 xgplayer 注入 video → 起播 → 倍速/静音/防暂停/可见性伪装
         → ended 推进下一课时
      3. 课后题任务（课时完成后出现 ai-quiz）：hook questions 取 answer
         → 选中正确项 → 点击提交 → 等待进入下一节
      4. 全部课时完成 → 检测毕业（hook cert/graduated 响应 / content/tree 全完成兜底）
      5. 写完成标记（日志/可选通知）→ window.close()
      ↓
[zsgl 课程详情页] 轮询发现完成 → 现有闭环关页
      ↓
[学习地图页] storage/消息事件 reload → findNextLevelAndStart 下一关
```

### 关键技术决策

1. **跨域通信**：三节课（`lzlj.b.sanjieke.cn`）与 zsgl（`zsgl.lzlj.com`）不同源，`localStorage` storage 事件**不能跨域传播**。完成信号不依赖跨域 localStorage：
   - 三节课页：完成即 `window.close()`（页面由「立即学习」脚本打开时可脚本关闭；若实测为当前 tab 跳转则关闭兜底失效，但不影响闭环）；
   - zsgl 课程详情页：以自身 `queryCourseDetail.do` 服务端状态为准**轮询**（三方直接回传进度，zsgl 数据最终一致），轮询间隔默认 30s。
   - 备用通道（不依赖）：background `chrome.tabs` 消息转发，仅当轮询时延不可接受时启用。
2. **挂机策略**：按"真实播放"实现（用户明确需要倍速）；`record_duration` 停留心跳随页面存续天然上报。防暂停/防切屏复用 `setupVisibilitySpoof`/`setupEventPrevention`/`setupSwitchScreenNeutralizer`（`src/mooc/zsgl/utils/utils.ts:273-399`），并沿用"暂停风暴熔断"思路（60s 内暂停超 8 次熔断，防切窗死循环）。
3. **自动答题范围**：仅作答接口返回了 `answer` 的客观题（RADIO 等）；开放性问题不作答、不阻塞课时推进；提交后依据响应 `nextFlag`/`completedFlag` 推进。`quiz_auto_answer=false` 时仅日志提示人工处理。
4. **video 懒创建**：xgplayer 未起播时 DOM 中无 `<video>`，任务需轮询等待 `.content-video-main video` 出现（复用 `TimerManager`），出现后再挂 `ended`/`pause` 等监听；起播点击锚点为 `.xgplayer-play`（兜底 `video.play()`）。
5. **配置命名空间**：`SetNamespace("sanjieke")`，与 zsgl 配置隔离；popup 因遍历 `SystemConfig.config` 自动渲染新 tab，**零改动**。
6. **平台注册顺序**：`DefaultMoocFactory` 先 `ZsglPlatform`（zsgl 域名），未命中再 `SanjiekePlatform`（三方域名）。两者按域名天然互斥，顺序仅防御性。
7. **首版范围排除**：三节课考试（exam API）、开放性问答题、非 lzlj 定制域名（通用 sanjieke C 端）均不在首版范围。

### 里程碑

| 里程碑 | 内容 | 验收锚点 |
|--------|------|----------|
| M1 文档基线（本轮） | spec/tasks/checklist 落地 + TODO.md 登记 | 文档评审通过 |
| M2 平台接入骨架 | manifest 域名 + SystemConfig.match + SanjiekePlatform + 配置项 | 三节课页控制台出现平台识别日志；popup 出现"三节课"tab |
| M3 视频挂机 | xgplayer 起播/倍速/静音/防暂停/ended 课时串联 | 单课时全自动播放至结束并推进下一课时 |
| M4 课后题自动答题 | questions 钩子 + 作答 + 提交推进 | 选择题自动选中正确项、提交、进入下一节 |
| M5 完成判定与串联闭环 | graduated 检测、关页、zsgl 轮询、学习地图驱动下一关 | 全课程完成后地图页自动进入下一关 |
| M6 稳定性与验收 | 熔断、日志、实测验收 | checklist.md 实现部分全勾 |

依赖关系：M2 → M3 → M5；M2 → M4 → M5；M5 → M6（M3 与 M4 可并行）。

## Assumptions（待开发期验证项，均不阻塞开工）

| # | 待验证项 | 验证方式 | 兜底方案 |
|---|----------|----------|----------|
| 1 | `cert/graduated` 与 `content/tree` 响应体结构 | XHR 钩子实测抓取（开发首日） | 以 DOM 课时列表完成标记兜底枚举 |
| 2 | 完成判定是否强制真实播放 | 小样本实测（仅停留不播放观察状态） | 策略已按真实播放实现，无风险敞口 |
| 3 | 「立即学习」点击行为（当前 tab or 新 tab） | 实测点击观察 | 闭环依赖 zsgl 轮询，不依赖 `window.close()` |
| 4 | zsgl `queryCourseDetail` 对三方课程 `hasLearned` 回写时延 | 轮询实测 | 轮询间隔可配置（默认 30s，上限 5min） |
| 5 | 三节课播放器是否有倍速上限/回置逻辑 | 实测 `playbackRate` 保持 | 复用 zsgl `ratechange` 监听回置策略 |

## Impact

- Affected code（编码轮次）：见 What Changes
- 不触碰 zsgl 现有任务稳定逻辑（video/knowledge/scorm/exam），`course.ts` 改动仅限三方课程分支
- 配置新增独立命名空间 `sanjieke`，不影响 zsgl 现有配置

---

## 迭代 2（2026-09-22）：平台完成信号确认与课后题精确推进

> 背景：错误会话曾把本迭代需求误做到 `src/mooc/zsgl/video.ts`（已在 3172a7b 恢复干净基线），
> 本迭代在 sanjieke 模块内正确实施。**明确排除：不实现"秒过"功能**（不主动构造/发送
> setContentFinished，仅拦截站点自身请求作为信号）——用户明确要求。

### Why

实测发现（用户 curl 抓包 + 站点行为观察）：**视频播完（ended）≠ 服务端确认完成**。站点按"观看区间"
判定完成，会主动发送 `POST /b-side/api/web/study/0/{courseId}/content/{sectionId}/setContentFinished`
（body: `{"contentId":<videoId>,"contentType":"video"}`），该请求才是平台侧的"任务完成"权威信号。
以 ended 直接标记完成会造成"本地标记了但服务端未确认 → 下次进来还要重播"的震荡。

课后题推进此前依赖 DOM 启发式（组件消失/连续无新题）。用户实测给出精确链路：提交答案后出现
「继续挑战」按钮 → 点击后站点拉取新题 → `video/question` 响应中 `"completedFlag": true` 表示
**当前题回答之后答题环节即结束**，可按时间（interval 配置）切换下一个视频任务。

### What Changes（迭代 2）

- **MODIFIED** `src/mooc/sanjieke/video.ts`：视频完成判定改为"平台信号确认制"
  - `Start()` 注册 `hookHttpRequest("setContentFinished")` 钩子，回调按 URL
    `/content/{lessonId}/setContentFinished` 过滤本课时（实测 URL 中 sectionId 与 study URL 的
    lessonId 恒等，样例 36727956）
  - 拦截到本课时的 setContentFinished 响应 → 立即写课时完成标记 → 推进（站点可能在播放中段发送，
    拦截到即完成，不等 ended）
  - `ended` 触发但未拦截到信号 → **自动重播**（currentTime=0 重新完整播放），重播上限熔断
    （VIDEO_REPLAY_MAX=3），超限走任务集既有自愈（整页重载，以服务端状态为准）
  - 进入页面时视频处于重播状态（ended / `xgplayer-is-replay`，此前看过但服务端未确认）同样走
    "重新完整播放"链路（既有行为，纳入验收）
- **MODIFIED** `src/mooc/sanjieke/quiz.ts` + `types.ts` + `constants.ts`：课后题推进改精确信号驱动
  - `video/question` 钩子解析响应 `data.completedFlag` 并缓存
  - `completedFlag === true` 的题**提交成功后** → quiz 任务结束（优先级高于 idle 轮次启发式）
  - 提交答案后查找并点击「继续挑战」按钮（按文本匹配，DOM 待实测校准）→ 站点拉取下一题
  - 既有兜底不变：无题/无答案/组件消失/30 轮熔断
- **MODIFIED** `src/mooc/sanjieke/study.ts`：课时切换延迟改用 `config.interval`
  （单位分钟 ×60000 毫秒，与 course163/zhihuishu/MoocLauncher 语义一致），替代固定
  `LESSON_TRANSITION_DELAY_MS`（5s 常量保留供其他兜底路径使用）

### 目标链路（迭代 2）

```
进入页面 → 对齐首个未完成课时 → 视频开始播放
      ↓
   ┌─ 拦截到本课时 setContentFinished ──→ 视频任务完成（不等 ended）
   │                                        ↓
视频 ended                                   ↓
   │                                        ↓
   └─ 未拦截到信号 → 重播（上限 3 次）──────┘
                                            ↓
                          课后题：作答 → 提交 → 「继续挑战」→ 新题
                            ↓ 新题响应 completedFlag=true → 提交后结束
                                            ↓
                    按 config.interval 延迟 → 整页跳转下一课时（或毕业闭环）
```

### 迭代 2 需求

#### Requirement: 视频完成以平台信号为准

系统 SHALL 以拦截到本课时的 `setContentFinished` 响应作为视频任务完成的确认信号；
`ended` 仅触发重播复查，不再直接标记完成。

#### Scenario: 播放中拦截到信号

- **WHEN** 视频播放过程中（含中段）站点发送本课时 setContentFinished 且响应 200
- **THEN** 视频任务立即标记完成并推进到课后题

#### Scenario: 播完未拦截到信号

- **WHEN** 视频触发 ended 但未拦截到 setContentFinished
- **THEN** 自动重播（从头完整播放），不写完成标记、不推进

#### Scenario: 重播熔断

- **WHEN** 连续重播达到上限（3 次）仍未拦截到信号
- **THEN** 停止重播并输出错误日志，走任务集既有兜底（标记 + 整页重载自愈，服务端状态为准）

#### Requirement: 课后题按 completedFlag 精确推进

系统 SHALL 在 `video/question` 响应 `completedFlag === true` 时，于该题提交后结束课后题任务；
非结束题提交后 SHALL 自动点击「继续挑战」拉取下一题。

#### Scenario: 最后一题

- **WHEN** 新拉取题目的响应 completedFlag === true 且该题已提交
- **THEN** quiz 任务结束，按 config.interval 延迟后整页跳转下一课时

### 迭代 2 新增 Assumption

| # | 待验证项 | 验证方式 | 兜底方案 |
|---|----------|----------|----------|
| 6 | 「继续挑战」按钮 DOM 结构与文本 | 实测抓取 | 按文本"继续挑战"遍历可点击元素；找不到时退回既有 idle 轮次启发式 |
| 7 | setContentFinished URL 中 sectionId 与 study URL lessonId 恒等 | 抓包比对（实测样例一致） | 回调兜底匹配其余课时特征；匹配失败仅告警不误标 |

### 迭代 2 Impact

- Affected code：`src/mooc/sanjieke/{video,quiz,study,constants,types}.ts`
- 不触碰 zsgl 任何文件（含 video.ts —— 上轮误改已修复，本轮零 zsgl 改动）
- 不新增配置项（复用既有 `interval` 跳转间隔）
