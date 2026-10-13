# Tasks

- [x] Task 0: 创建独立 feature 分支
  - [x] SubTask 0.1: 自 master 拉出 feature 分支（如 `feature/exam-autoselect-panel-toggle`），迭代全程在该分支进行

- [x] Task 1: 浮窗开关（show_float_panel，默认 true）
  - [x] SubTask 1.1: `src/config.ts` zsgl 配置块新增 `show_float_panel`（checkbox，默认 true，描述："是否显示页面上的小工具通知条浮窗"）
  - [x] SubTask 1.2: `src/internal/utils/log.ts` buildPanel 前读配置，false 则跳过面板创建（Info 回落 console；LogRecorder 与 console 日志不受影响）
  - [x] SubTask 1.3: x 关闭按钮点击时 `SetConfig("show_float_panel", "false")` 持久化（保留现有移除面板逻辑）
  - 验证：build 成功；实机——默认进页浮窗出现；配置关闭后刷新不出现；点 x 后刷新不再出现

- [x] Task 2: 考试自动勾选配置与核心逻辑（exam_auto_select，默认 false）
  - [x] SubTask 2.1: `src/config.ts` zsgl 配置块新增 `exam_auto_select`（checkbox，默认 false，描述："考试时自动勾选已破解题目的正确选项"）
  - [x] SubTask 2.2: `src/mooc/zsgl/constants.ts` 新增常量：防抖间隔（~300ms）、匹配等待上限、MUI 选项选择器候选（radio/checkbox，集中定义留校准点）
  - [x] SubTask 2.3: `src/mooc/zsgl/exam.ts` 新增自动勾选器：
    - 题面匹配：stripHtml + 空白归一化比对 questionText，唯一命中才执行，零/多命中跳过 + Warn
    - 差集幂等勾选：读当前选中集合 vs 目标集合（isCorrect="Y" 的选项），取消非目标选中 + 勾选缺失目标，已满足不动；S/T 单选、M 多选
    - 勾后验证：回读 DOM 状态（checked/aria-checked/选中 class），失败降级 log.Info 面板提示答案 + Warn

- [x] Task 3: 双向触发接线
  - [x] SubTask 3.1: MutationObserver + 防抖 → 换题（下一题/上一题/题号导航）即尝试匹配勾选（实现说明：观察器挂 document.body——SPA 会重建 .MuiPaper-root，挂 body 免重挂，匹配时仍限定 MuiPaper-root 范围；理由已记入 03-详细设计 §9.7）
  - [x] SubTask 3.2: `crackQuestions` 批次链尾答案回写后 → 检查当前屏显题是否刚获得答案 → 补勾
  - [x] SubTask 3.3: exam_auto_select=false 时完全旁路：不注册 Observer、不做 DOM 操作，现状行为零变化
  - 约束：不触碰交卷监听（ZsglQuestionTask document 点击委托）、任务链、答案导出、破解策略

- [x] Task 4: 构建与静态检查
  - [x] SubTask 4.1: `npm run build` 成功
  - [x] SubTask 4.2: `npx tsc --noEmit` 对比基线无新增错误（对照 HEAD 行号核实：exam.ts 656/681 与 log.ts 144 均为既有基线 implicit-any）

- [ ] Task 5: 实机回归（用户执行，附核对清单）
  - [ ] SubTask 5.1: 浮窗三场景（默认显示 / 配置关闭 / 点 x 持久化）
  - [ ] SubTask 5.2: 勾选五场景（答案就绪即勾 / 晚到答案补勾 / 未破解题跳过 / 匹配失败跳过 / 配置关闭旁路）
  - [ ] SubTask 5.3: 按实测结果校准选项选择器与"站点保存答案时机"结论（如需），回填 constants.ts 注释与 03-详细设计

- [x] Task 6: 文档与留痕（ai-collab 三件套）
  - [x] SubTask 6.1: docs/zsgl/cn/03-详细设计.md（§9.7 考试答案自动勾选 + §12 新常量，版本 1.26.1013.1）、04-数据库设计.md（2 个配置键，1.26.1013.1）、07-部署手册与用户手册.md（§4 配置项，1.26.1013.1）、08-用户指导.md（配置速查 + 使用提示）；各文档变更日志留痕
  - [x] SubTask 6.2: docs/changelog.md（2026-10-13 行）、docs/tasks.md（T-022）留痕

# Task Dependencies
- Task 0 最先执行（分支隔离）
- Task 1 与 Task 2 相互独立，可并行
- Task 3 依赖 Task 2（勾选器就绪后才能接线）
- Task 4 依赖 Task 1 + Task 3
- Task 5 依赖 Task 4（构建产物刷新 + 扩展重载）
- Task 6 依赖 Task 1~4 完成后收口（可提前起草，实测结论回填后定稿）

# Parallel Work
- Task 1（log.ts + config）与 Task 2（exam.ts + constants + config）可分两个 Sub-Agent 并行，config.ts 由先完成者建键、后完成者追加
- Task 5 依赖用户实机操作，期间可并行推进 Task 6 文档起草
