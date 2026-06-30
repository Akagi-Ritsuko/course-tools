/*
 * @Author: guotao
 * @Date: 2025-09-27 02:32:51
 * @LastEditors: guotao
 * @LastEditTime: 2026-05-18 14:10:34
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
import { CourseDetailItem, TaskInfo, TaskStatus } from "./types";
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
    /** 当前课程ID */
    protected currentCourseId: string = "";

    public Init(): Promise<any> {
        return new Promise(async (resolve) => {
            let first = true;
            window.onresize = null;
            Application.App.log.Debug("初始化course课程任务");
            Application.App.log.Debug("当前页面URL:", window.location.href);
            Application.App.log.Debug("当前页面hash:", window.location.hash);
            
            this.addEventListener("courseTaskComplete", () => {
                this.notifyStudyMapCourseComplete();
            });
            
            // 设置页面关闭监听
            this.setupCloseCourseListener();
            
            this.hookCourseDetailRequests();
            
            window.addEventListener("load", async () => {
                Application.App.log.Debug("document.addEventListener(load)");
                let prev: HTMLElement;
                const container =
                    document.querySelector(ZSGL_CONSTANTS.SELECTORS.WATERMARK_FRAME) || document.body;
                prev = document.createElement("div");
                container.prepend(prev);
                // const bar = new ZsglCourseControlBar(prev);
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
                // const bar = new ZsglCourseControlBar(prev);
                this.OperateCard();
                first && resolve(undefined);
                first = false;
            }
        });
    }
    public courseTaskCompleteFc() {
        this.callEvent("courseTaskComplete");
        this.notifyStudyMapCourseComplete();
    }
    /** 钩子获取课程详情请求 */
    protected hookCourseDetailRequests(): void {
        Application.App.log.Debug("设置HTTP钩子，监听:", ZSGL_CONSTANTS.HTTP_ENDPOINTS.QUERY_COURSE_DETAIL);
        
        const self = this;
        
        hookHttpRequest(
          ZSGL_CONSTANTS.HTTP_ENDPOINTS.QUERY_COURSE_DETAIL,
          (response: any, context: any, url: string) => {
            Application.App.log.Info("匹配到课程详情请求:", url);

            try {
              Application.App.log.Debug(
                "课程详情请求响应:",
                JSON.stringify(response).substring(0, 500),
              );

              const responseData = response?.body;
              const courseFileArr = responseData?.courseFileArr;
              const courseId = responseData?.courseId;

              if (courseId) {
                self.currentCourseId = courseId;
              }

              if (courseFileArr && courseFileArr.length > 0) {
                const allCompleted = courseFileArr.every(
                  (item: any) => item.hasLearned === "1",
                );

                if (allCompleted) {
                  Application.App.log.Info("课程已完成，所有任务都已学习");
                  self.callEvent("courseTaskComplete");
                } else {
                  self.courseDetailData = courseFileArr
                    .map(
                      (item: any, index: number): CourseDetailItem => {
                        return {
                          hasLearned: item.hasLearned,
                          fileName: item.fileName,
                          cwType: item.cwType,
                          jobIndex: index,
                          courseId,
                          playTime: item.playTime,
                          learnedDuration: item.learnedDuration,
                        };
                      },
                    )
                    .filter((item: CourseDetailItem) => {
                      return item.hasLearned === "0";
                    });
                  Application.App.log.Info(
                    "课程详情数据已获取，共",
                    self.courseDetailData.length,
                    "个未完成任务",
                  );
                  Application.App.log.Debug(
                    "课程详情数据",
                    self.courseDetailData,
                  );
                }
              } else {
                Application.App.log.Info("课程数据为空");
                self.callEvent("courseTaskComplete");
              }
            } catch (e) {
              Application.App.log.Error("数据解析失败", e);
            }
          },
          this,
        );
    }

    public Stop(): Promise<any> {
        this.timerManager.clearAll();
        this.taskList.forEach(task => task.Stop());
        return Promise.resolve();
    }

    /** 通知学习地图课程完成,也可能是通知每日任务 */
    private notifyStudyMapCourseComplete(): void {
        const now = Date.now();
        
        const prefixes = [ZSGL_CONSTANTS.STORAGE_PREFIX, "zsgl_daily_task_"];

        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          for (const prefix of prefixes) {
            if (key?.startsWith(prefix)) {
              try {
                const value = JSON.parse(localStorage.getItem(key) || "{}");
                // if (value.status === "started" && value.expire > now) {
                //   const taskStatus: TaskStatus = {
                //     status: "finished",
                //     expire: value.expire,
                //   };
                //   localStorage.setItem(key, JSON.stringify(taskStatus));
                //   Application.App.log.Info(
                //     "课程超时，已更新 localStorage",
                //     key,
                //   );
                //   return;
                //   }
                  if (key === `${ZSGL_CONSTANTS.STORAGE_PREFIX}${this.currentCourseId}`) {
                      const taskStatus: TaskStatus = {
                        status: "finished",
                        expire: value.expire,
                    };
                    localStorage.setItem(key, JSON.stringify(taskStatus));
                    Application.App.log.Info(
                        "课程完成，已更新 localStorage",
                        key,
                      );
                      window.close();
                      return;
                }
              } catch (e) {
                Application.App.log.Warn("解析 localStorage 失败", key);
              }
            }
          }
        }
        Application.App.log.Warn("未找到对应的课程状态 key");
    }

    /** 设置页面关闭监听 */
    private setupCloseCourseListener(): void {
        window.addEventListener('storage', (e: StorageEvent) => {
            if (e.key && e.key.startsWith('zsgl_close_course_') && e.newValue) {
                try {
                    const closeStatus = JSON.parse(e.newValue);
                    if (closeStatus.status === 'close') {
                        Application.App.log.Info(`[关闭监听] 收到关闭课程通知: courseId=${closeStatus.courseId}`);
                        Application.App.log.Debug(`[关闭监听] 收到关闭课程通知`, closeStatus);
                        
                        // 清理标志位
                        localStorage.removeItem(e.key);
                        
                        // 尝试关闭页面
                        this.closeCoursePage();
                    }
                } catch (err) {
                    Application.App.log.Warn(`[关闭监听] 解析关闭状态失败: ${err}`);
                }
            }
        });

        // 轮询检测关闭标志位
        this.timerManager.setInterval('checkCloseFlag', () => {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('zsgl_close_course_')) {
                    try {
                        const value = JSON.parse(localStorage.getItem(key) || '{}');
                        if (value.status === 'close') {
                            Application.App.log.Info(`[关闭轮询] 检测到关闭标志: ${key}`);
                            localStorage.removeItem(key);
                            this.closeCoursePage();
                            return;
                        }
                    } catch (err) {
                        Application.App.log.Warn(`[关闭轮询] 解析失败: ${err}`);
                    }
                }
            }
        }, 3000);
    }

    /** 关闭课程页面 */
    private closeCoursePage(): void {
        Application.App.log.Info('[关闭页面] 尝试关闭课程页面');
        
        // 先停止所有任务
        this.Stop();
        
        // 尝试关闭窗口
        window.close();
        
        // 如果 window.close() 不起作用（可能是因为脚本打开的窗口），提示用户
        setTimeout(() => {
            Application.App.log.Info('[关闭页面] 无法自动关闭页面，请手动关闭');
            alert('学习积分已达上限，请关闭此页面');
        }, 1000);
    }

    public Next(): Promise<Task> {
        return new Promise((resolve) => {
            Application.App.log.Debug("Next 课程任务索引:", this.taskIndex, this.taskList.length);
            if (this.taskList.length > this.taskIndex) {
                resolve(this.taskList[this.taskIndex]);
                return this.taskIndex++;
            } else {
                this.courseTaskCompleteFc();
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
                    this.courseTaskCompleteFc()
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
                this.courseTaskCompleteFc()
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
