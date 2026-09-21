# Tasks — sanjieke-auto-study

> 里程碑对应关系见 spec.md「里程碑」。M1（本文档）已完成；M2~M6 为编码轮次任务，全部未勾选。
> 依赖：M2 → M3 → M5；M2 → M4 → M5；M5 → M6（M3 与 M4 可并行）。

## M1 文档基线（本轮）

- [x] Task 1.1: 落地 `.trae/specs/sanjieke-auto-study/spec.md`
- [x] Task 1.2: 落地 `.trae/specs/sanjieke-auto-study/tasks.md`
- [x] Task 1.3: 落地 `.trae/specs/sanjieke-auto-study/checklist.md`
- [x] Task 1.4: 登记新特性至 `docs/tasks.md`（T-016；注：`src/mooc/zsgl/TODO.md` 顶部已声明"不再更新"，按项目约定登记于 tasks.md）

## M2 平台接入骨架

- [ ] Task 2.1: manifest 注入三节课域名（`build/zsgl-tools/manifest.json`）
  - [ ] SubTask 2.1.1: `content_scripts.matches` 新增 `*://lzlj.b.sanjieke.cn/*`
- [ ] Task 2.2: 主世界注入匹配（`src/config.ts`）
  - [ ] SubTask 2.2.1: `SystemConfig.match` 新增 sanjieke 域名注入正则
  - [ ] SubTask 2.2.2: `SystemConfig.config` 新增 `sanjieke` 命名空间条目（title/description）
- [ ] Task 2.3: 配置项定义（`src/config.ts`，popup 自动渲染）
  - [ ] SubTask 2.3.1: `auto` checkbox（默认 true）
  - [ ] SubTask 2.3.2: `video_multiple` text（默认 "1"）
  - [ ] SubTask 2.3.3: `video_mute` checkbox（默认 true）
  - [ ] SubTask 2.3.4: `quiz_auto_answer` checkbox（默认 true）
- [ ] Task 2.4: 类型化配置访问（`src/internal/utils/config.ts`，按需）
  - [ ] SubTask 2.4.1: `ConfigItems` 接口新增字段 + `ChromeConfigItems` getter（boolean 用 `toBool`，number 用 `parseFloat`）
- [ ] Task 2.5: 新建 `src/mooc/sanjieke/constants.ts` 与 `types.ts`
  - [ ] SubTask 2.5.1: URL 模式（`/study/0/{courseId}/{lessonId}`）、API 端点（`content/tree`、`questions`、`cert/graduated`、`record_duration`）
  - [ ] SubTask 2.5.2: DOM 选择器（`.content-video-main`、`.xgplayer-play`、`.quiz-submit-button`、`.quiz-list`、课时列表）
  - [ ] SubTask 2.5.3: 重试/轮询/熔断常量（复用 zsgl 数值风格）
  - [ ] SubTask 2.5.4: `ContentTreeNode`、`QuestionInfo`（含 `answer`）、`TaskInfo` 类型
- [ ] Task 2.6: 新建 `src/mooc/sanjieke/platform.ts`
  - [ ] SubTask 2.6.1: `SanjiekePlatform implements MoocFactory`，域名+路径识别，`SetNamespace("sanjieke")`
  - [ ] SubTask 2.6.2: 返回 `SanjiekeStudy` 实例（先返回骨架）
- [ ] Task 2.7: 注册平台工厂（`src/internal/app/mooc.ts`）
  - [ ] SubTask 2.7.1: `DefaultMoocFactory.CreateMooc()` 先 `ZsglPlatform`，未命中再 `SanjiekePlatform`
- [ ] Task 2.8: M2 验证
  - [ ] SubTask 2.8.1: 三节课页控制台出现平台识别日志
  - [ ] SubTask 2.8.2: popup 出现"三节课"tab 且配置项可读写（`sanjieke_` 前缀 key）
  - [ ] SubTask 2.8.3: `npm run build`（或项目构建命令）无错误

## M3 视频挂机

- [ ] Task 3.1: 新建 `src/mooc/sanjieke/video.ts`（`SanjiekeVideo` 课时任务）
  - [ ] SubTask 3.1.1: 等待 xgplayer 注入 `<video>`（`.content-video-main video` 轮询 + `TimerManager`）
  - [ ] SubTask 3.1.2: 起播：点击 `.xgplayer-play`，兜底 `video.play()`；先静音绕过自动播放策略
  - [ ] SubTask 3.1.3: 应用倍速/静音配置；`ratechange`/`play`/`playing` 监听持续回置（参考 `src/mooc/zsgl/video.ts:58-89` 半自动 v4 策略）
  - [ ] SubTask 3.1.4: 防暂停/防切屏：`setupVisibilitySpoof` 等工具接入；`pause` 事件自动恢复；暂停风暴熔断（60s/8 次上限）
  - [ ] SubTask 3.1.5: `ended` → `callEvent("taskComplete")` 推进下一课时
  - [ ] SubTask 3.1.6: `Stop()`/`runCleanup()` 资源清理（监听器、定时器、保活音频）
- [ ] Task 3.2: 课时任务列表骨架（`src/mooc/sanjieke/study.ts`）
  - [ ] SubTask 3.2.1: `SanjiekeStudy implements MoocTaskSet`：`Init/Stop/Next/SetTaskPointer`
  - [ ] SubTask 3.2.2: hook `content/tree` 枚举课时 → 构建 `SanjiekeVideo` 任务列表（已学课时 `Done()=true`）
  - [ ] SubTask 3.2.3: 课时切换驱动（点击左侧课时列表项或跟随播放器自动连播，实测取更稳方案）
- [ ] Task 3.3: M3 验证
  - [ ] SubTask 3.3.1: 单课时全自动播放至结束并推进下一课时
  - [ ] SubTask 3.3.2: 切窗/后台标签页播放不中断（或恢复）

## M4 课后题自动答题

- [ ] Task 4.1: 新建 `src/mooc/sanjieke/quiz.ts`（`SanjiekeQuiz` 课后题任务）
  - [ ] SubTask 4.1.1: hook `GET /study/0/{courseId}/questions` 响应，缓存题目与 `answer`
  - [ ] SubTask 4.1.2: `ai-quiz` 组件出现时自动选中正确项（按 `answer` 匹配 `.quiz-list` 选项）
  - [ ] SubTask 4.1.3: 点击 `.quiz-submit-button` 提交；依据响应 `nextFlag`/`completedFlag` 推进
  - [ ] SubTask 4.1.4: `quiz_auto_answer=false` 时仅日志提示，不阻塞课时推进；开放性问题跳过策略
- [ ] Task 4.2: M4 验证
  - [ ] SubTask 4.2.1: 选择题自动选中正确项、提交、进入下一节
  - [ ] SubTask 4.2.2: 无 answer 的题目不阻塞流程

## M5 完成判定与串联闭环

- [ ] Task 5.1: 三节课侧完成检测（`src/mooc/sanjieke/study.ts`）
  - [ ] SubTask 5.1.1: hook `cert/graduated` 响应判定毕业；`content/tree` 全课时完成兜底
  - [ ] SubTask 5.1.2: 完成后写完成标记（日志/`localStorage` 本域标记）→ `window.close()`
- [ ] Task 5.2: zsgl 课程详情页三方课程分支（`src/mooc/zsgl/course.ts`）
  - [ ] SubTask 5.2.1: 识别三方/混合课程（`queryCourseDetail` 数据特征）
  - [ ] SubTask 5.2.2: `config.auto` 时自动点击「立即学习」打开三节课页
  - [ ] SubTask 5.2.3: 定时轮询 `queryCourseDetail`（默认 30s，可配），全部 `hasLearned=1` → 走现有 `courseTaskComplete` 闭环（关页）
  - [ ] SubTask 5.2.4: `factory.ts` 中 `URL`/三方类型从"暂不支持 return null"调整为可调度（若课程详情页分支已覆盖则仅移除歧义日志）
- [ ] Task 5.3: M5 验证
  - [ ] SubTask 5.3.1: 全课程完成后三节课页自动关闭
  - [ ] SubTask 5.3.2: zsgl 课程详情页检测到完成并自动关页
  - [ ] SubTask 5.3.3: 学习地图页自动 reload 并进入下一关（复用 `findNextLevelAndStart`）

## M6 稳定性与验收

- [ ] Task 6.1: 稳定性
  - [ ] SubTask 6.1.1: 熔断策略统一（播放失败重试上限、暂停风暴、元素查找超时）
  - [ ] SubTask 6.1.2: 日志规范（`Application.App.log` 分级，关键字段便于 `__toolLogExport` 风格导出排查）
  - [ ] SubTask 6.1.3: `Stop()` 清理审计：监听器/定时器/音频零泄漏
- [ ] Task 6.2: 实测验收
  - [ ] SubTask 6.2.1: 按 `checklist.md` 实现部分逐项勾验
  - [ ] SubTask 6.2.2: 一门完整三节课课程端到端串联实测（含跨课程推进）
  - [ ] SubTask 6.2.3: 更新本文件与 `checklist.md` 勾选状态，登记遗留问题

# Task Dependencies

- Task 2.5/2.6 依赖 Task 2.1~2.4（注入与配置先行，否则页面脚本不运行）
- Task 3.x 依赖 Task 2.5/2.6（常量/类型/平台骨架）
- Task 4.x 依赖 Task 2.5/2.6，可与 Task 3.x 并行
- Task 5.1 依赖 Task 3.x/4.x（需先有课时推进与答题）
- Task 5.2 依赖 Task 2.1（zsgl 侧改动独立于三节课页面任务，可提前开发）
- Task 6.x 依赖 Task 5.x
