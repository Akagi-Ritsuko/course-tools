# Checklist

## 浮窗开关（show_float_panel）
- [x] config.ts 存在 show_float_panel 配置项（checkbox，默认 true），标题/描述准确
- [x] show_float_panel=false 时 PageLog 不创建 tools-logger-panel，Info 日志回落 console（buildPanel 顶部守卫 + 既有 else 分支，代码核验）
- [x] 面板关闭不影响 LogRecorder 崩溃日志落地与 console 日志输出（守卫仅跳过面板 DOM，recorder 逻辑未动）
- [x] 点击 x 持久化 show_float_panel=false，刷新/换页后浮窗不再出现（onclick 追加 SetConfig，代码核验；实机确认归 Task 5）
- [x] DailyPointsFloatingPanel（每日积分面板）行为不受影响（dailyPointsPanel.ts 零改动）

## 考试自动勾选（exam_auto_select）
- [x] config.ts 存在 exam_auto_select 配置项（checkbox，默认 false），标题/描述准确
- [x] exam_auto_select=false 时完全旁路：不注册 MutationObserver、无任何 DOM 操作，现状行为零变化（setupAutoSelectObserver 门控 + autoSelectTick 每次重读配置）
- [x] MutationObserver 带防抖（300ms，TimerManager 覆盖语义），覆盖下一题/上一题/题号导航三种换题路径（挂 document.body、匹配限定 MuiPaper-root；SPA 重建免重挂，理由记入 03 §9.7）
- [x] crackQuestions 批次链尾回写答案后补勾当前屏显题（链尾 fire-and-forget autoSelectTick(true)，exam.ts L1088）
- [x] 题面匹配：stripHtml + 空白归一化，唯一命中才勾，零/多命中跳过 + Warn（matchOnScreenQuestions + getQuestionMatchKeys 双键）
- [x] 差集幂等勾选：已满足的题不重复切换；多选题取消非目标选中项（applyAutoSelect 差集计算 + 已满足 Debug 不动作）
- [x] 未破解题（isCorrect 全 N）不勾选任何选项（targetSections 为空时 Info 提示即返回，绝不点击）
- [x] 勾选后回读 DOM 状态验证，失败降级 log.Info 面板答案提示 + Warn（VERIFY_DELAY_MS 后回读三级状态源）
- [x] S/T 按单选、M 按多选语义正确（isMulti 分支：S/T 仅点目标，M 先取消后勾选）
- [x] 不触碰交卷监听、任务链、答案导出、破解策略逻辑（diff 仅 exam.ts 追加式修改 + constants.ts/config.ts/log.ts，ZsglQuestionTask/OperateCard/answerMessage/exportExamAnswers/策略文件零改动）
- [x] MUI 选项选择器集中在 constants.ts 定义并注释"待实机校准"（EXAM_AUTO_SELECT.OPTION_SELECTORS 等）

## 工程与文档
- [x] 全部改动在独立 feature 分支上（feature/exam-autoselect-panel-toggle，未做提交，master/zsglTools-master 无本次改动）
- [x] npm run build 成功（webpack compiled successfully）
- [x] npx tsc --noEmit 无新增基线外错误（对照 HEAD：exam.ts 656/681、log.ts 144 均为既有基线 implicit-any，行号偏移已核实）
- [x] docs/zsgl/cn/03-详细设计.md 已同步（§9.7 考试答案自动勾选 + §12 新常量）且文档变更日志留痕（1.26.1013.1）
- [x] docs/zsgl/cn/04-数据库设计.md 已补 2 个配置键（zsgl_show_float_panel / zsgl_exam_auto_select）且文档变更日志留痕（1.26.1013.1）
- [x] docs/zsgl/cn/07-部署手册与用户手册.md、08-用户指导.md 已补配置说明（§4 配置项表 / §四 速查表 + 使用提示）
- [x] docs/changelog.md（2026-10-13）、docs/tasks.md（T-022）已留痕
- [x] 实机回归清单（Task 5 五场景 + 三场景）已交付用户（随本次总结交付，执行结果待回填）
