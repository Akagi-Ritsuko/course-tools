# 多选题批量答题策略使用示例

## 简介

本文档介绍如何使用多选题批量答题策略来自动答题多选题。

## 核心功能

### 1. 状态管理

```typescript
interface MultipleChoiceState {
  questionId: string;              // 题目ID
  questionText: string;            // 题目文本
  correctOptions: string[];        // 已确定的正确选项ID
  wrongOptions: string[];          // 已确定的错误选项ID
  allOptions: QuestionSection[];   // 所有选项
  isCompleted: boolean;            // 是否已完成答题
  finalAnswer: string[];           // 最终答案
}
```

### 2. 答题流程

#### 第一阶段：逐选项测试

1. 为所有未完成的题目准备当前选项
2. 批量提交答案
3. 查询结果
4. 分析结果并更新状态

**性能目标：** 4轮（A/B/C/D 四个选项）

#### 第二阶段：组合验证

1. 验证单选项组合
2. 验证多选项组合
3. 测试未测试选项
4. 最终验证

## 使用方法

### 在 ZsglExam 类中使用

```typescript
// 创建考试实例
const exam = new ZsglExam();

// 初始化考试
await exam.Init();

// 启动多选题批量答题
const results = await exam.startMultipleChoiceAnswering((progress) => {
  console.log(`[${progress.phase}] ${progress.message}`);
});

// 获取结果
const finalResults = exam.getMultipleChoiceResults();

// 查看完成情况
for (const result of finalResults) {
  if (result.isCompleted) {
    console.log(`题目 ${result.questionId} 完成`);
    console.log(`正确答案: ${result.finalAnswer.join(", ")}`);
  }
}
```

### 直接使用策略类

```typescript
import { MultipleChoiceAnswerStrategy } from "./utils/exam-answer-strategy";

// 创建策略实例
const strategy = new MultipleChoiceAnswerStrategy(
  examId,
  attemptId,
  testNo,
  (progress) => {
    console.log(`进度: ${progress.message}`);
  }
);

// 执行批量答题
const results = await strategy.crackMultipleChoiceBatch(questions);

// 处理结果
for (const result of results) {
  console.log(`题目ID: ${result.questionId}`);
  console.log(`正确选项: ${result.correctOptions.join(", ")}`);
  console.log(`错误选项: ${result.wrongOptions.join(", ")}`);
  console.log(`是否完成: ${result.isCompleted}`);
  console.log(`最终答案: ${result.finalAnswer.join(", ")}`);
}
```

## 进度回调

```typescript
interface AnswerProgress {
  phase: "testing" | "verifying" | "completed";
  currentQuestion: number;
  totalQuestions: number;
  currentOption?: string;
  message: string;
}
```

### 进度示例

```
[testing] 正在测试选项 A，共 10 道题目
[testing] 正在测试选项 B，共 10 道题目
[testing] 正在测试选项 C，共 10 道题目
[testing] 正在测试选项 D，共 10 道题目
[verifying] 正在验证题目 1/10
[verifying] 正在验证题目 2/10
...
[completed] 组合验证完成
```

## 工具函数

策略类使用了以下已有的工具函数：

- `submitQuestionAnswer()` - 提交答案
- `queryQuestionAnswer()` - 查询结果

## 性能优化

### 批量处理

策略类采用批量处理方式，减少网络请求次数：

1. **第一阶段**：每轮批量提交所有题目的同一选项（共4轮）
2. **第二阶段**：逐题验证组合（按需）

### 状态跟踪

实时跟踪每道题的答题状态：

- 正确选项列表
- 错误选项列表
- 完成状态

## 错误处理

策略类包含完善的错误处理机制：

- 网络请求失败处理
- 数据解析错误处理
- 状态更新失败处理

所有错误都会记录到日志系统。

## 测试验证

运行测试验证：

```typescript
import { testMultipleChoiceStrategy } from "./utils/exam-answer-strategy-test";

// 执行测试
await testMultipleChoiceStrategy();
```

## 注意事项

1. 确保考试参数完整（examId、attemptId、testNo）
2. 确保题目列表包含正确的选项数据
3. 监控进度回调以了解答题进度
4. 检查最终结果以确认答题完成情况

## 文件位置

- 策略实现：`src/mooc/zsgl/utils/exam-answer-strategy.ts`
- 测试文件：`src/mooc/zsgl/utils/exam-answer-strategy-test.ts`
- 集成文件：`src/mooc/zsgl/exam.ts`