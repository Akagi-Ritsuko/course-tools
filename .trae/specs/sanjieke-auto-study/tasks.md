# Tasks — sanjieke-auto-study

> 里程碑对应关系见 spec.md「里程碑」。M1（本文档）已完成。
> 依赖：M2 → M3 → M5；M2 → M4 → M5；M5 → M6（M3 与 M4 可并行）。
>
> **2026-09-22 编码轮次（M2~M6）进展**：全部代码任务已实现，`npm run build` 通过。
> 标注"（实测）"的验证任务需浏览器实测（加载扩展后访问真实三节课/zsgl 页面），
> 与 spec「Assumptions」#1~#5 一并验证后勾选。

## M1 文档基线（本轮）

- [x] Task 1.1: 落地 `.trae/specs/sanjieke-auto-study/spec.md`
- [x] Task 1.2: 落地 `.trae/specs/sanjieke-auto-study/tasks.md`
- [x] Task 1.3: 落地 `.trae/specs/sanjieke-auto-study/checklist.md`
- [x] Task 1.4: 登记新特性至 `docs/tasks.md`（T-016；注：`src/mooc/zsgl/TODO.md` 顶部已声明"不再更新"，按项目约定登记于 tasks.md）

## M2 平台接入骨架（代码完成）

- [x] Task 2.1: manifest 注入三节课域名（`build/zsgl-tools/manifest.json`）
  - [x] SubTask 2.1.1: `content_scripts.matches` 新增 `*://lzlj.b.sanjieke.cn/*`
- [x] Task 2.2: 主世界注入匹配（`src/config.ts`）
  - [x] SubTask 2.2.1: `SystemConfig.match` 新增 sanjieke 域名注入正则
  - [x] SubTask 2.2.2: `SystemConfig.config` 新增 `sanjieke` 命名空间条目（title/description）
- [x] Task 2.3: 配置项定义（`src/config.ts`，popup 自动渲染）
  - [x] SubTask 2.3.1: `auto` checkbox（默认 true）
  - [x] SubTask 2.3.2: `video_multiple` text（默认 "1"）
  - [x] SubTask 2.3.3: `video_mute` checkbox（默认 true）
  - [x] SubTask 2.3.4: `quiz_auto_answer` checkbox（默认 true）
- [x] Task 2.4: 类型化配置访问（`src/internal/utils/config.ts`）
  - [x] SubTask 2.4.1: `ConfigItems` 接口新增 `quiz_auto_answer` 字段 + `ChromeConfigItems` getter（`toBool`）；auto/video_mute/video_multiple 沿用既有命名空间感知 getter（number 用 `parseFloat`）
- [x] Task 2.5: 新建 `src/mooc/sanjieke/constants.ts` 与 `types.ts`
  - [x] SubTask 2.5.1: URL 模式（`/study/0/{courseId}/{lessonId}`）、API 端点（`content/tree`、`questions`、`cert/graduated`、`record_duration` 说明见 spec）
  - [x] SubTask 2.5.2: DOM 选择器（`.content-video-main`、`.xgplayer-play`、`.quiz-submit-button`、`.quiz-list`、`[class*='ai-quiz']`）
  - [x] SubTask 2.5.3: 重试/轮询/熔断常量（复用 zsgl 数值风格）
  - [x] SubTask 2.5.4: `ContentTreeNode`、`QuestionInfo`（含 `answer`）、`LessonInfo`/`SanjiekeTaskInfo` 类型
- [x] Task 2.6: 新建 `src/mooc/sanjieke/platform.ts`
  - [x] SubTask 2.6.1: `SanjiekePlatform implements MoocFactory`，域名+路径识别，`SetNamespace("sanjieke")`
  - [x] SubTask 2.6.2: 返回 `SanjiekeStudy` 实例（完整实现，非骨架）
- [x] Task 2.7: 注册平台工厂（`src/internal/app/mooc.ts`）
  - [x] SubTask 2.7.1: `DefaultMoocFactory.CreateMooc()` 先 `ZsglPlatform`，未命中再 `SanjiekePlatform`
- [ ] Task 2.8: M2 验证（实测）
  - [ ] SubTask 2.8.1: 三节课页控制台出现平台识别日志（实测）
  - [ ] SubTask 2.8.2: popup 出现"三节课"tab 且配置项可读写（`sanjieke_` 前缀 key）（实测）
  - [x] SubTask 2.8.3: `npm run build` 无错误

## M3 视频挂机（代码完成）

- [x] Task 3.1: 新建 `src/mooc/sanjieke/video.ts`（`SanjiekeVideo` 课时任务）
  - [x] SubTask 3.1.1: 等待 xgplayer 注入 `<video>`（`.content-video-main video` 轮询 + `TimerManager`；含懒创建触发：先点击播放区锚点）
  - [x] SubTask 3.1.2: 起播：点击 `.xgplayer-play`，兜底 `video.play()`；先静音绕过自动播放策略
  - [x] SubTask 3.1.3: 应用倍速/静音配置；`ratechange`/`play`/`playing` 监听持续回置
  - [x] SubTask 3.1.4: 防暂停/防切屏：`setupVisibilitySpoof`/`setupSwitchScreenNeutralizer` 接入（study.Init 统一安装）；`pause` 自动恢复；暂停风暴熔断（60s/8 次上限）
  - [x] SubTask 3.1.5: `ended` → 写课时完成标记 → `callEvent("complete")` 推进下一课时
  - [x] SubTask 3.1.6: `Stop()`/`runCleanup()` 资源清理（监听器、定时器零泄漏）
- [x] Task 3.2: 课时任务列表（`src/mooc/sanjieke/study.ts`）
  - [x] SubTask 3.2.1: `SanjiekeStudy implements MoocTaskSet`：`Init/Stop/Next/SetTaskPointer`
  - [x] SubTask 3.2.2: hook `content/tree` 枚举课时 → 构建当前课时任务（已完成课时/有本域完成标记的课时不再构建）
  - [x] SubTask 3.2.3: 课时切换驱动：采用**整页跳转**至 `/study/0/{courseId}/{下一课时Id}`（比点击左侧列表项确定性更强，且每次跳转后任务集重建、状态自愈）；SPA 换课场景由 video/quiz 的 URL 一致性守卫兜底
- [ ] Task 3.3: M3 验证（实测）
  - [ ] SubTask 3.3.1: 单课时全自动播放至结束并推进下一课时（实测）
  - [ ] SubTask 3.3.2: 切窗/后台标签页播放不中断（或恢复）（实测）

## M4 课后题自动答题（代码完成）

- [x] Task 4.1: 新建 `src/mooc/sanjieke/quiz.ts`（`SanjiekeQuiz` 课后题任务）
  - [x] SubTask 4.1.1: hook `GET /study/0/{courseId}/questions` 响应，缓存题目与 `answer`（弹性提取顶层/data/body 数组）
  - [x] SubTask 4.1.2: `ai-quiz` 组件出现时自动选中正确项（按 `answer` 字母映射 `.quiz-list` 选项下标，多选择器兼容）
  - [x] SubTask 4.1.3: 点击 `.quiz-submit-button` 提交；以 DOM 状态（组件消失/题目切换）+ 轮次熔断驱动推进（响应 `nextFlag`/`completedFlag` 结构实测后可增强）
  - [x] SubTask 4.1.4: `quiz_auto_answer=false` 时仅日志提示，不阻塞课时推进；开放性问题（无 `answer`）跳过
- [ ] Task 4.2: M4 验证（实测）
  - [ ] SubTask 4.2.1: 选择题自动选中正确项、提交、进入下一节（实测）
  - [ ] SubTask 4.2.2: 无 answer 的题目不阻塞流程（实测）

## M5 完成判定与串联闭环（代码完成）

- [x] Task 5.1: 三节课侧完成检测（`src/mooc/sanjieke/study.ts`）
  - [x] SubTask 5.1.1: hook `cert/graduated` 响应判定毕业（弹性识别 graduated 字段）；`content/tree` 全课时完成兜底；本域完成标记齐全兜底
  - [x] SubTask 5.1.2: 完成后写完成标记（`sanjieke_course_complete_` + 日志）→ `window.close()`（失败仅告警，不影响 zsgl 侧闭环）
- [x] Task 5.2: zsgl 课程详情页三方课程分支（`src/mooc/zsgl/course.ts`）
  - [x] SubTask 5.2.1: 识别三方/混合课程（`courseFileArr` 含 `cwType === "URL"`）
  - [x] SubTask 5.2.2: `config.auto` 时轮询查找并自动点击「立即学习」（仅一次，`thirdPartyFlowStarted` 幂等）
  - [x] SubTask 5.2.3: 定时轮询 `queryCourseDetail`（默认 30s，`THIRD_PARTY_POLL_INTERVAL_MS`），全部 `hasLearned=1` → 走现有 `courseTaskComplete` 闭环（关页）
  - [x] SubTask 5.2.4: `factory.ts` 中 `URL` 类型日志消歧（三方分支已覆盖调度，不再输出"暂不支持"）
- [ ] Task 5.3: M5 验证（实测）
  - [ ] SubTask 5.3.1: 全课程完成后三节课页自动关闭（实测）
  - [ ] SubTask 5.3.2: zsgl 课程详情页检测到完成并自动关页（实测）
  - [ ] SubTask 5.3.3: 学习地图页自动 reload 并进入下一关（复用既有 `findNextLevelAndStart`）（实测）

## M6 稳定性与验收

- [x] Task 6.1: 稳定性
  - [x] SubTask 6.1.1: 熔断策略统一（播放失败重试上限 10 次、暂停风暴 60s/8 次、答题轮次熔断、课时重试上限 3 次、树响应超时 30s）
  - [x] SubTask 6.1.2: 日志规范（统一 `[三节课]`/`[三节课视频]`/`[三节课课后题]`/`[三方课程]` 前缀分级输出，`Application.App.log` 分级）
  - [x] SubTask 6.1.3: `Stop()` 清理审计：托管监听器（cleanupFns）/定时器（TimerManager）统一清理，整页跳转推进不累积实例
- [ ] Task 6.2: 实测验收（实测）
  - [ ] SubTask 6.2.1: 按 `checklist.md` 实现部分逐项勾验（实测）
  - [ ] SubTask 6.2.2: 一门完整三节课课程端到端串联实测（含跨课程推进）（实测）
  - [ ] SubTask 6.2.3: 更新本文件与 `checklist.md` 勾选状态，登记遗留问题（实测后收尾）

# Task Dependencies

- Task 2.5/2.6 依赖 Task 2.1~2.4（注入与配置先行，否则页面脚本不运行）
- Task 3.x 依赖 Task 2.5/2.6（常量/类型/平台骨架）
- Task 4.x 依赖 Task 2.5/2.6，可与 Task 3.x 并行
- Task 5.1 依赖 Task 3.x/4.x（需先有课时推进与答题）
- Task 5.2 依赖 Task 2.1（zsgl 侧改动独立于三节课页面任务，可提前开发）
- Task 6.x 依赖 Task 5.x

## M7 迭代 2：平台完成信号确认与课后题精确推进（2026-09-22）

> spec 见「迭代 2」章节。**明确排除：不实现秒过功能**。
> 背景：错误会话曾把本迭代误做到 zsgl/video.ts（3172a7b 已恢复），本轮仅改 sanjieke 模块。

- [x] Task 7.1: video.ts 平台完成信号确认（`src/mooc/sanjieke/video.ts`）
  - [x] SubTask 7.1.1: `Start()` 注册 `hookHttpRequest("setContentFinished")` 钩子，回调按 URL `/content/{lessonId}/setContentFinished` 过滤本课时
  - [x] SubTask 7.1.2: 信号命中 → 写课时完成标记 + 完成 + `callEvent("complete")`（幂等，与既有完成路径收敛为单一收口函数；播放中段触发同样生效）
  - [x] SubTask 7.1.3: `ended` 未拦截信号 → 重播（currentTime=0 + clickPlay），ended 监听去 `{once:true}`；重播上限 `VIDEO_REPLAY_MAX=3`（constants 新增），超限输出错误日志并按任务集既有兜底推进
  - [x] SubTask 7.1.4: `Stop()` 移除钩子（`removeHttpRequestHook`）
- [x] Task 7.2: quiz.ts 精确推进（`src/mooc/sanjieke/quiz.ts` + `types.ts` + `constants.ts`）
  - [x] SubTask 7.2.1: `QuestionInfo` 增加可选 `completedFlag` 字段；`video/question` 钩子解析并缓存（弹性提取，缺省 undefined）（注：types.ts 既有字段已覆盖，无需改动）
  - [x] SubTask 7.2.2: 提交后查找「继续挑战」按钮并点击（常量 `CONTINUE_CHALLENGE: "继续挑战"`，文本遍历匹配）；找不到时退回既有 idle 轮次启发式
  - [x] SubTask 7.2.3: `completedFlag === true` 的题提交成功后 → `finish()`（优先级高于 idle 轮次判定；提交按钮不可用则下轮重试）
- [x] Task 7.3: study.ts 课时切换延迟改用 `config.interval`（分钟 ×60000；`LESSON_TRANSITION_DELAY_MS` 常量保留给非用户配置路径）
- [x] Task 7.4: 构建验证：`npm run build` 通过；`npx tsc --noEmit` 对比基线无新增错误
- [x] Task 7.5: ai-collab 留痕：`docs/changelog.md` 追加迭代记录；`docs/tasks.md` T-016 备注本轮迭代
- [ ] Task 7.6: 实测验证（用户浏览器）：播放 → 中段/末尾信号确认 → 答题 → 继续挑战 → 最后一题 → 按 interval 切换下一课时

# M7 Task Dependencies

- Task 7.1 / 7.2 / 7.3 相互独立，可并行实施
- Task 7.4 依赖 7.1~7.3 全部完成
- Task 7.5 依赖 7.4；Task 7.6 依赖 7.5

## M8 迭代 3：图文（article）课时自动挂机（2026-09-23）

> spec 见「迭代 3」章节。调研依据：内置浏览器实测（滚动容器/主线程阻塞/record_duration）+ 用户 curl 实测完成请求 `POST /study/0/{courseId}/{lessonId}/finished`。

- [ ] Task 8.1: constants.ts 图文参数与类型（`src/mooc/sanjieke/constants.ts`）
  - [ ] SubTask 8.1.1: 新增选择器 `ARTICLE_SCROLL_CONTAINER: ".right-content"`（含注释：内部容器滚动，非 window）
  - [ ] SubTask 8.1.2: 新增滚动常量：`ARTICLE_SCROLL_STEP_PX`(600)、`ARTICLE_SCROLL_INTERVAL_MS`(300)、`ARTICLE_SCROLL_MAX_STEPS`(120)、`ARTICLE_FINISH_WAIT_TIMEOUT_MS`(30000)
  - [ ] SubTask 8.1.3: 新增 `ARTICLE_CONTENT_TYPES: ["article", "doc", "text"]` 候选（实现期以 study Warn 日志实测 type 值校准，Assumption #10）
- [ ] Task 8.2: 新建 article.ts（`src/mooc/sanjieke/article.ts`）
  - [ ] SubTask 8.2.1: `SanjiekeArticle extends SanjiekeTaskBase`，`Type(): "video"`（沿用任务类型通道）；`Init()` 定位滚动容器，缺失 reject
  - [ ] SubTask 8.2.2: `Start()` 注册 `hookHttpRequest("/finished")` 钩子，按 URL `/content/{lessonId}/finished` 过滤本课时（对称 video.ts 7.1.1）；命中且响应 200 → `finishArticle()` 收口
  - [ ] SubTask 8.2.3: 温和分步滚动：每步 scrollTop += STEP_PX + dispatch scroll 事件，间隔 INTERVAL_MS，最多 MAX_STEPS；触底判定（scrollTop+clientHeight >= scrollHeight-2）
  - [ ] SubTask 8.2.4: 触底后轮询等待 finished 钩子命中，超时 ARTICLE_FINISH_WAIT_TIMEOUT_MS → 兜底收口（写课时完成标记，Warn 说明走兜底）
  - [ ] SubTask 8.2.5: `finishArticle()` 幂等收口（写标记 + callEvent("complete")，对齐 video.ts 7.1.2 模式）；`Stop()` 移除钩子 + 清理定时器监听器
- [ ] Task 8.3: study.ts 类型分发扩展（`src/mooc/sanjieke/study.ts`）
  - [ ] SubTask 8.3.1: `isAutoStudyType` 白名单并入 `ARTICLE_CONTENT_TYPES`（或新增 isArticleType 辅助）
  - [ ] SubTask 8.3.2: `buildCurrentLessonTasks` 任务工厂按类型分发：video → `SanjiekeVideo`，图文类型 → `SanjiekeArticle`，quiz 统一追加（保留 [task, quiz] 结构）
  - [ ] SubTask 8.3.3: DOM 特征兜底判定：类型未知但当前页无 video 且存在 `.right-content` 图文滚动容器 → 按图文处理（Assumption #10 兜底）
- [ ] Task 8.4: 构建验证：`npm run build` 通过；`npx tsc --noEmit` 对比基线无新增错误
- [ ] Task 8.5: ai-collab 留痕：`docs/changelog.md` 追加迭代记录；`docs/tasks.md` T-016 备注迭代 3
- [ ] Task 8.6: 实测验证（用户浏览器）：图文课时自动滚动到底 → finished 钩子命中（或兜底）→ 完成推进；校准 tree type 实际值回填白名单（Assumption #10/#11/#12）

# M8 Task Dependencies

- Task 8.2 依赖 Task 8.1（常量先行）
- Task 8.3 依赖 Task 8.1（类型候选）
- Task 8.4 依赖 8.2/8.3；Task 8.5 依赖 8.4；Task 8.6 依赖 8.5

# 实测记录（2026-09-22 用户浏览器实测）

- 三节课学习页 URL 实测 `/study/0/34009243/36727951`;`window.__moocInstances__` 为空 →
  **发现并修复主因**:`build/cxmooc-tools/manifest.json` 缺 sanjieke 域名(webpack 只输出到该目录,
  用户加载的扩展内容脚本未注入三节课页);两个 build 目录 manifest 均已补齐
- xgplayer 起播入口实测:`.xgplayer-play` 在 `<video>` 懒注入前即存在,点击即触发注入并起播
  (实测 paused=false、readyState=4、时长 664s);`xg-poster` 点击无效,仅作兜底选择器保留
- 课时列表 DOM 实测:`.menu-container .chapter-container` + `.node-item[node-id]`;
  完成标记 `chapter-finish`(容器 class)/`.status-con.section-finish`(节点内);解析逻辑实测吻合
  (21 课时,课时 1 finished=true,首个未完成=当前 URL 课时)
- study.ts 已接入 DOM 课时列表为兜底数据源(与 content/tree 合并,DOM 顺序为准、完成状态取并集),
  进入页面对齐首个未完成课时的跳转逻辑实测吻合
- **2026-09-22 外部 Chrome 实测(用户日志)**:串联链路全通 —— 平台识别/任务构建/视频播放/
  ended→标记→taskComplete→quiz 跳过→切换下一课时,站点自身在 80s 处即调 setContentFinished
  (站点按观看区间判定完成,非强制全片播放);课时切换实测正常
- **黑屏转圈根因(实测复现)**:点 `.xgplayer-play` 仅起播媒体层,xgplayer UI 停留 `xgplayer-nostart`
  (海报/加载覆盖层盖住画面,currentTime 照常前进);正确入口是 `.xgplayer-start` 大按钮覆盖层
  (点击后 nostart 解除、覆盖层关闭、正常渲染,实测 currentTime 27.8s 前进)。
  video.ts 起播优先级已改为 start 大按钮 > play 按钮 > poster > video.play()
- **questions 解析增强**:`/questions` 钩子会误命中 AI 视频问答接口(questions_and_answers 等),已过滤;
  真实课后题响应包裹结构未实测(站点 API 需 API key 无法直接抓取),解析改为递归按特征字段
  (question+options/answer)识别题目数组,未识别时日志输出响应预览(前 300 字符)便于下轮校准
- **2026-09-22 内置浏览器深挖(lesson 36727952)**:
  - **真正的课后题来源是 AI 视频问答单题接口** `GET /ai/0/{courseId}/video/question?videoId=&sectionId=&retryFlag=`
    (响应 `{code,msg,data:{id,type,question,options,answer,analysis,nextFlag,completedFlag}}`,data 直接是单题对象,
    与 spec 样例一致);课程级 `/study/0/{courseId}/questions` 实测返回 `data.questions: []`(空);
    该单题接口 URL 不含 "/questions",此前钩子根本没挂上 → 缓存恒空 → 跳过作答(用户报告的根因)。
    已新增 VIDEO_QUESTION 钩子(URL 含 "video/question",回调过滤 questions_and_answers 噪声),
    解析器支持单题对象形态;缓存放宽为"最后一次响应为准"(站点每课时整页加载,单题即当前题)
  - **作答 DOM 实测**:`.quiz-list > li`(无 class,文本自带字母前缀如 "B.紧急与重要"),点击 li 后
    li 获得selected class、`.quiz-submit-button` 由 disabled 变可用 —— 实测吻合。
    选项匹配改为文本前缀优先("A."/"A、"/裸字母)+ 字母下标兜底;提交前校验按钮 disabled 状态
  - 站点请求头实测需 `sjk-apikey` + Bearer token(钩子消费页面自身响应,无需自行携带,不受影响)
  - 新增 sanjieke「跳转间隔」配置项(key: interval, 默认 0.1 分 = 6 秒,支持小数;
    MoocLauncher 的 taskComplete 等待读取 config.interval,此前未配置时走共享 getter 的 0.1 兜底)
- **2026-09-22 第二轮用户反馈落地**:
  1. 标记校验:每次页面加载首个数据到达时(tree/DOM 合并)以"是否已完成"字段为准同步本域标记
     (已完成→写标记;未完成→清除标记,防止 ended 误标导致跳过实际未完成课时;仅首次同步,
      防后续树刷新覆盖本页新完成标记) —— utils 新增 clearLessonDoneMark
  2. ended 链路改为"先答题、无题才跳转":quiz 任务入口先查缓存题目(无题立即完成,不空等组件 25s);
     答题循环每轮重读缓存(提交后站点才拉取/渲染下一题),连续 3 轮无新题才收尾,硬上限 30 轮
  3. 播放倍速配置项加提示:建议最高 2 倍速,更高倍速可能无法累计有效完成时长(description+prompt)
  4. 重播状态处理:视频 ended/is-replay(此前看过但时长不足)不再直接判完成,
     重新完整播放,由重播结束后的 ended 事件驱动完成判定

# 遗留问题（实测后处理）

1. `content/tree`/`cert/graduated` 响应体真实字段名未实测(代码已做多字段弹性兼容 +
   DOM 课时列表兜底 + 本域标记兜底,见 spec Assumption #1;DOM 兜底已实测,树字段不再阻塞);
2. 课后题 `ai-quiz` 选项 DOM 结构未实测(代码已做多选择器兼容),提交响应的 `nextFlag`/`completedFlag` 驱动可在实测后增强;
3. 「立即学习」点击行为（当前 tab or 新 tab）待实测（Assumption #3，闭环不依赖 `window.close()`）；
4. zsgl `queryCourseDetail` 对三方课程 `hasLearned` 回写时延待实测（轮询间隔 30s 可调常量）。
