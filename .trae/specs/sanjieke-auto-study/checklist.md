# Checklist — sanjieke-auto-study

## A. 文档验收（M1，本轮）

- [x] `.trae/specs/sanjieke-auto-study/` 三件套齐备（spec.md / tasks.md / checklist.md），格式与 `add-knowledge-task/` 惯例一致
- [x] 需求决议 1：课后题自动答题已写入 spec（question 接口自带 `answer`；仅客观题；`quiz_auto_answer` 开关）
- [x] 需求决议 2：方案 A + 学习地图页驱动已写入 spec（zsgl 详情页自动点「立即学习」+ 轮询；复用 `notifyStudyMapCourseComplete` 闭环）
- [x] 需求决议 3：倍速已写入 spec（`video_multiple` 配置 + `ratechange` 回置策略）
- [x] 需求决议 4：本轮零代码改动（仅文档 + TODO.md 登记）
- [x] 需求决议 5：首版不含三节课考试已写入 spec（范围排除项）
- [x] tasks.md 文件路径引用与 spec What Changes 完全一致
- [x] 跨域通信决策已写入 spec（不依赖跨域 localStorage；zsgl 服务端状态轮询为准；`window.close()` 兜底）
- [x] `record_duration` 为页面停留心跳（10s 固定、与播放无关）的实测结论已写入 spec
- [x] xgplayer `<video>` 懒创建的应对策略已写入 spec（轮询等待 + 起播锚点）
- [x] 待开发期验证项（Assumptions）均有兜底方案
- [x] 里程碑 M1~M6 划分完整，M3/M4 并行关系与依赖链明确
- [x] 新特性已登记 `docs/tasks.md`（T-016），`src/mooc/zsgl/TODO.md` 未改动（其顶部声明不再更新）
- [x] 除新增文档与 `docs/tasks.md` 登记行外无任何代码变更

## B. 实现验收（M2~M6 编码轮次逐项勾验）

> **2026-09-22**: M2~M6 代码已全部落地，`npm run build` 通过。
> 另：修复了两处**既有**（与本次改动无关的）jest 编译错误（`internal/utils/message.ts` 死分支缺 super、
> `internal/utils/utils.ts` resolve 缺实参，均为运行时等价修复），`npm test` 恢复可用并通过（2 套件 9 用例），
> 为内部工具链（含 sanjieke 复用的 hookHttpRequest 基础设施）提供回归证据。
> 以下勾验项需加载扩展后在真实三节课/zsgl 页面实测（与 spec Assumptions #1~#5 一并验证），
> 实测通过后逐项勾选；当前仅构建项可勾。

### M2 平台接入骨架

- [ ] 三节课页面（`lzlj.b.sanjieke.cn/study/*`）注入扩展脚本，控制台出现平台识别日志
- [ ] zsgl 页面注入行为不受影响（回归）
- [ ] popup 出现"三节课"tab，含 `auto`/`video_multiple`/`video_mute`/`quiz_auto_answer` 四项
- [ ] 配置读写落盘为 `sanjieke_` 前缀 key，与 zsgl 配置互不干扰
- [x] 构建无错误

### M3 视频挂机

- [ ] 等待 `<video>` 懒创建后正确挂载监听（无"元素不存在"报错）
- [ ] 自动起播成功（`.xgplayer-play` 点击，兜底 `video.play()`）
- [ ] 倍速设置生效且被重置后自动回置
- [ ] 静音设置生效
- [ ] 切窗/后台标签页不中断播放（或按熔断策略恢复）
- [ ] 暂停风暴熔断生效（60s 内暂停超 8 次停止自动恢复并输出日志）
- [ ] 课时播放结束自动推进下一课时
- [ ] `Stop()`/`runCleanup()` 后监听器/定时器零泄漏

### M4 课后题自动答题

- [ ] questions 接口响应被正确捕获并缓存（含 `answer`）
- [ ] `ai-quiz` 出现时自动选中与 `answer` 匹配的选项
- [ ] 提交按钮自动点击，依 `nextFlag`/`completedFlag` 推进
- [ ] `quiz_auto_answer=false` 时不作答、不阻塞、有日志提示
- [ ] 无 `answer` 的开放性问题跳过且不阻塞

### M5 完成判定与串联闭环

- [ ] 三节课课程完成（graduated/全课时完成）被正确检测
- [ ] 三节课页面完成自动关闭
- [ ] zsgl 课程详情页轮询检测到三方课程完成并自动关页
- [ ] 学习地图页自动刷新并进入下一关/下一课程
- [ ] 「立即学习」在 auto 模式下被自动点击且不重复触发

### M6 稳定性与总体

- [ ] 各类失败有重试上限与熔断，无死循环请求/点击
- [ ] 日志分级清晰，可导出用于排查
- [ ] 一门完整三节课课程端到端串联实测通过
- [ ] zsgl 原有任务（video/knowledge/scorm/exam）回归正常
- [ ] 无控制台未捕获异常

### M7 迭代 2：平台完成信号确认与课后题精确推进（2026-09-22）

- [ ] 拦截到本课时 setContentFinished（含播放中段）→ 视频任务立即标记完成并推进（实测）
- [ ] ended 未拦截信号 → 自动重播，不写完成标记、不推进（实测）
- [ ] 进入页面 ended/is-replay 状态走重播链路（实测）
- [ ] 重播有 3 次熔断上限，超限走任务集自愈，无死循环（实测）
- [ ] 提交答案后自动点击「继续挑战」拉取下一题（实测）
- [ ] video/question 响应 completedFlag===true 的题提交后 quiz 任务结束（实测）
- [ ] 课时切换延迟使用 sanjieke interval 配置（分钟 ×60000）（实测）
- [x] 未实现秒过（代码中无主动构造/发送 setContentFinished 的逻辑，仅 hook 拦截）
- [x] 零 zsgl 文件改动（仅 src/mooc/sanjieke/*，git status 确认）
- [x] npm run build 通过；tsc --noEmit 对比基线无新增错误（仅 task.ts TS2551 既有项）
- [x] changelog.md / docs/tasks.md 已按 ai-collab.md 留痕
- [ ] 完整链路实测通过（播放 → 信号 → 答题 → 继续挑战 → 最后一题 → interval 切换下一课时）
