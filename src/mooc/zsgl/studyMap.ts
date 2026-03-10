/*
 * @Author: guotao
 * @Date: 2025-03-15 10:55:02
 * @LastEditors: guotao
 * @LastEditTime: 2025-03-09
 * @FilePath: \course-tools\src\mooc\zsgl\studyMap.ts
 * @Description: zsgl 学习地图模块
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */
import { Task, TaskType } from "@App/internal/app/task";
import { Application } from "@App/internal/application";
import { CssBtn, hookHttpRequest, TimerManager, createStorageHandler, findElementByText } from "./utils/utils";
import { createBtn, protocolPrompt } from "@App/internal/utils/utils";
import { NewChromeServerMessage } from "@App/internal/utils/message";
import { StudyMapData, GateTaskData, TaskStatus } from "./types";
import { ZSGL_CONSTANTS } from "./constants";

/**
 * ZsglStudyMap 学习地图任务类
 */
export class ZsglStudyMap extends Task {
    /** 关卡任务数据 */
    protected gateTaskData: GateTaskData;
    /** 学习地图数据 */
    protected studyMapData: StudyMapData;
    /** 定时器管理器 */
    private timerManager: TimerManager = new TimerManager();

    public Init(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                // 先执行拦截请求
                await this.hookStudymapGateRequests();
                
                // 数据获取完成后执行元素查找
                if (this.studyMapData) {
                    await this.setupCurrentLevelButton();
                } else {
                    this.Done();
                }

                await this.hookStudymapGateTaskRequests();
                
                const taskKey = `${ZSGL_CONSTANTS.STORAGE_PREFIX}${this.gateTaskData?.resourceId}`;
                Application.App.log.Debug("zsglStudyMap开始初始化任务", taskKey);

                this.setupMessageListener(taskKey);
                Application.App.log.Debug("拦截请求完成hookStudymapGateTaskRequests", this.gateTaskData);
                this.defaultStartButton();
                Application.App.log.Debug("Application.App.config.studymap_auto", Application.App.config.studymap_auto);

                this.addEventListenerOnce("load", () => {
                    Application.App.log.Debug("reload");
                    this.Init();
                });

                resolve();
            } catch (error) {
                Application.App.log.Error("初始化失败", error);
                reject(error);
            }
        });
    }

    /** 设置当前关卡按钮 */
    private async setupCurrentLevelButton(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.timerManager.setInterval("checkLevelBtn", async () => {
                const currentbutton = Array.from(
                    document.querySelectorAll("li")
                ).find((li) => {
                    return li.textContent?.includes(`第 ${this.studyMapData.gateNameIndex + 1} 关`);
                });

                if (currentbutton) {
                    this.timerManager.clearInterval("checkLevelBtn");
                    currentbutton.addEventListener('click', async () => {
                        Application.App.log.Info('按钮被点击，开始执行任务');
                        // 这里添加自定义逻辑
                        if (this.gateTaskData && Application.App.config.studymap_auto === true) {
                            await this.Start();
                        }
                    });
                    currentbutton.click();
                    Application.App.log.Debug(
                        currentbutton,
                        "init当前按钮",
                        `第 ${this.studyMapData.gateNameIndex + 1} 关`
                    );
                    resolve();
                }
            }, ZSGL_CONSTANTS.CHECK_INTERVAL_MS);
        });
    }

    /** 设置消息监听器 */
    private setupMessageListener(taskKey: string): void {
        const msg = NewChromeServerMessage("zsgl-tools");
        msg.Accept((client, data) => {
            Application.App.log.Debug("zsglStudyMap接受消息", data);
            switch (data.type) {
                case taskKey: {
                    Application.App.log.Info("studyMap 任务完成", data);
                    window.location.reload();
                    break;
                }
            }
        });
    }

    /** 默认开始按钮 */
    protected defaultStartButton(): void {
        this.timerManager.setInterval("createStartBtn", () => {
            Application.App.log.Debug("开始创建开始按钮");
            const prev = document.querySelector(ZSGL_CONSTANTS.SELECTORS.MUI_LIST_ROOT);

            if (prev) {
                const startBtn = CssBtn(
                    createBtn(
                        Application.App.config.studymap_auto ? ZSGL_CONSTANTS.BUTTON_TEXT.STOP_AUTO : ZSGL_CONSTANTS.BUTTON_TEXT.START_AUTO,
                        "点击开始自动挂机",
                        ZSGL_CONSTANTS.CSS_CLASSES.ZSGL_AUTO_BTN
                    )
                );

                startBtn.addEventListener("click", () => {
                    if (startBtn.innerText === ZSGL_CONSTANTS.BUTTON_TEXT.STOP_AUTO) {
                        Application.App.config.studymap_auto = false;
                        startBtn.innerText = ZSGL_CONSTANTS.BUTTON_TEXT.START_AUTO;
                        startBtn.title = "点击开始自动挂机";
                        Application.App.log.Info("挂机停止了");
                    } else {
                        Application.App.config.studymap_auto = true;
                        startBtn.innerText = ZSGL_CONSTANTS.BUTTON_TEXT.STOP_AUTO;
                        startBtn.title = "停止挂机,开始好好学习";
                        Application.App.log.Info("挂机开始了");
                        this.Init();
                    }
                });

                prev.prepend(startBtn);
                this.timerManager.clearInterval("createStartBtn");
            }
        }, ZSGL_CONSTANTS.CHECK_INTERVAL_MS);
    }

    /** 拦截学习地图关卡请求 */
    protected hookStudymapGateRequests(): Promise<void> {
        return new Promise((resolve) => {
            hookHttpRequest(
                ZSGL_CONSTANTS.HTTP_ENDPOINTS.QUERY_STUDYMAP_GATE,
                (response, self) => {
                    Application.App.log.Debug("原始响应数据", response);
                    const responseData = response?.body;
                    self.studyMapData = responseData
                        .map((item: any, index: number): StudyMapData => {
                            const gateName = item.gateName;
                            const gateNameIndex = index;
                            Application.App.log.Debug(gateName, gateNameIndex, "当前关卡");
                            return {
                                gateName,
                                gateNameIndex,
                                status: item.status,
                                finishTaskNum: item.finishTaskNum,
                                taskNum: item.taskNum,
                            };
                        })
                        .find((item: StudyMapData) => item.status !== 3 || item.finishTaskNum !== item.taskNum);

                    Application.App.log.Debug("成功拦截课程数据", {
                        courseCount: self.studyMapData?.length || 0,
                        gateName: self.studyMapData?.gateName || "",
                    });
                    Application.App.log.Debug("筛选的结果数据", self.studyMapData);
                    resolve();
                },
                this
            );
        });
    }

    /** 拦截学习地图关卡任务请求 */
    protected hookStudymapGateTaskRequests(): Promise<void> {
        return new Promise((resolve) => {
            hookHttpRequest(
                ZSGL_CONSTANTS.HTTP_ENDPOINTS.QUERY_STUDYMAP_GATE_TASK,
                (response, self) => {
                    Application.App.log.Debug("原始响应数据queryStudymapGateTask", response);
                    const responseData = response?.body;
                    self.gateTaskData = responseData.taskList.find(
                        (item: { status: number }) => item.status !== 1
                    );
                    Application.App.log.Debug("成功拦截课程任务数据queryStudymapGateTask", {
                        taskCount: self.gateTaskData?.length || 0,
                        taskName: self.gateTaskData?.taskName || "",
                        taskId: self.gateTaskData?.resourceId || "",
                    });
                    resolve();
                },
                this
            );
        });
    }

    public Done(): boolean {
        return this.studyMapData === null;
    }

    /** 开始执行课程任务 */
    public Start(): Promise<any> {
        Application.App.log.Info("开始执行课程任务");
        return new Promise<void>((resolve) => {
            this.timerManager.setInterval("findTaskBtn", () => {
                Application.App.log.Debug("课程任务执行完成", this.gateTaskData?.taskName);
                const currentHtmlList = Array.from(document.querySelectorAll("li.MuiListItem-root"));
                let currentbutton: HTMLElement | null = null;

                currentHtmlList.forEach((li) => {
                    const currentP = Array.from(li.querySelectorAll("p")).find((p) => {
                        return p.innerText.includes(this.gateTaskData?.taskName);
                    });
                    if (currentP) {
                        currentbutton = currentP;
                    }
                });

                Application.App.log.Debug(currentbutton, "开始任务中的当前按钮");
                if (currentbutton) {
                    this.timerManager.clearInterval("findTaskBtn");
                    currentbutton.click();

                    const taskKey = `${ZSGL_CONSTANTS.STORAGE_PREFIX}${this.gateTaskData.resourceId}`;
                    const taskStatus: TaskStatus = {
                        status: "started",
                        expire: Date.now() + ZSGL_CONSTANTS.TASK_EXPIRE_MS,
                    };
                    localStorage.setItem(taskKey, JSON.stringify(taskStatus));

                    const handler = createStorageHandler(taskKey);
                    window.addEventListener("storage", handler);
                    resolve();
                }
            }, ZSGL_CONSTANTS.CHECK_INTERVAL_MS);
        });
    }

    public Type(): TaskType {
        return 'studyMap';
    }

    public Stop(): Promise<void> {
        this.timerManager.clearAll();
        return Promise.resolve();
    }
}
