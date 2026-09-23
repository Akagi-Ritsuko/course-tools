/*
 * @Author: guotao
 * @Date: 2025-03-15
 * @LastEditors: guotao
 * @LastEditTime: 2026-09-24 00:42:02
 * @FilePath: \course-tools\src\mooc\zsgl\utils\exam-answer-strategy.ts
 * @Description: 多选题批量答题策略
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */
import { QuestionInfo, QuestionSection } from "../types";
import { submitQuestionAnswer, queryQuestionAnswer } from "./exam-utils";
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
   *
   * 说明：queryQuestionAnswer 返回的 isCorrect 是“整题答案是否完全正确”，
   * 而不是单个选项是否正确。因此无法通过“提交单个选项”来判断该选项对错，
   * 只能枚举所有非空选项组合并提交，直到某个组合的 isCorrect === "Y"。
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

    Application.App.log.Info(`开始破解 ${questions.length} 道多选题`);

    // 逐题枚举组合破解
    for (let index = 0; index < states.length; index++) {
      const state = states[index];
      this.reportProgress(
        "testing",
        index,
        states.length,
        undefined,
        `正在破解第 ${index + 1}/${states.length} 道多选题`
      );
      await this.crackSingleQuestion(state);
    }

    this.reportProgress("completed", states.length, states.length, undefined, "多选题破解完成");
    return states;
  }

  /**
   * 破解单个多选题：枚举所有非空选项组合，找到 isCorrect === "Y" 的组合
   * @param state 答题状态
   */
  private async crackSingleQuestion(state: MultipleChoiceState): Promise<void> {
    const options = state.allOptions;
    if (options.length === 0) {
      Application.App.log.Warn(`题目 ${state.questionId} 没有选项，无法破解`);
      return;
    }

    // 题目已答对则直接跳过
    try {
      const initial = await queryQuestionAnswer(this.examId, this.attemptId);
      const initialResult = initial.body?.find((r: any) => r.questionId === state.questionId);
      if (initialResult && initialResult.isCorrect === "Y") {
        state.isCompleted = true;
        state.finalAnswer = initialResult.answerList || [];
        state.correctOptions = [...state.finalAnswer];
        Application.App.log.Info(`题目 ${state.questionId} 已答对，跳过`);
        return;
      }
    } catch (e) {
      Application.App.log.Warn(`题目 ${state.questionId} 初次查询失败，继续枚举:`, e);
    }

    // 按组合大小从 1 到 n 递增枚举，先试小组合（多数答案组合较小，更快命中）
    const combos = this.generateCombos(options);

    for (let comboIndex = 0; comboIndex < combos.length; comboIndex++) {
      const combo = combos[comboIndex];
      // 枚举期间无日志会被误判为卡死(答案组合大时前面几十个组合全部失败,
      // 单题可静默跑数分钟),每 10 个组合报一次进度
      if (comboIndex % 10 === 0) {
        Application.App.log.Info(
          `题目 ${state.questionId} 枚举进度: ${comboIndex + 1}/${combos.length}(当前组合 ${combo.length} 项)`,
        );
      }
      const answerData = {
        attemptId: this.attemptId,
        examId: this.examId,
        testNo: this.testNo,
        answerList: combo,
        questionId: state.questionId,
        questionNodesAnswer: [],
        images: []
      };

      try {
        const submitResult = await submitQuestionAnswer([answerData]);
        if (submitResult.code !== "0" && submitResult.code !== 0) {
          Application.App.log.Error(`提交题目 ${state.questionId} 失败: ${submitResult.message}`);
          continue;
        }

        // 等待服务器处理完成
        await this.delay(300);

        const results = await queryQuestionAnswer(this.examId, this.attemptId);
        const result = results.body?.find((r: any) => r.questionId === state.questionId);

        if (result && result.isCorrect === "Y") {
          state.isCompleted = true;
          state.finalAnswer = [...combo];
          state.correctOptions = [...combo];
          Application.App.log.Info(
            `题目 ${state.questionId} 破解成功，正确答案: ${combo.join(", ")}`
          );
          return;
        }
      } catch (error) {
        Application.App.log.Error(`破解题目 ${state.questionId} 组合时发生错误:`, error);
      }
    }

    // 所有组合均未命中：清空服务器端残留的答案（最后一次提交的组合会被保留），
    // 避免全选组合等错误答案被误判为用户的作答
    try {
      await submitQuestionAnswer([
        {
          attemptId: this.attemptId,
          examId: this.examId,
          testNo: this.testNo,
          answerList: [],
          questionId: state.questionId,
          questionNodesAnswer: [],
          images: [],
        },
      ]);
    } catch (e) {
      Application.App.log.Warn(
        `清空题目 ${state.questionId} 残留答案失败:`,
        e,
      );
    }

    Application.App.log.Warn(`题目 ${state.questionId} 未找到任何正确选项组合`);
  }

  /**
   * 生成所有非空选项组合，按组合大小升序排列
   * @param options 选项列表
   * @returns 组合列表（每个组合是选项ID数组）
   */
  private generateCombos(options: QuestionSection[]): string[][] {
    const n = options.length;
    const ids = options.map(o => o.sectionId);
    const combos: string[][] = [];

    for (let size = 1; size <= n; size++) {
      const indexes: number[] = [];
      const dfs = (start: number): void => {
        if (indexes.length === size) {
          combos.push(indexes.map(i => ids[i]));
          return;
        }
        for (let i = start; i < n; i++) {
          indexes.push(i);
          dfs(i + 1);
          indexes.pop();
        }
      };
      dfs(0);
    }

    return combos;
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
