# AI 协作说明（docs/ai-collab.md）

本文档是**所有 AI 与人对本仓库进行修改时必须遵守的约定**，目的是保证"每次修改和完成的内容都有文档记录"，让任何新 AI 无需反复询问即可理解项目并正确接续工作。

> 当前文档体系范围：**仅覆盖 zsgl 模块**（`src/mooc/zsgl/`）。其余平台模块（chaoxing / course163 / zhihuishu）暂未纳入；涉及它们的修改仅需遵守 §2 的 changelog/tasks 留痕约定。

## 1. 阅读约定（新 AI 上手顺序）

接手 zsgl 相关工作时按以下顺序阅读，5 分钟内建立全貌：

1. [README.md](../README.md) —— 项目定位（cxmooc-tools 多平台网课工具）
2. [zsgl/README.md](zsgl/README.md) —— zsgl 模块文档索引与代码地图（待建，见 tasks.md）
3. [zsgl/cn/01-需求规格.md](zsgl/cn/01-需求规格.md) ~ [zsgl/cn/07-部署手册与用户手册.md](zsgl/cn/07-部署手册与用户手册.md) —— 需求 / 概要设计 / 详细设计 / 存储 / API / 测试 / 部署（按需）
4. [tasks.md](tasks.md) —— 当前任务与进度（第一入口）
5. [changelog.md](changelog.md) —— 近期变更脉络
6. `src/mooc/zsgl/TODO.md` —— 问题清单原始记录（内容整理进 tasks.md 后，以 tasks.md 为准）
7. `.trae/documents/zsgl-debug-handoff.md` —— 最近一轮调试交接（含构建/类型检查/日志解读等接手必读事项）

## 2. 修改约定（必守）

**任何一次改动**（代码、文档、配置）完成后，必须同步完成以下三项，缺一不可：

1. **更新 [changelog.md](changelog.md)**：追加一行 `日期 | 变更内容 | 涉及文件 | 关联任务/文档`。
2. **更新 [tasks.md](tasks.md)**：把对应任务状态改为 `done`（或新增任务并标注）。
3. **按需更新相关文档**：
   - 涉及 zsgl 模块行为/结构变更 → 同步修订 `docs/zsgl/cn/` 下对应文档（01 需求 / 03 详细设计 / 04 存储 / 05 API 等），并在该文档自身"变更日志"小节留痕。
   - 涉及**架构/技术选型**变更 → 先新增或更新 ADR（见 §3）。
   - 新增配置项 → 同步 `docs/zsgl/cn/04-数据库设计.md`（配置键表）与 `docs/zsgl/cn/07-部署手册与用户手册.md`（配置项说明）。

> 原则：文档是项目的一部分，不是事后补写。改动后若文档与代码不一致，视为未完成。

## 3. ADR 提交流程（状态机）

ADR 目录 `docs/adr/` 当前为空；首次记录决策时创建目录并按 `ADR-001-*.md` 命名。每条 ADR 独立成文件，状态三态：

```
draft（提案）→ accepted（生效）→ superseded（被替代）
```

- 新建选型/架构决策时：先写 `status: draft`，讨论收敛后改 `accepted`。
- 被新决策替代时：旧条目 `superseded` 并注明"被 ADR-XXX 替代"，新条目记录"替代 ADR-XXX"。
- 编号递增、**不重排**；已编号但作废的条目保留并标注。

## 4. 编号与命名规范

| 类别 | 格式 | 示例 |
|---|---|---|
| ADR | ADR-三位数 | ADR-001 |
| 里程碑 | M0 ~ M5 | M1 |
| 任务 | T-三位数 | T-001 |
| 功能需求 | FR-xxx | FR-001 |
| 非功能需求 | NFR-xxx | NFR-002 |

- 文件命名：小写 + 连字符（如 `ADR-001-log-recorder.md`）。
- 日期：ISO 8601（`YYYY-MM-DD`）。

## 5. 完成一个任务的收尾检查

1. 代码/文档已按约定同步更新（changelog + tasks + 相关文档）。
2. 交叉引用无错链（文档编号、任务编号、代码路径）。
3. 若新增了需要后续 AI 知晓的信息，已写入对应文档而非只留在对话里（如"构建后必须重载扩展""用 `npx tsc --noEmit` 对比基线错误"等，写入 handoff 或对应文档）。
