# 修复 zsgl 考试答案分批加载导致的导出不完整问题

## Summary

`queryQuestionDetail.do` 按每 10 题一批分页返回题目（本次考试共 35 题，分 4 批）。当前实现存在三个问题：
1. 每批响应会**整体替换** `this.questionList`，任何时刻只保留一批题目；
2. 第一批 10 题破解完成后 `startAutoAnswering` 末尾立即触发 `tryExportAnswers()`，**导出文件只含 10 题**，且幂等标记 `answerExported` 被置位；
3. 后续批次破解完成、任务完成、以及最终**点击交卷时**的 `examComplete → tryExportAnswers()` 全部被幂等标记跳过，导不出完整答案。

修复方案（与用户设想一致）：新增一个**按 questionId 累积所有题目与答案的 Map**，每批数据合并进 Map 并重建 `questionList`；导出时机改为「全部题目到齐且破解链跑完」时自动导出一次 + 「点击交卷」时兜底导出一次（幂等）。

## Current State Analysis

### 日志证据（zsgl.lzlj.com-1789879986283.log）
| 时间 | 事件 |
| --- | --- |
| 12:48:47 | `queryNewExamPaper` 返回 `questionIdList: Array(35)`；第 1 批 10 题到达 |
| 12:48:47~49 | 第 1 批破解：`提交 10 → 5 → 4 → 1 道题目的答案`，全部破解完成 |
| 12:48:49 后 | `startAutoAnswering` 末尾 `tryExportAnswers()` → **导出仅 10 题**，`answerExported = true` |
| 12:50:9 / 12:50:58 / 12:52:33 | 第 2/3/4 批到达，`questionList` 被替换为最新一批，各自破解 |
| 12:50:9 | 用户答完第 10 题，`task.jobIndex(9) === questionList.length-1(9)` 触发 `examComplete`（导出被标记跳过） |
| 12:52:55 | 用户点击交卷 `submitNewExamPaper.do` → `examComplete → tryExportAnswers()` **被幂等标记跳过** |

### 涉及代码
- [exam.ts](file:///d:/workSpace/program/course-tools/src/mooc/zsgl/exam.ts)
  - L222：`self.questionList = self.adaptQuestionData(rawData)` — 每批整体替换
  - L609~610：`startAutoAnswering` 末尾 `this.tryExportAnswers()` — 提前导出
  - L447~458：`tryExportAnswers()` 幂等标记 `answerExported`
  - L495~497：`OperateCard` 中 `jobIndex === questionList.length - 1 → examComplete()` — 提前完成信号
  - L517~611：`startAutoAnswering` 每批各跑一次（共享策略实例，存在并发隐患）
- [answer-exporter.ts](file:///d:/workSpace/program/course-tools/src/mooc/zsgl/utils/answer-exporter.ts)：`exportExamAnswers` 本身无状态，传入什么导出什么（无需改动）
- [exam-answer-strategy.ts](file:///d:/workSpace/program/course-tools/src/mooc/zsgl/exam-answer-strategy.ts) / [utils/exam-answer-strategy.ts](file:///d:/workSpace/program/course-tools/src/mooc/zsgl/utils/exam-answer-strategy.ts)：策略实例含内部状态（`init()` 会清空），不可并发使用

## Proposed Changes

全部改动集中在 `src/mooc/zsgl/exam.ts`，其余文件不动。

### 1. 新增累积存储字段（ZsglExam 类）
```ts
/** 全量题目累积表：questionId -> QuestionInfo（跨批次累积，first-seen 优先，保留已破解答案） */
protected allQuestionMap: Map<string, QuestionInfo> = new Map();
/** 批次破解串行链：避免多批并发时共享策略实例状态被 init() 清空 */
private autoAnswerChain: Promise<void> = Promise.resolve();
/** Init Promise 是否已落定（仅第一批触发 resolve/reject） */
private initHookSettled: boolean = false;
```

### 2. 新增合并方法 `mergeQuestionBatch(batch: QuestionInfo[]): void`
- 遍历批次，`allQuestionMap` 中不存在的 questionId 才写入（first-seen 优先，避免重复请求覆盖已破解的 `isCorrect`）；
- 合并后重建 `this.questionList = Array.from(this.allQuestionMap.values())`，使 `answerMessage`、导出等下游逻辑无感知地拿到全量列表。

### 3. 改造 `hookQuestionDetailRequests` 回调
- 解密适配得到 `batch` 后：调用 `self.mergeQuestionBatch(batch)`（不再整体替换）；
- 按批内每题判断是否内嵌正确答案（`sectionRespList.some(s => s.isCorrect === "Y")`），筛出 `needsCrack`；
- `needsCrack` 非空时串行入链：
  ```ts
  self.autoAnswerChain = self.autoAnswerChain
    .then(() => self.crackQuestions(needsCrack))
    .then(() => self.maybeExportAllAnswers())
    .catch((error) => Application.App.log.Error("批次自动答题失败", error));
  ```
- 仅第一批（`!self.initHookSettled`）负责 `resolve()/reject()` 原 Promise（保持 Init → OperateCard 的时序不变）；后续批次只入链不落定。

### 4. `startAutoAnswering` 重构为 `crackQuestions(questions: QuestionInfo[])`
- 保留「考试参数未就绪时等待 `examPaperHookPromise`」的逻辑；
- 单选/判断、多选的破解逻辑不变，但作用域从 `this.questionList` 改为**传入的本批题目**；
- 破解结果回写逻辑（`updateQuestionListWithSingleChoiceAnswers` / `updateQuestionListWithMultipleChoiceAnswers`）不变 —— `questionList` 现在是全量列表，`find(q => q.questionId === ...)` 可跨批命中；
- **删除末尾的 `this.tryExportAnswers()`**，保留 `await this.answerMessage(this.questionList)` 刷新展示。

### 5. 新增 `maybeExportAllAnswers(): void`
```ts
private maybeExportAllAnswers(): void {
  const expected = this.questionIdList.length;
  // 总数未知（queryNewExamPaper 失败）或题目未集齐时，交给交卷兜底导出
  if (expected === 0 || this.allQuestionMap.size < expected) return;
  this.tryExportAnswers();
}
```
- 每个批次破解链跑完后调用；最后一批（本例 35/35）完成时自动导出**完整答案文件**。

### 6. 移除 `OperateCard` 中的提前完成信号
删除：
```ts
if (task.jobIndex === this.questionList.length - 1) {
  this.examComplete();
}
```
分批加载下「答完当前批最后一题」≠ 考试结束；真正的结束信号是确认弹窗内点击交卷（`isSubmit === true` 分支），该分支保持不变。

### 7. `examComplete` / `tryExportAnswers` 保持不变
- 交卷时兜底导出：此时 `this.questionList` 已是累积全量列表（用户若未翻到最后一批则导出已收集部分，文件内未破解题目标注 ⚠️）；
- 幂等标记防止「自动导出 + 交卷导出」重复下载。

## Assumptions & Decisions
- **导出时机**：自动导出（全部题目集齐且破解完成）+ 交卷兜底导出，二者幂等只下载一次 —— 同时满足「导出完整」与「交卷触发导出」两个预期；
- **first-seen 合并策略**：同一 questionId 二次到达时不覆盖，保护已破解/已内嵌的答案；
- **串行破解链**：批量到达时排队执行，规避 `SingleChoiceAnswerStrategy.init()` 清空状态导致的并发损坏；本场景批次间隔大于破解耗时，实际仍为逐批执行；
- **不动任务链结构**：`OperateCard` 仍按第一批题目建任务（与页面分页行为一致），仅移除错误的提前 `examComplete`；
- 不改动 `answer-exporter.ts`、两个策略类与 `utils.ts` 钩子机制。

## Verification
1. 编译检查：`npx tsc --noEmit`（或项目现有 build 流程）无类型错误；
2. 逻辑走查对照日志时间线：
   - 第 1 批到达 → 合并（map=10）→ 入链破解 → 破解完 `maybeExportAllAnswers`（10 < 35，不导出）；
   - 第 2/3 批同理（map=20/30，均不导出）；
   - 第 4 批到达 → 合并（map=35）→ 破解完 → **自动导出完整 35 题**；
   - 交卷 → `examComplete → tryExportAnswers`（已导出则跳过；若未集齐则导出已收集部分）；
3. 实机回归：进入考试后等待自动答题跑完，确认下载的 Markdown 含全部题目；或中途交卷，确认交卷时能导出（题目数=已浏览批次数）。
