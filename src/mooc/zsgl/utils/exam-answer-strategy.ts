/*
 * @Author: guotao
 * @Date: 2025-03-15
 * @LastEditors: guotao
 * @LastEditTime: 2025-03-15
 * @FilePath: \course-tools\src\mooc\zsgl\utils\exam-answer-strategy.ts
 * @Description: 多选题批量答题策略
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */
import { QuestionInfo, QuestionSection } from "../types";
import { submitQuestionAnswer, queryQuestionAnswer, ExamApiResponse } from "./exam-utils";
import { Application } from "@App/internal/application";

/**
 * 多选题答题状态
 */
export interface MultipleChoiceState {
  questionId: string;
  questionText: string;
  correctOptions: string[];       // 已确定的正确选项ID
  wrongOptions: string[];         // 已确定的错误选项ID
  allOptions: QuestionSection[];  // 所有选项
  isCompleted: boolean;           // 是否已完成答题
  finalAnswer: string[];          // 最终答案
}

/**
 * 批量答题结果
 */
export interface BatchAnswerResult {
  questionId: string;
  isCorrect: string;              // "Y" 或 "N"
  correctAnswer?: string[];       // 正确答案（如果题目已完成）
}

/**
 * 答题进度回调
 */
export interface AnswerProgress {
  phase: "testing" | "verifying" | "completed";
  currentQuestion: number;
  totalQuestions: number;
  currentOption?: string;
  message: string;
}

/**
 * 多选题批量答题策略类
 */
export class MultipleChoiceAnswerStrategy {
  private examId: string;
  private attemptId: string;
  private testNo: string;
  private progressCallback?: (progress: AnswerProgress) => void;

  /**
   * 构造函数
   * @param examId 考试ID
   * @param attemptId 考试尝试ID
   * @param testNo 考试编号
   * @param progressCallback 进度回调函数
   */
  constructor(
    examId: string,
    attemptId: string,
    testNo: string,
    progressCallback?: (progress: AnswerProgress) => void
  ) {
    this.examId = examId;
    this.attemptId = attemptId;
    this.testNo = testNo;
    this.progressCallback = progressCallback;
  }

  /**
   * 批量答题主函数
   * @param questions 多选题列表
   * @returns Promise<MultipleChoiceState[]> 答题状态列表
   */
  async crackMultipleChoiceBatch(questions: QuestionInfo[]): Promise<MultipleChoiceState[]> {
    if (!questions || questions.length === 0) {
      Application.App.log.Warn("没有需要处理的多选题");
      return [];
    }

    // 初始化答题状态
    const states: MultipleChoiceState[] = questions.map(q => ({
      questionId: q.questionId,
      questionText: q.questionText,
      correctOptions: [],
      wrongOptions: [],
      allOptions: q.sectionRespList || [],
      isCompleted: false,
      finalAnswer: []
    }));

    Application.App.log.Info(`开始批量处理 ${questions.length} 道多选题`);

    // 第一阶段：逐选项测试
    await this.testIndividualOptions(states);

    // 第二阶段：组合验证
    await this.verifyCombinations(states);

    // 返回最终结果
    return states;
  }

  /**
   * 第一阶段：逐个测试每个选项
   * @param states 答题状态列表
   */
  private async testIndividualOptions(states: MultipleChoiceState[]): Promise<void> {
    const totalQuestions = states.length;
    const optionsCount = 4; // A/B/C/D 四个选项

    this.reportProgress("testing", 0, totalQuestions, undefined, "开始逐选项测试");

    // 按选项索引批量测试（A/B/C/D）
    for (let optionIndex = 0; optionIndex < optionsCount; optionIndex++) {
      const optionLetter = String.fromCharCode(65 + optionIndex); // A, B, C, D

      Application.App.log.Debug(`测试选项 ${optionLetter} (索引 ${optionIndex})`);

      // 为所有未完成的题目准备当前要测试的选项
      const batchAnswers = this.prepareBatchAnswers(states, optionIndex);

      if (batchAnswers.length === 0) {
        Application.App.log.Debug(`选项 ${optionLetter} 没有需要测试的题目`);
        continue;
      }

      this.reportProgress(
        "testing",
        0,
        totalQuestions,
        optionLetter,
        `正在测试选项 ${optionLetter}，共 ${batchAnswers.length} 道题目`
      );

      try {
        // 批量提交
        await submitQuestionAnswer(batchAnswers);
        Application.App.log.Debug(`选项 ${optionLetter} 批量提交成功`);

        // 等待一小段时间确保服务器处理完成
        await this.delay(300);

        // 查询结果
        const results = await queryQuestionAnswer(this.examId, this.attemptId);

        if (results.code === "0" && results.body) {
          // 分析结果
          this.analyzeResults(states, results.body, optionIndex);
          Application.App.log.Debug(`选项 ${optionLetter} 结果分析完成`);
        } else {
          Application.App.log.Error(`查询选项 ${optionLetter} 结果失败:`, results.message);
        }
      } catch (error) {
        Application.App.log.Error(`测试选项 ${optionLetter} 时发生错误:`, error);
      }
    }

    this.reportProgress("testing", totalQuestions, totalQuestions, undefined, "逐选项测试完成");
  }

  /**
   * 准备批量答案数据
   * @param states 答题状态列表
   * @param optionIndex 选项索引
   * @returns 批量答案数据
   */
  private prepareBatchAnswers(states: MultipleChoiceState[], optionIndex: number): any[] {
    const batchAnswers: any[] = [];

    for (const state of states) {
      // 跳过已完成的题目
      if (state.isCompleted) {
        continue;
      }

      // 确保有足够的选项
      if (!state.allOptions[optionIndex]) {
        continue;
      }

      const option = state.allOptions[optionIndex];

      // 构建答案数据
      const answerData = {
        attemptId: this.attemptId,
        examId: this.examId,
        testNo: this.testNo,
        answerList: [option.sectionId],
        questionId: state.questionId,
        questionNodesAnswer: [],
        images: []
      };

      batchAnswers.push(answerData);
    }

    return batchAnswers;
  }

  /**
   * 分析查询结果
   * @param states 答题状态列表
   * @param results 查询结果
   * @param optionIndex 选项索引
   */
  private analyzeResults(
    states: MultipleChoiceState[],
    results: any[],
    optionIndex: number
  ): void {
    for (const state of states) {
      // 跳过已完成的题目
      if (state.isCompleted) {
        continue;
      }

      // 确保有足够的选项
      if (!state.allOptions[optionIndex]) {
        continue;
      }

      const option = state.allOptions[optionIndex];

      // 查找对应题目的结果
      const result = results.find((r: any) => r.questionId === state.questionId);

      if (!result) {
        Application.App.log.Warn(`未找到题目 ${state.questionId} 的结果`);
        continue;
      }

      // 判断选项是否正确
      if (result.isCorrect === "Y") {
        // 该选项是正确答案之一
        state.correctOptions.push(option.sectionId);
        Application.App.log.Debug(
          `题目 ${state.questionId} 选项 ${option.sectionText} 是正确答案`
        );
      } else {
        // 该选项是错误选项
        state.wrongOptions.push(option.sectionId);
        Application.App.log.Debug(
          `题目 ${state.questionId} 选项 ${option.sectionText} 是错误选项`
        );
      }
    }
  }

  /**
   * 第二阶段：组合验证
   * @param states 答题状态列表
   */
  private async verifyCombinations(states: MultipleChoiceState[]): Promise<void> {
    const totalQuestions = states.length;
    let processedCount = 0;

    this.reportProgress("verifying", 0, totalQuestions, undefined, "开始组合验证");

    for (const state of states) {
      // 跳过已完成的题目
      if (state.isCompleted) {
        processedCount++;
        continue;
      }

      // 如果只有一个正确选项，可能是单选题或只有一个正确选项的多选题
      if (state.correctOptions.length === 1) {
        // 直接提交验证
        await this.verifySingleOption(state);
        processedCount++;
        continue;
      }

      // 如果有多个正确选项，需要验证组合
      if (state.correctOptions.length > 1) {
        await this.verifyMultipleOptions(state);
      } else {
        // 如果没有正确选项，记录警告
        Application.App.log.Warn(`题目 ${state.questionId} 未找到任何正确选项`);
      }

      processedCount++;
      this.reportProgress(
        "verifying",
        processedCount,
        totalQuestions,
        undefined,
        `正在验证题目 ${processedCount}/${totalQuestions}`
      );
    }

    this.reportProgress("completed", totalQuestions, totalQuestions, undefined, "组合验证完成");
  }

  /**
   * 验证单个选项
   * @param state 答题状态
   */
  private async verifySingleOption(state: MultipleChoiceState): Promise<void> {
    try {
      const answerData = {
        attemptId: this.attemptId,
        examId: this.examId,
        testNo: this.testNo,
        answerList: state.correctOptions,
        questionId: state.questionId,
        questionNodesAnswer: [],
        images: []
      };

      // 提交答案
      await submitQuestionAnswer([answerData]);
      await this.delay(300);

      // 查询结果
      const results = await queryQuestionAnswer(this.examId, this.attemptId);
      const result = results.body?.find((r: any) => r.questionId === state.questionId);

      if (result && result.isCorrect === "Y") {
        state.isCompleted = true;
        state.finalAnswer = [...state.correctOptions];
        Application.App.log.Info(
          `题目 ${state.questionId} 答题完成，正确答案: ${state.correctOptions.join(", ")}`
        );
      } else {
        // 如果单个选项不正确，可能需要寻找其他选项组合
        Application.App.log.Warn(
          `题目 ${state.questionId} 单个选项验证失败，可能需要更多选项组合`
        );
      }
    } catch (error) {
      Application.App.log.Error(`验证题目 ${state.questionId} 单个选项时发生错误:`, error);
    }
  }

  /**
   * 验证多个选项组合
   * @param state 答题状态
   */
  private async verifyMultipleOptions(state: MultipleChoiceState): Promise<void> {
    try {
      const answerData = {
        attemptId: this.attemptId,
        examId: this.examId,
        testNo: this.testNo,
        answerList: state.correctOptions,
        questionId: state.questionId,
        questionNodesAnswer: [],
        images: []
      };

      // 提交所有已确定的正确选项
      await submitQuestionAnswer([answerData]);
      await this.delay(300);

      // 查询结果
      const results = await queryQuestionAnswer(this.examId, this.attemptId);
      const result = results.body?.find((r: any) => r.questionId === state.questionId);

      if (result && result.isCorrect === "Y") {
        // 组合正确，题目完成
        state.isCompleted = true;
        state.finalAnswer = [...state.correctOptions];
        Application.App.log.Info(
          `题目 ${state.questionId} 答题完成，正确答案: ${state.correctOptions.join(", ")}`
        );
      } else {
        // 组合不完整，可能还需要测试未确定的选项
        Application.App.log.Debug(
          `题目 ${state.questionId} 组合验证失败，当前正确选项: ${state.correctOptions.join(", ")}`
        );

        // 需要测试剩余未确定的选项（不在正确和错误列表中的选项）
        const untestedOptions = state.allOptions.filter(
          opt =>
            !state.correctOptions.includes(opt.sectionId) &&
            !state.wrongOptions.includes(opt.sectionId)
        );

        if (untestedOptions.length > 0) {
          Application.App.log.Debug(
            `题目 ${state.questionId} 还有 ${untestedOptions.length} 个未测试选项，继续测试`
          );
          await this.testUntestedOptions(state, untestedOptions);
        } else {
          // 所有选项都已测试但组合仍然不正确，记录警告
          Application.App.log.Warn(
            `题目 ${state.questionId} 所有选项已测试但组合仍然不正确`
          );
        }
      }
    } catch (error) {
      Application.App.log.Error(`验证题目 ${state.questionId} 多选项组合时发生错误:`, error);
    }
  }

  /**
   * 测试未测试的选项
   * @param state 答题状态
   * @param untestedOptions 未测试的选项列表
   */
  private async testUntestedOptions(
    state: MultipleChoiceState,
    untestedOptions: QuestionSection[]
  ): Promise<void> {
    Application.App.log.Debug(
      `题目 ${state.questionId} 开始测试 ${untestedOptions.length} 个未测试选项`
    );

    for (const option of untestedOptions) {
      // 单独测试该选项
      const answerData = {
        attemptId: this.attemptId,
        examId: this.examId,
        testNo: this.testNo,
        answerList: [option.sectionId],
        questionId: state.questionId,
        questionNodesAnswer: [],
        images: []
      };

      try {
        await submitQuestionAnswer([answerData]);
        await this.delay(300);

        const results = await queryQuestionAnswer(this.examId, this.attemptId);
        const result = results.body?.find((r: any) => r.questionId === state.questionId);

        if (result && result.isCorrect === "Y") {
          // 该选项也是正确选项
          state.correctOptions.push(option.sectionId);
          Application.App.log.Debug(
            `题目 ${state.questionId} 发现新的正确选项: ${option.sectionText}`
          );
        } else {
          // 该选项是错误选项
          state.wrongOptions.push(option.sectionId);
          Application.App.log.Debug(
            `题目 ${state.questionId} 选项 ${option.sectionText} 确认为错误选项`
          );
        }
      } catch (error) {
        Application.App.log.Error(
          `测试题目 ${state.questionId} 选项 ${option.sectionText} 时发生错误:`,
          error
        );
      }
    }

    // 再次验证组合
    if (state.correctOptions.length > 0) {
      await this.verifyMultipleOptions(state);
    }
  }

  /**
   * 报告进度
   * @param phase 阶段
   * @param currentQuestion 当前题目索引
   * @param totalQuestions 总题目数
   * @param currentOption 当前选项
   * @param message 消息
   */
  private reportProgress(
    phase: "testing" | "verifying" | "completed",
    currentQuestion: number,
    totalQuestions: number,
    currentOption: string | undefined,
    message: string
  ): void {
    if (this.progressCallback) {
      this.progressCallback({
        phase,
        currentQuestion,
        totalQuestions,
        currentOption,
        message
      });
    }

    Application.App.log.Debug(`进度: ${message}`);
  }

  /**
   * 延迟函数
   * @param ms 毫秒数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * 创建多选题答题策略实例
 * @param examId 考试ID
 * @param attemptId 考试尝试ID
 * @param testNo 考试编号
 * @param progressCallback 进度回调函数
 * @returns MultipleChoiceAnswerStrategy 实例
 */
export function createMultipleChoiceStrategy(
  examId: string,
  attemptId: string,
  testNo: string,
  progressCallback?: (progress: AnswerProgress) => void
): MultipleChoiceAnswerStrategy {
  return new MultipleChoiceAnswerStrategy(examId, attemptId, testNo, progressCallback);
}