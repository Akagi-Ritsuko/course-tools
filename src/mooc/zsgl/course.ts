/*
 * @Author: guotao
 * @Date: 2025-09-27 02:32:51
 * @LastEditors: guotao
 * @LastEditTime: 2025-03-09
 * @FilePath: \course-tools\src\mooc\zsgl\course.ts
 * @Description: zsgl 课程任务管理
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */
import { Application } from "@App/internal/application";
import { ZsglTask, ZsglTaskControlBar } from "./task";
import { TaskFactory } from "./factory";
import { Mooc, MoocTaskSet, MoocEvent } from "@App/internal/app/mooc";
import { Task } from "@App/internal/app/task";
import { EventListener } from "@App/internal/utils/event";
import { hookHttpRequest, CssBtn, TimerManager, findElementByText } from "./utils/utils";
import {
    createBtn,
    protocolPrompt,
} from "@App/internal/utils/utils";
import { CourseDetailItem, TaskInfo } from "./types";
import { ZSGL_CONSTANTS } from "./constants";

/**
 * ZsglCourse 课程任务类
 * 继承自 EventListener<MoocEvent> 并实现 MoocTaskSet 接口
 */
export class ZsglCourse extends EventListener<MoocEvent> implements MoocTaskSet {
    /** 任务列表 */
    protected taskList: Array<ZsglTask> = [];
    /** 附件列表 */
    protected attachments: Array<any>;
    /** 课程详情数据 */
    private courseDetailData: CourseDetailItem[] = [];
    /** 定时器管理器 */
    private timerManager: TimerManager = new TimerManager();
    /** 任务索引 */
    protected taskIndex: number = 0;

    public Init(): Promise<any> {
        return new Promise(async (resolve) => {
            let first = true;
            window.onresize = null;
            Application.App.log.Debug("初始化course课程任务");
            Application.App.log.Debug("当前页面URL:", window.location.href);
            Application.App.log.Debug("当前页面hash:", window.location.hash);
            
            // 先设置钩子，再等待页面加载
            this.hookCourseDetailRequests();
            
            window.addEventListener("load", async () => {
                Application.App.log.Debug("document.addEventListener(load)");
                let prev: HTMLElement;
                const container =
                    document.querySelector(ZSGL_CONSTANTS.SELECTORS.WATERMARK_FRAME) || document.body;
                prev = document.createElement("div");
                container.prepend(prev);
                const bar = new ZsglCourseControlBar(prev);
                this.OperateCard();
                first && resolve(undefined);
                first = false;
            });

            // 如果页面已经加载完成，直接执行
            if (document.readyState === "complete" || document.readyState === "interactive") {
                Application.App.log.Debug("页面已加载完成，直接初始化");
                let prev: HTMLElement;
                const container =
                    document.querySelector(ZSGL_CONSTANTS.SELECTORS.WATERMARK_FRAME) || document.body;
                prev = document.createElement("div");
                container.prepend(prev);
                const bar = new ZsglCourseControlBar(prev);
                this.OperateCard();
                first && resolve(undefined);
                first = false;
            }
        });
    }

    /** 钩子获取课程详情请求 */
    protected hookCourseDetailRequests(): void {
        Application.App.log.Debug("设置HTTP钩子，监听:", ZSGL_CONSTANTS.HTTP_ENDPOINTS.QUERY_COURSE_DETAIL);
        
        const originalOpen = XMLHttpRequest.prototype.open;
        const self = this;

        XMLHttpRequest.prototype.open = function (method: string, url: string) {
            Application.App.log.Debug("拦截到HTTP请求:", url);
            
            if (url.includes(ZSGL_CONSTANTS.HTTP_ENDPOINTS.QUERY_COURSE_DETAIL)) {
                Application.App.log.Info("匹配到课程详情请求:", url);
                
                this.addEventListener('readystatechange', function () {
                    if (this.readyState === 4 && this.status === 200) {
                        try {
                            Application.App.log.Debug("课程详情请求响应:", this.responseText.substring(0, 500));
                            
                            const response = this.responseText.startsWith("{")
                                ? JSON.parse(this.responseText)
                                : this.responseText;
                            
                            const responseData = response?.body;
                            if (responseData && responseData?.isCompleted !== "Y") {
                                const courseFileArr = responseData?.courseFileArr;
                                const courseId = responseData?.courseId;
                                self.courseDetailData = courseFileArr
                                    .map((item: any, index: number): CourseDetailItem => {
                                        return {
                                            hasLearned: item.hasLearned,
                                            fileName: item.fileName,
                                            cwType: item.cwType,
                                            jobIndex: index,
                                            courseId
                                        };
                                    })
                                    .filter((item: CourseDetailItem) => {
                                        return item.hasLearned === "0";
                                    });
                                Application.App.log.Info("课程详情数据已获取，共", self.courseDetailData.length, "个未完成任务");
                                Application.App.log.Debug("课程详情数据", self.courseDetailData);
                            } else {
                                Application.App.log.Info("课程已完成或无数据");
                                self.callEvent("courseTaskComplete");
                            }
                        } catch (e) {
                            Application.App.log.Error("数据解析失败", e);
                        }
                    }
                });
            }
            return originalOpen.apply(this, arguments as any);
        };
    }

    public Stop(): Promise<any> {
        this.timerManager.clearAll();
        this.taskList.forEach(task => task.Stop());
        return Promise.resolve();
    }

    public Next(): Promise<Task> {
        return new Promise((resolve) => {
            if (this.taskList.length > this.taskIndex) {
                resolve(this.taskList[this.taskIndex]);
                return this.taskIndex++;
            } else {
                this.callEvent("courseTaskComplete");
            }
        });
    }

    public SetTaskPointer(index: number): void {
        this.taskIndex = index;
    }

    /** 操作任务卡,一个页面会包含很多任务,取出来 */
    public async OperateCard(): Promise<void> {
        Application.App.log.Debug("OperateCard 课程详情数据长度:", this.courseDetailData.length);
        
        if (this.courseDetailData.length === 0) {
            Application.App.log.Warn("课程详情数据为空，等待数据...");
            // 等待数据加载
            let waitCount = 0;
            this.timerManager.setInterval("waitForData", () => {
                waitCount++;
                Application.App.log.Debug("等待课程数据...", waitCount);
                
                if (this.courseDetailData.length > 0) {
                    this.timerManager.clearInterval("waitForData");
                    this.processCourseData();
                } else if (waitCount > 20) {
                    this.timerManager.clearInterval("waitForData");
                    Application.App.log.Error("等待课程数据超时");
                    this.callEvent("courseTaskComplete");
                }
            }, 1000);
            return;
        }

        this.processCourseData();
    }

    /** 处理课程数据 */
    private async processCourseData(): Promise<void> {
        const loadedFlagValue = this.courseDetailData[0];
        let attemptCount = 0;

        this.timerManager.setInterval("checkTaskDiv", async () => {
            attemptCount++;
            if (attemptCount > ZSGL_CONSTANTS.MAX_ATTEMPT_COUNT) {
                this.timerManager.clearInterval("checkTaskDiv");
                this.callEvent("courseTaskComplete");
                return;
            }

            const taskDiv = findElementByText("span", loadedFlagValue.fileName);
            Application.App.log.Debug("寻找taskDiv", loadedFlagValue.fileName);

            if (taskDiv) {
                this.timerManager.clearInterval("checkTaskDiv");
                await this.buildTasks();
                this.taskIndex = 0;
                this.callEvent("reload");
            }
        }, ZSGL_CONSTANTS.CHECK_INTERVAL_MS);
    }

    /** 构建任务列表 */
    private async buildTasks(): Promise<void> {
        Application.App.log.Info("开始构建任务列表，共", this.courseDetailData.length, "个任务");
        
        for (let index = 0; index < this.courseDetailData.length; index++) {
            const value = this.courseDetailData[index];
            Application.App.log.Debug(`构建任务 ${index + 1}:`, value.fileName, "类型:", value.cwType);
            
            const task = TaskFactory.CreateCourseTask(value);

            if (!task) {
                Application.App.log.Warn(`任务 ${index + 1} 创建失败，跳过`);
                continue;
            }

            task.jobIndex = index;
            this.taskList.push(task);
            task.addEventListener("complete", () => {
                this.callEvent("taskComplete", index, task);
            });
            await task.Init();
            Application.App.log.Debug(`任务 ${index + 1} 初始化完成`);
        }
        
        Application.App.log.Info("任务列表构建完成，共", this.taskList.length, "个有效任务");
    }

    /** 获取下一页元素 */
    protected afterPage(): HTMLElement | null {
        const els = document.querySelectorAll(
            `${ZSGL_CONSTANTS.SELECTORS.NCELLS} > *:not(${ZSGL_CONSTANTS.SELECTORS.CURRENTS}) > ${ZSGL_CONSTANTS.SELECTORS.ORANGE01}`
        );
        const now = document.querySelector(`${ZSGL_CONSTANTS.SELECTORS.NCELLS} > ${ZSGL_CONSTANTS.SELECTORS.CURRENTS}`) as HTMLElement;
        
        for (let i = 0; i < els.length; i++) {
            if (now && now.getBoundingClientRect().top < els[i].getBoundingClientRect().top) {
                return els[i] as HTMLElement;
            }
        }
        return null;
    }

    /** 翻页 */
    protected nextPage(num: number): void {
        let el =
            document.querySelector(`${ZSGL_CONSTANTS.SELECTORS.CURRENTS} ~ span`) as HTMLElement ||
            document.querySelector(ZSGL_CONSTANTS.SELECTORS.PREV_NEXT) as HTMLElement;
        
        if (el != undefined) {
            return el.click();
        }

        el = this.afterPage();
        if (el == undefined) {
            if (
                document.querySelector(`${ZSGL_CONSTANTS.SELECTORS.NCELLS} > *:not(${ZSGL_CONSTANTS.SELECTORS.CURRENTS}) > ${ZSGL_CONSTANTS.SELECTORS.LOCK}`) ==
                undefined
            ) {
                return this.callEvent("complete");
            }
            setTimeout(() => {
                if (num > 5) {
                    return this.callEvent("error", ZSGL_CONSTANTS.ERROR_MESSAGES.LOCKED);
                }
                Application.App.log.Info("等待解锁");
                this.nextPage(num + 1);
            }, 5000);
            return;
        }
        (el.parentElement?.querySelector("a>span") as HTMLElement)?.click();
    }
}

/**
 * ZsglCourseControlBar 课程控制栏类
 */
export class ZsglCourseControlBar extends ZsglTaskControlBar {
    public defaultBtn(): void {
        super.defaultBtn();
        const pass = CssBtn(
            createBtn(ZSGL_CONSTANTS.BUTTON_TEXT.PASS_VIDEO, "秒过视频会被后台检测到", ZSGL_CONSTANTS.CSS_CLASSES.CX_BTN)
        );
        const downloadSubtitle = CssBtn(
            createBtn(ZSGL_CONSTANTS.BUTTON_TEXT.DOWNLOAD_SUBTITLE, "我要下载字幕一同食用")
        );
        pass.style.background = "#F57C00";
        downloadSubtitle.style.background = "#638EE1";
        this.prev.append(pass, this.download(), downloadSubtitle);
        
        pass.onclick = () => {
            if (!protocolPrompt("秒过视频会产生不良记录,是否继续?", "boom_no_prompt")) {
                return;
            }
        };
        
        downloadSubtitle.onclick = () => {
        };
    }
}
