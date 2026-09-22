/*
 * @Author: guotao
 * @Date: 2025-03-15
 * @LastEditors: guotao
 * @LastEditTime: 2025-03-15
 * @FilePath: \course-tools\src\mooc\zsgl\exam-answer-strategy.ts
 * @Description: 单选题批量答题策略模块
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */
import { Application } from "@App/internal/application";
import { QuestionInfo, QuestionSection } from "./types";
import { submitQuestionAnswer, queryQuestionAnswer } from "./utils/exam-utils";

/**
 * 答题状态接口
 * 用于跟踪每道题的答题进度
 */
export interface AnswerState {
  /** 题目ID */
  questionId: string;
  /** 题目文本 */
  questionText: string;
  /** 已测试的选项ID列表 */
  triedOptions: string[];
  /** 已确定的正确答案（选项ID） */
  confirmedAnswer: string | null;
  /** 所有选项 */
  options: QuestionSection[];
  /** 原始题目信息 */
  originalQuestion: QuestionInfo;
}

/**
 * 批量答题结果接口
 */
export interface BatchAnswerResult {
  /** 成功破解的题目数量 */
  successCount: number;
  /** 失败的题目数量 */
  failedCount: number;
  /** 总轮数 */
  totalRounds: number;
  /** 总接口调用次数 */
  totalApiCalls: number;
  /** 答题详情 */
  details: Map<string, AnswerState>;
}

/**
 * 单选题批量答题策略类
 */
export class SingleChoiceAnswerStrategy {
  /** 答题状态映射表 */
  private answerStates: Map<string, AnswerState> = new Map();

  /** 考试ID */
  private examId: string = "";

  /** 考试尝试ID */
  private attemptId: string = "";

  /** 考试编号 */
  private testNo: string = "";

  /** 总接口调用次数 */
  private totalApiCalls: number = 0;

  /**
   * 初始化答题策略
   * @param examId 考试ID
   * @param attemptId 考试尝试ID
   * @param testNo 考试编号
   */
  public init(examId: string, attemptId: string, testNo: string): void {
    this.examId = examId;
    this.attemptId = attemptId;
    this.testNo = testNo;
    this.answerStates.clear();
    this.totalApiCalls = 0;
  }

  /**
   * 初始化答题状态
   * @param questions 题目列表
   */
  public initializeAnswerStates(questions: QuestionInfo[]): void {
    this.answerStates.clear();

    for (const question of questions) {
      // 处理单选题和判断题
      if (question.questionType === "S" || question.questionType === "T") {
        const state: AnswerState = {
          questionId: question.questionId,
          questionText: question.questionText,
          triedOptions: [],
          confirmedAnswer: null,
          options: question.sectionRespList,
          originalQuestion: question
        };
        this.answerStates.set(question.questionId, state);
      }
    }

    Application.App.log.Info(`初始化 ${this.answerStates.size} 道单选题答题状态`);
  }

  /**
   * 获取下一个要尝试的选项
   * @param state 答题状态
   * @returns 下一个选项ID，如果没有可用选项则返回 null
   */
  private getNextOptionToTry(state: AnswerState): string | null {
    for (const option of state.options) {
      if (!state.triedOptions.includes(option.sectionId)) {
        return option.sectionId;
      }
    }
    return null;
  }

  /**
   * 标记选项为错误
   * @param state 答题状态
   * @param optionId 选项ID
   */
  private markOptionAsWrong(state: AnswerState, optionId: string): void {
    if (!state.triedOptions.includes(optionId)) {
      state.triedOptions.push(optionId);
    }
  }

  /**
   * 构建批量提交答案数据
   * @param states 待破解的答题状态列表
   * @returns 批量答案数据
   */
  private buildBatchAnswerData(states: AnswerState[]): any[] {
    return states.map(state => {
      const nextOption = this.getNextOptionToTry(state);
      if (!nextOption) {
        Application.App.log.Warn(`题目 ${state.questionId} 没有可尝试的选项`);
        return null;
      }

      return {
        attemptId: this.attemptId,
        examId: this.examId,
        testNo: this.testNo,
        answerList: [nextOption],
        questionId: state.questionId,
        questionNodesAnswer: [],
        images: []
      };
    }).filter(item => item !== null);
  }

  /**
   * 执行批量排除法答题
   * @param questions 题目列表
   * @returns 批量答题结果
   */
  public async crackSingleChoiceBatch(
    questions: QuestionInfo[]
  ): Promise<BatchAnswerResult> {
    // 初始化答题状态
    this.initializeAnswerStates(questions);

    const pendingStates: AnswerState[] = [];
    for (const state of this.answerStates.values()) {
      pendingStates.push(state);
    }

    let round = 0;
    const maxRounds = 4; // 单选题最多4轮

    Application.App.log.Info(`开始批量破解 ${pendingStates.length} 道单选题`);

    while (pendingStates.length > 0 && round < maxRounds) {
      round++;
      Application.App.log.Info(`开始第 ${round} 轮答题，待破解题目: ${pendingStates.length} 道`);

      // 1. 构建批量答案数据
      const batchAnswerData = this.buildBatchAnswerData(pendingStates);

      if (batchAnswerData.length === 0) {
        Application.App.log.Warn("没有可提交的答案数据，退出循环");
        break;
      }

      // 2. 批量提交答案
      Application.App.log.Debug(`提交 ${batchAnswerData.length} 道题目的答案`);
      const submitResult = await submitQuestionAnswer(batchAnswerData);
      this.totalApiCalls++;

      if (submitResult.code !== "0" && submitResult.code !== 0) {
        Application.App.log.Error(`提交答案失败: ${submitResult.message}`);
        break;
      }

      // 等待服务器处理完成
      await this.delay(300);

      // 3. 查询结果
      Application.App.log.Debug("查询答案结果");
      const queryResult = await queryQuestionAnswer(this.examId, this.attemptId);
      this.totalApiCalls++;

      if (queryResult.code !== "0" && queryResult.code !== 0) {
        Application.App.log.Error(`查询答案失败: ${queryResult.message}`);
        break;
      }

      // 4. 分析结果，确定答案或排除选项
      const nextRoundStates: AnswerState[] = [];
      const answerMap = new Map<string, any>();

      // 构建答案映射表
      if (queryResult.body && Array.isArray(queryResult.body)) {
        for (const result of queryResult.body) {
          answerMap.set(result.questionId, result);
        }
      }

      // 分析每道题的结果
      for (const state of pendingStates) {
        const result = answerMap.get(state.questionId);

        if (!result) {
          Application.App.log.Warn(`题目 ${state.questionId} 没有查询到结果`);
          continue;
        }

        // 获取当前提交的答案
        const currentAnswer = this.getNextOptionToTry(state);

        if (result.isCorrect === "Y") {
          // 答案正确
          state.confirmedAnswer = currentAnswer;
          this.markOptionAsWrong(state, currentAnswer);
          Application.App.log.Info(
            `题目 ${state.questionId} 确定正确答案: ${currentAnswer}`
          );
        } else {
          // 答案错误，排除该选项
          this.markOptionAsWrong(state, currentAnswer);
          Application.App.log.Debug(
            `题目 ${state.questionId} 排除错误选项: ${currentAnswer}`
          );

          // 检查是否还有未尝试的选项
          if (state.triedOptions.length < state.options.length) {
            nextRoundStates.push(state);
          } else {
            Application.App.log.Warn(
              `题目 ${state.questionId} 所有选项都已尝试但未找到正确答案`
            );
          }
        }
      }

      pendingStates.length = 0;
      pendingStates.push(...nextRoundStates);

      // 如果所有题目都已确定，提前退出
      if (pendingStates.length === 0) {
        Application.App.log.Info(`所有题目都已破解，第 ${round} 轮结束`);
        break;
      }
    }

    // 统计结果
    let successCount = 0;
    let failedCount = 0;

    for (const state of this.answerStates.values()) {
      if (state.confirmedAnswer) {
        successCount++;
      } else {
        failedCount++;
      }
    }

    Application.App.log.Info(
      `批量破解完成 - 成功: ${successCount}, 失败: ${failedCount}, ` +
      `总轮数: ${round}, 总接口调用: ${this.totalApiCalls}`
    );

    return {
      successCount,
      failedCount,
      totalRounds: round,
      totalApiCalls: this.totalApiCalls,
      details: this.answerStates
    };
  }

  /**
   * 获取答题状态
   * @param questionId 题目ID
   * @returns 答题状态
   */
  public getAnswerState(questionId: string): AnswerState | undefined {
    return this.answerStates.get(questionId);
  }

  /**
   * 获取所有答题状态
   * @returns 所有答题状态
   */
  public getAllAnswerStates(): Map<string, AnswerState> {
    return this.answerStates;
  }

  /**
   * 获取确定的答案列表
   * @returns 确定的答案映射表（题目ID -> 选项ID）
   */
  public getConfirmedAnswers(): Map<string, string> {
    const confirmedAnswers = new Map<string, string>();

    for (const [questionId, state] of this.answerStates) {
      if (state.confirmedAnswer) {
        confirmedAnswers.set(questionId, state.confirmedAnswer);
      }
    }

    return confirmedAnswers;
  }

  /**
   * 获取未确定答案的题目列表
   * @returns 未确定答案的题目ID列表
   */
  public getUnresolvedQuestions(): string[] {
    const unresolved: string[] = [];

    for (const [questionId, state] of this.answerStates) {
      if (!state.confirmedAnswer) {
        unresolved.push(questionId);
      }
    }

    return unresolved;
  }

  /**
   * 清除所有答题状态
   */
  public clear(): void {
    this.answerStates.clear();
    this.totalApiCalls = 0;
  }

  /**
   * 延迟函数
   * @param ms 毫秒数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}