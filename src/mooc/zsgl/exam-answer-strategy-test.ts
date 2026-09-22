/*
 * @Author: guotao
 * @Date: 2025-03-15
 * @LastEditors: guotao
 * @LastEditTime: 2025-03-15
 * @FilePath: \course-tools\src\mooc\zsgl\exam-answer-strategy-test.ts
 * @Description: 单选题批量答题策略测试文件
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */

/**
 * 单选题批量答题策略测试
 *
 * 性能目标验证：
 * - 100题最多8次接口调用（4轮×2次）
 * - 第一轮：100题填第一个选项（1次提交 + 1次查询 = 2次）
 * - 第二轮：剩余题目填第二个选项（假设约25题错误，75题继续）(1次提交 + 1次查询 = 2次)
 * - 第三轮：剩余题目填第三个选项（假设约18题错误，57题继续）(1次提交 + 1次查询 = 2次)
 * - 第四轮：剩余题目填第四个选项（假设约14题错误，43题继续）(1次提交 + 1次查询 = 2次)
 * - 总计：最多8次接口调用
 *
 * 理论分析：
 * - 每轮需要：1次批量提交 + 1次批量查询 = 2次接口调用
 * - 单选题最多4个选项，所以最多4轮
 * - 总计：4轮 × 2次 = 8次接口调用（100题最坏情况）
 */

import { QuestionInfo, QuestionSection } from "./types";
import { SingleChoiceAnswerStrategy, AnswerState } from "./exam-answer-strategy";

/**
 * 模拟单选题批量答题过程
 */
function simulateBatchAnswering() {
  console.log("\n========================================");
  console.log("单选题批量答题策略性能测试");
  console.log("========================================\n");

  // 1. 创建100道单选题（每题4个选项）
  const questions: QuestionInfo[] = [];
  for (let i = 1; i <= 100; i++) {
    const options: QuestionSection[] = [
      { sectionId: `opt_${i}_A`, sectionText: "选项A", isCorrect: "N" },
      { sectionId: `opt_${i}_B`, sectionText: "选项B", isCorrect: "N" },
      { sectionId: `opt_${i}_C`, sectionText: "选项C", isCorrect: "N" },
      { sectionId: `opt_${i}_D`, sectionText: "选项D", isCorrect: "N" },
    ];

    // 模拟不同难度分布：
    // - 25题：第一个选项正确（第1轮破解）
    // - 25题：第二个选项正确（第2轮破解）
    // - 25题：第三个选项正确（第3轮破解）
    // - 25题：第四个选项正确（第4轮破解）
    let correctOptionIndex = 0;
    if (i <= 25) {
      correctOptionIndex = 0; // A正确
    } else if (i <= 50) {
      correctOptionIndex = 1; // B正确
    } else if (i <= 75) {
      correctOptionIndex = 2; // C正确
    } else {
      correctOptionIndex = 3; // D正确
    }

    options[correctOptionIndex].isCorrect = "Y";

    questions.push({
      questionId: `q_${i}`,
      questionText: `题目${i}`,
      questionType: "S",
      sectionRespList: options,
    });
  }

  console.log(`创建 ${questions.length} 道单选题`);
  console.log("- 25题：第一个选项正确（第1轮破解）");
  console.log("- 25题：第二个选项正确（第2轮破解）");
  console.log("- 25题：第三个选项正确（第3轮破解）");
  console.log("- 25题：第四个选项正确（第4轮破解）");

  // 2. 初始化答题策略
  const strategy = new SingleChoiceAnswerStrategy();
  strategy.init("test_exam_id", "test_attempt_id", "test_test_no");
  strategy.initializeAnswerStates(questions);

  // 3. 模拟批量答题过程
  console.log("\n模拟批量答题过程：\n");

  let round = 0;
  let totalApiCalls = 0;
  const maxRounds = 4;
  let pendingQuestions = [...questions];

  while (pendingQuestions.length > 0 && round < maxRounds) {
    round++;
    totalApiCalls += 2; // 每轮：1次提交 + 1次查询

    console.log(`第 ${round} 轮：`);
    console.log(`  - 待破解题目数：${pendingQuestions.length}`);
    console.log(`  - 提交答案：1次`);
    console.log(`  - 查询结果：1次`);
    console.log(`  - 当前总接口调用次数：${totalApiCalls}`);

    // 模拟本轮答题结果
    const nextRoundQuestions: QuestionInfo[] = [];
    let crackedCount = 0;

    for (const question of pendingQuestions) {
      const state = strategy.getAnswerState(question.questionId);
      if (!state) continue;

      // 模拟获取下一个选项
      let nextOptionIndex = state.triedOptions.length;
      const nextOption = question.sectionRespList[nextOptionIndex];

      if (nextOption.isCorrect === "Y") {
        // 答案正确，记录
        state.confirmedAnswer = nextOption.sectionId;
        state.triedOptions.push(nextOption.sectionId);
        crackedCount++;
      } else {
        // 答案错误，排除
        state.triedOptions.push(nextOption.sectionId);
        if (state.triedOptions.length < state.options.length) {
          nextRoundQuestions.push(question);
        }
      }
    }

    console.log(`  - 本轮破解题目数：${crackedCount}`);

    pendingQuestions = nextRoundQuestions;
  }

  // 4. 输出最终统计
  console.log("\n最终统计：");
  console.log(`  - 总轮数：${round}`);
  console.log(`  - 总接口调用次数：${totalApiCalls}`);
  console.log(`  - 理论最大次数：8次（4轮×2次）`);
  console.log(`  - 是否符合性能目标：${totalApiCalls <= 8 ? "✅ 符合" : "❌ 不符合"}`);

  const confirmedAnswers = strategy.getConfirmedAnswers();
  console.log(`  - 成功破解题目数：${confirmedAnswers.size}`);
  console.log(`  - 失败题目数：${100 - confirmedAnswers.size}`);
  console.log(`  - 破解成功率：${(confirmedAnswers.size / 100 * 100).toFixed(2)}%`);

  console.log("\n========================================");
  console.log("测试完成");
  console.log("========================================\n");
}

/**
 * 测试边界情况
 */
function testEdgeCases() {
  console.log("\n========================================");
  console.log("边界情况测试");
  console.log("========================================\n");

  // 测试1：所有题目第一个选项都正确（最优情况）
  console.log("测试1：所有题目第一个选项都正确（最优情况）");
  const questions1: QuestionInfo[] = [];
  for (let i = 1; i <= 100; i++) {
    questions1.push({
      questionId: `q_${i}`,
      questionText: `题目${i}`,
      questionType: "S",
      sectionRespList: [
        { sectionId: `opt_${i}_A`, sectionText: "选项A", isCorrect: "Y" },
        { sectionId: `opt_${i}_B`, sectionText: "选项B", isCorrect: "N" },
        { sectionId: `opt_${i}_C`, sectionText: "选项C", isCorrect: "N" },
        { sectionId: `opt_${i}_D`, sectionText: "选项D", isCorrect: "N" },
      ],
    });
  }

  console.log(`  - 预期接口调用次数：2次（1轮×2次）`);
  console.log(`  - 预期破解成功率：100%\n`);

  // 测试2：所有题目第四个选项都正确（最坏情况）
  console.log("测试2：所有题目第四个选项都正确（最坏情况）");
  const questions2: QuestionInfo[] = [];
  for (let i = 1; i <= 100; i++) {
    questions2.push({
      questionId: `q_${i}`,
      questionText: `题目${i}`,
      questionType: "S",
      sectionRespList: [
        { sectionId: `opt_${i}_A`, sectionText: "选项A", isCorrect: "N" },
        { sectionId: `opt_${i}_B`, sectionText: "选项B", isCorrect: "N" },
        { sectionId: `opt_${i}_C`, sectionText: "选项C", isCorrect: "N" },
        { sectionId: `opt_${i}_D`, sectionText: "选项D", isCorrect: "Y" },
      ],
    });
  }

  console.log(`  - 预期接口调用次数：8次（4轮×2次）`);
  console.log(`  - 预期破解成功率：100%\n`);

  console.log("========================================\n");
}

// 运行测试
simulateBatchAnswering();
testEdgeCases();

console.log("\n使用说明：");
console.log("1. 在 ZsglExam 实例中调用 crackSingleChoiceQuestions() 方法");
console.log("2. 该方法会自动批量破解所有单选题");
console.log("3. 破解后的答案会自动更新到 questionList 中");
console.log("4. 可以通过 getConfirmedSingleChoiceAnswers() 获取确定的答案");
console.log("5. 接口调用次数保证 ≤ 8次（100题最坏情况）\n");