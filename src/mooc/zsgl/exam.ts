/*
 * @Author: guotao
 * @Date: 2025-03-09
 * @LastEditors: guotao
 * @LastEditTime: 2026-03-15 15:10:13
 * @FilePath: \course-tools1\src\mooc\zsgl\exam.ts
 * @Description: zsgl 考试模块
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */
import { Task, TaskType } from "@App/internal/app/task";
import { Application } from "@App/internal/application";
import { CssBtn, hookHttpRequest, TimerManager, findElementByText } from "./utils/utils";
import { createBtn, protocolPrompt } from "@App/internal/utils/utils";
import { NewChromeServerMessage } from "@App/internal/utils/message";
import { ZsglTask, ZsglTaskControlBar } from "./task";
import { TaskFactory } from "./factory";
import { Mooc, MoocTaskSet, MoocEvent } from "@App/internal/app/mooc";
import { EventListener } from "@App/internal/utils/event";
import { AES, enc, mode, pad } from "crypto-js";
import { QuestionInfo, QuestionSection } from "./types";
import { ZSGL_CONSTANTS } from "./constants";

/**
 * ZsglExam 类，用于在线考试功能
 * 继承自 EventListener<MoocEvent> 并实现 MoocTaskSet 接口
 */
export class ZsglExam extends EventListener<MoocEvent> implements MoocTaskSet {
    /** 存储题目列表 */
    protected questionList: QuestionInfo[] = [];
    /** 开始考试按钮 */
    protected startButton: HTMLElement;
    /** 提交试卷按钮 */
    protected submitButton: HTMLSpanElement;
    /** 下一题按钮 */
    protected nextButton: HTMLSpanElement;
    /** 任务列表 */
    protected taskList: Array<Task> = [];
    /** 当前任务索引 */
    protected taskIndex: number = 0;
    /** 定时器管理器 */
    private timerManager: TimerManager = new TimerManager();

    /**
     * 初始化考试
     * @returns 返回一个Promise对象
     */
    public Init(): Promise<any> {
        return new Promise<void>(async (resolve) => {
            this.setupReturnButton();
            await this.hookQuestionDetailRequests();
            await this.OperateCard();
            this.setupNavigationButtons();
            resolve();
        });
    }

    /** 设置返回按钮 */
    private setupReturnButton(): void {
        this.timerManager.setInterval("checkReturnBtn", async () => {
            const startButton = Array.from(
                document.querySelectorAll(ZSGL_CONSTANTS.SELECTORS.MUI_BUTTON_LABEL)
            ).find((span) => {
                return span.textContent?.includes(ZSGL_CONSTANTS.BUTTON_TEXT.RETURN);
            });

            if (startButton) {
                startButton.addEventListener("click", async () => {
                    Application.App.log.Info("点击了返回按钮");
                });
                Application.App.log.Debug("找到返回按钮", startButton);
                this.timerManager.clearInterval("checkReturnBtn");
            }
        }, ZSGL_CONSTANTS.CHECK_INTERVAL_MS);
    }

    /** 设置导航按钮 */
    private setupNavigationButtons(): void {
        this.timerManager.setInterval("checkNavBtns", async () => {
            const buttonList = Array.from(
                document.querySelectorAll(ZSGL_CONSTANTS.SELECTORS.MUI_BUTTON_LABEL)
            );

            this.submitButton = Array.from(document.querySelectorAll("div")).find(
                (span) => span.textContent?.includes(ZSGL_CONSTANTS.BUTTON_TEXT.SUBMIT_EXAM)
            ) as HTMLSpanElement;

            this.nextButton = buttonList.find((span) => {
                return span.textContent?.includes(ZSGL_CONSTANTS.BUTTON_TEXT.NEXT_QUESTION);
            }) as HTMLSpanElement;

            if (this.submitButton && this.nextButton) {
                this.nextButton.addEventListener("click", async () => {
                    Application.App.log.Debug("下一题按钮被点击");
                    await this.answerMessage(this.questionList);
                });
                this.timerManager.clearInterval("checkNavBtns");
                Application.App.log.Debug("按钮初始化成功", {
                    submit: this.submitButton,
                    next: this.nextButton
                });
            }
        }, ZSGL_CONSTANTS.CHECK_INTERVAL_MS);
    }

    /**
     * 显示答案消息
     * @param questionList 题目列表
     */
    public async answerMessage(questionList: QuestionInfo[]): Promise<void> {
        setTimeout(async () => {
            const allP = Array.from(document.querySelectorAll(`${ZSGL_CONSTANTS.SELECTORS.MUI_PAPER_ROOT} *`));
            
            for (const question of questionList) {
                const matchedP = this.findMatchingElement(allP, question);
                
                if (!matchedP) continue;

                const correctAnswers = question.sectionRespList
                    .filter((section: QuestionSection) => section.isCorrect === "Y")
                    .map((section: QuestionSection) => section.sectionText);

                if (correctAnswers.length) {
                    Application.App.log.Info(`题目:${question.questionText}`);
                    Application.App.log.Info(`正确答案集`, correctAnswers.join(" | "));
                }
            }
        }, 1000);
    }

    /**
     * 查找匹配的元素
     * @param elements 元素列表
     * @param question 题目信息
     */
    private findMatchingElement(elements: Element[], question: QuestionInfo): Element | null {
        return elements.find((p) => {
            const questionTextList = question.questionText.split(/<p>/i);
            let questionText = questionTextList.length > 1
                ? questionTextList[questionTextList.length - 1]
                : questionTextList[0];
            questionText = questionText.replace(/<\/p>/i, "");
            return p.textContent?.includes(questionText);
        }) || null;
    }

    /**
     * 钩子获取题目详情的请求
     * @returns 返回一个Promise对象
     */
    protected hookQuestionDetailRequests(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            await hookHttpRequest(
                ZSGL_CONSTANTS.HTTP_ENDPOINTS.QUERY_QUESTION_DETAIL,
                (response, self) => {
                    Application.App.log.Debug("原始响应数据", response);
                    if (response) {
                        const decrypted = self.decryptData(response);
                        if (decrypted) {
                            try {
                                self.questionList = JSON.parse(JSON.parse(decrypted).body);
                                if (self.questionList.length !== 0) {
                                    resolve();
                                }
                                Application.App.log.Debug("解密后的响应数据", self.questionList);
                            } catch (e) {
                                Application.App.log.Error("解析题目数据失败", e);
                                reject(e);
                            }
                        }
                    }
                },
                this
            );
        });
    }

    /**
     * 解密数据
     * @param encryptedData 加密数据
     */
    private decryptData(encryptedData: string): string | null {
        try {
            const decryptionConfig = {
                iv: enc.Utf8.parse(ZSGL_CONSTANTS.AES_CONFIG.IV),
                mode: mode.CBC,
                padding: pad.Pkcs7,
            };

            const decrypted = AES.decrypt(
                encryptedData,
                enc.Utf8.parse(ZSGL_CONSTANTS.AES_CONFIG.SECRET_KEY),
                decryptionConfig
            );

            return decrypted.toString(enc.Utf8);
        } catch (error) {
            Application.App.log.Error("解密失败，请检查密钥、IV或密文:", error);
            return null;
        }
    }

    /** 停止 */
    public Stop(): Promise<any> {
        this.timerManager.clearAll();
        return Promise.resolve();
    }

    /** 返回下一题 */
    public Next(): Promise<Task> {
        return new Promise((resolve) => {
            if (this.taskList.length > this.taskIndex) {
                resolve(this.taskList[this.taskIndex]);
                Application.App.log.Debug("返回下一题Next", this.taskIndex);
                return this.taskIndex++;
            } else {
                this.callEvent("examTaskComplete");
            }
        });
    }

    /** 考试完成 */
    public examComplete(): void {
        Application.App.log.Info("考试完成");
    }

    /** 操作任务卡 */
    public async OperateCard(): Promise<void> {
        Application.App.log.Debug("开始操作任务卡");
        await this.answerMessage(this.questionList);

        for (let index = 0; index < this.questionList.length; index++) {
            const value = this.questionList;
            const task = TaskFactory.CreateQuestionTask(value);
            
            if (!task) {
                continue;
            }
            
            task.jobIndex = index;
            this.taskList.push(task);
            task.addEventListener("complete", () => {
                Application.App.log.Debug("任务完成", this.taskIndex);
                const currentTask = this.taskList[this.taskIndex];
                this.callEvent("questionTaskComplete", this.taskIndex, currentTask);
                if (this.taskIndex === this.questionList.length - 1) {
                    this.examComplete();
                }
            });
            await task.Init();
        }

        Application.App.log.Debug("任务列表", this.taskList);
        this.taskIndex = 0;
        this.callEvent("examReload");
    }

    /** 设置任务点位置 */
    public SetTaskPointer(index: number): void {
        this.taskIndex = index;
    }
}

/**
 * ZsglQuestionTask 题目任务类
 */
export class ZsglQuestionTask extends ZsglTask {
    nextButton: HTMLSpanElement;
    submitButton: HTMLElement;
    lastButton: HTMLElement;
    private timerManager: TimerManager = new TimerManager();

    public Start(): Promise<any> {
        return new Promise<void>(async (resolve, reject) => {
            Application.App.log.Debug("开始任务", this.taskinfo);
            resolve();
        });
    }

    public Init(): Promise<any> {
        return new Promise<void>(async (resolve, reject) => {
            let nextButtonFlag = true;
            
            this.timerManager.setInterval("checkButtons", async () => {
                Application.App.log.Debug("开始检查按钮", this.jobIndex);
                
                const buttonList = Array.from(
                    document.querySelectorAll(ZSGL_CONSTANTS.SELECTORS.MUI_BUTTON_LABEL)
                );
                
                this.submitButton = Array.from(document.querySelectorAll("div")).find(
                    (span) => span.textContent?.includes(ZSGL_CONSTANTS.BUTTON_TEXT.SUBMIT_EXAM)
                ) as HTMLElement;
                
                this.nextButton = buttonList.find((span) => {
                    return span.textContent?.includes(ZSGL_CONSTANTS.BUTTON_TEXT.NEXT_QUESTION);
                }) as HTMLSpanElement;
                
                this.lastButton = buttonList.find((span) => {
                    return span.textContent?.includes(ZSGL_CONSTANTS.BUTTON_TEXT.PREV_QUESTION);
                }) as HTMLSpanElement;

                if (this.nextButton && nextButtonFlag && this.jobIndex === 0) {
                    this.nextButton.addEventListener("click", async () => {
                        Application.App.log.Debug("按钮被点击，开始考试");
                        this.callEvent("complete");
                    });
                    nextButtonFlag = false;
                }
                
                if ((this.nextButton || this.lastButton) && this.submitButton) {
                    this.timerManager.clearInterval("checkButtons");
                    resolve();
                }
            }, ZSGL_CONSTANTS.CHECK_INTERVAL_MS);
        });
    }

    public Type(): TaskType {
        return "exam";
    }
}
