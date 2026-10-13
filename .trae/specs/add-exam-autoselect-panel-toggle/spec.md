# 考试答案自动勾选与浮窗开关迭代 Spec

> change-id: add-exam-autoselect-panel-toggle
> 前置：`.trae/specs/auto-answer-exam`（已完成的 API 破解迭代，其产出的 `questionList.isCorrect` 数据是本迭代的数据来源，不做修改）

## Why
两个用户诉求：① 页面上的"小工具通知条"浮窗（tools-logger-panel）无法永久关闭——x 按钮只对当前页生效，刷新/换页即回来；② 考试模块已能破解答案但仅做面板提示与 Markdown 导出，用户仍需对照答案手动逐题勾选。本迭代补齐"浮窗可永久关闭"与"答案自动勾选到页面选项"两个体验缺口。

## What Changes
- 新增配置项 `show_float_panel`（checkbox，默认 **true**）：关闭后 PageLog 不再创建 tools-logger-panel 浮窗；面板 x 关闭按钮点击后写配置持久化
- 新增配置项 `exam_auto_select`（checkbox，默认 **false**）：开启后考试模块将已破解答案自动勾选到页面选项 DOM
- exam.ts 新增自动勾选器：MutationObserver 换题检测 + 双向触发 + 归一化匹配 + 差集幂等勾选 + 勾后验证
- 全部改动在**独立 feature 分支**上实施（自 master 拉出）
- 文档同步：docs/zsgl/cn/03、04、07、08 + docs/changelog.md + docs/tasks.md

## Impact
- Affected specs: `auto-answer-exam`（只读其数据产出，无修改）
- Affected code:
  - `src/config.ts`（2 个新配置项）
  - `src/internal/utils/log.ts`（浮窗构建开关 + x 持久化）
  - `src/mooc/zsgl/exam.ts`（自动勾选器 + 双向触发接线）
  - `src/mooc/zsgl/constants.ts`（新增常量：防抖间隔、匹配超时、选择器候选）
  - `docs/zsgl/cn/03-详细设计.md`、`04-数据库设计.md`、`07-部署手册与用户手册.md`、`08-用户指导.md`

## ADDED Requirements

### Requirement: 浮窗显示配置（show_float_panel）
系统 SHALL 提供配置项 `show_float_panel`（type: checkbox，默认 true），控制"小工具通知条"浮窗（`.tools-logger-panel`）是否创建：
- 关闭时 PageLog 构造不执行 buildPanel，Info 日志回落 console（沿用现有 `if (this.el) ... else console.info` 分支）
- LogRecorder 崩溃日志落地、console 日志输出不受面板开关影响
- 作用范围仅 tools-logger-panel，**不影响** DailyPointsFloatingPanel（每日积分模式悬浮面板）
- 面板头部 x 关闭按钮点击后 SHALL 调用 `SetConfig("show_float_panel", "false")` 持久化，后续页面加载不再出现

#### Scenario: 配置关闭时进入页面
- **WHEN** show_float_panel=false 且进入任意 zsgl 页面
- **THEN** 页面上不出现 tools-logger-panel，Info 日志输出到 console，崩溃日志转存功能正常

#### Scenario: 点击 x 关闭
- **WHEN** 用户点击浮窗头部 x
- **THEN** 当前面板移除（现状行为保持），且 show_float_panel 持久化为 false，刷新/换页后浮窗不再出现

#### Scenario: 配置开启
- **WHEN** show_float_panel=true
- **THEN** 面板照常出现，行为与现状一致

### Requirement: 考试答案自动勾选（exam_auto_select）
系统 SHALL 提供配置项 `exam_auto_select`（type: checkbox，默认 **false**）。开启时，对考试页当前显示的题目，若该题已破解出正确答案（`sectionRespList` 中存在 `isCorrect === "Y"`），系统 SHALL 将正确选项自动勾选到页面选项 DOM。

#### Sub-Requirement: 换题检测（MutationObserver）
- SHALL 使用 MutationObserver 监听题面容器（`.MuiPaper-root` 范围）子树变化，配合防抖（约 300ms）后执行匹配
- SHALL 覆盖三种换题路径：下一题、上一题、题号直接导航；不依赖固定延迟

#### Sub-Requirement: 双向触发
- 正向：检测到题面变化 → 匹配 questionList → 答案已就绪则勾选
- 反向：`crackQuestions` 批次链尾答案回写后 → 检查当前屏显题是否刚获得答案 → 补勾（覆盖"用户翻题早于答案就绪"的漏勾场景）

#### Sub-Requirement: 题面匹配
- SHALL 使用 `stripHtml` + 空白归一化后比对 questionText 与屏显题面文本
- SHALL 仅在**唯一命中**时执行勾选；零命中/多命中跳过并 Warn（错匹配=勾错题的选项，必须防）

#### Sub-Requirement: 幂等勾选
- SHALL 比对当前选中集合与目标集合做差集：取消不在目标集合中的已选中项（多选场景，含服务端试探答案回显），勾选未选中的目标项；已满足则不动（防重复进入同一题反复切换）
- 题型语义：S/T 按单选处理（单选天然互斥），M 按多选处理
- SHALL 在勾选后回读 DOM 状态（`input.checked` / `aria-checked` / MUI 选中 class）验证；验证失败降级为面板答案提示（log.Info）并 Warn
- 勾选动作 SHALL NOT 误触 ZsglQuestionTask 交卷监听（该监听仅匹配"下一题/交卷"按钮文本，选项点击天然隔离）

#### Scenario: 答案就绪后勾选当前题
- **WHEN** exam_auto_select=true 且当前屏显题在 questionList 中唯一命中且已有 isCorrect="Y"
- **THEN** 页面选项被自动勾选为正确答案，日志记录勾选结果

#### Scenario: 翻到答案未就绪的题后答案到达
- **WHEN** 用户翻到某题时该题尚未破解完成，随后 crackQuestions 完成该题答案回写
- **THEN** 系统补勾当前屏显题，无需用户再翻页

#### Scenario: 未破解/匹配失败
- **WHEN** 屏显题无正确答案（isCorrect 全 N）或题面匹配零/多命中
- **THEN** 不勾选任何选项，Warn 日志提示，保留人工作答路径

#### Scenario: 配置关闭
- **WHEN** exam_auto_select=false
- **THEN** 行为与现状完全一致：不注册 MutationObserver、不做任何 DOM 操作，仅保留面板提示与导出

## Out of Scope
- 填空/简答等无选项题型（questionNodesAnswer 类）不做勾选
- 站点选项 DOM 结构、保存答案时机（点选项即存 vs 下一题统一存）、进题回显行为待实机确认；勾选器选择器按 MUI 标准结构实现并预留校准点（constants.ts 集中定义）
- 不改变破解策略、交卷流程、答案导出、任务链逻辑
