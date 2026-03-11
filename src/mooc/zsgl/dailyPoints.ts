/*
 * @Author: guotao
 * @Date: 2025-03-15
 * @Description: zsgl 每日积分模式模块
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */
import { Task, TaskType } from "@App/internal/app/task";
import { Application } from "@App/internal/application";
import { TimerManager, hookHttpRequest } from "./utils/utils";
import { NewChromeServerMessage } from "@App/internal/utils/message";
import { CourseItem, CourseListResponse } from "./types";

/**
 * 积分类型枚举
 */
export enum PointsType {
  LEARNING = "learning", // 学习积分
  CONTRIBUTION = "contribution", // 贡献积分
  INTERACTION = "interaction", // 互动积分
}

/**
 * 积分状态接口
 */
export interface PointsStatus {
  type: PointsType;
  current: number; // 当前积分
  limit: number; // 每日上限
  target?: number; // 目标积分（可选）
}

/**
 * 每日积分状态
 */
export interface DailyPointsState {
  learning: PointsStatus; // 学习积分状态
  contribution: PointsStatus; // 贡献积分状态
  interaction: PointsStatus; // 互动积分状态
  lastUpdate: number; // 最后更新时间
  isRunning: boolean; // 是否正在运行
}

/**
 * 积分任务类型
 */
export type PointsTaskType = "course" | "knowledgeRead" | "knowledgeShare";

/**
 * ZsglDailyPoints 每日积分模式类
 */
export class ZsglDailyPoints extends Task {
  /** 积分状态 */
  protected pointsState: DailyPointsState;
  /** 定时器管理器 */
  private timerManager: TimerManager = new TimerManager();
  /** 知识页面链接 */
  protected knowledgePageUrl: string;
  /** 当前任务类型 */
  protected currentTaskType: PointsTaskType | null = null;
  /** 任务队列 */
  protected taskQueue: PointsTaskType[] = [];

  constructor() {
    super();
    this.knowledgePageUrl = Application.App.config.knowledge_page_url || "";
    this.pointsState = this.initPointsState();
  }

  /**
   * 初始化积分状态
   */
  private initPointsState(): DailyPointsState {
    return {
      learning: {
        type: PointsType.LEARNING,
        current: 0,
        limit: 100,
        target: Application.App.config.daily_points_target || 100,
      },
      contribution: {
        type: PointsType.CONTRIBUTION,
        current: 0,
        limit: 300,
        target: Application.App.config.daily_points_target || 300,
      },
      interaction: {
        type: PointsType.INTERACTION,
        current: 0,
        limit: 100,
        target: Application.App.config.daily_points_target || 100,
      },
      lastUpdate: Date.now(),
      isRunning: false,
    };
  }

  /**
   * 加载积分状态（从localStorage）
   */
  protected loadPointsState(): void {
    const saved = localStorage.getItem("zsgl_daily_points_state");
    if (saved) {
      try {
        const state = JSON.parse(saved) as DailyPointsState;
        // 检查是否是今天的数据
        const today = new Date().setHours(0, 0, 0, 0);
        const lastUpdateDay = new Date(state.lastUpdate).setHours(0, 0, 0, 0);

        if (today === lastUpdateDay) {
          this.pointsState = state;
        } else {
          // 新的一天，重置积分
          this.pointsState = this.initPointsState();
        }
      } catch (e) {
        Application.App.log.Error("加载积分状态失败", e);
        this.pointsState = this.initPointsState();
      }
    }
  }

  /**
   * 保存积分状态（到localStorage）
   */
  protected savePointsState(): void {
    this.pointsState.lastUpdate = Date.now();
    localStorage.setItem(
      "zsgl_daily_points_state",
      JSON.stringify(this.pointsState),
    );
  }

  /**
   * 更新积分
   */
  protected updatePoints(type: PointsType, points: number): void {
    const status = this.pointsState[type];
    status.current = Math.min(status.current + points, status.limit);
    this.savePointsState();
    this.updatePointsPanel();
    Application.App.log.Info(
      `${type}积分增加 ${points}，当前：${status.current}/${status.limit}`,
    );
  }

  /**
   * 检查积分是否达到上限
   */
  protected isPointsFull(type: PointsType): boolean {
    return this.pointsState[type].current >= this.pointsState[type].limit;
  }

  /**
   * 检查所有积分是否都达到上限
   */
  protected isAllPointsFull(): boolean {
    return Object.values(PointsType).every((type) => this.isPointsFull(type));
  }

  /**
   * 获取下一个任务
   */
  protected getNextTask(): PointsTaskType | null {
    // 优先级：知识分享 > 知识阅读 > 普通课程
    if (!this.isPointsFull(PointsType.INTERACTION) && this.knowledgePageUrl) {
      return "knowledgeShare";
    }
    if (!this.isPointsFull(PointsType.CONTRIBUTION) && this.knowledgePageUrl) {
      return "knowledgeRead";
    }
    if (!this.isPointsFull(PointsType.LEARNING)) {
      return "course";
    }
    return null;
  }

  public Type(): TaskType {
    return "dailyPoints";
  }

  public Init(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        this.loadPointsState();
        Application.App.log.Info("每日积分模式初始化完成", this.pointsState);
        resolve();
      } catch (error) {
        Application.App.log.Error("每日积分模式初始化失败", error);
        reject(error);
      }
    });
  }

  public Start(): Promise<any> {
    return new Promise<void>(async (resolve) => {
      if (this.isAllPointsFull()) {
        Application.App.log.Info("所有积分已达上限，停止每日积分模式");
        resolve();
        return;
      }

      this.pointsState.isRunning = true;
      this.savePointsState();

      const nextTask = this.getNextTask();
      if (nextTask) {
        Application.App.log.Info(`开始执行任务：${nextTask}`);
        this.currentTaskType = nextTask;

        switch (nextTask) {
          case "course":
            await this.executeCourseTask();
            break;
          case "knowledgeRead":
            await this.executeKnowledgeReadTask();
            break;
          case "knowledgeShare":
            await this.executeKnowledgeShareTask();
            break;
        }
      }

      resolve();
    });
  }

  /**
   * 执行普通课程任务
   */
  protected async executeCourseTask(): Promise<void> {
    Application.App.log.Info("开始普通课程任务");

    // 导航至课程列表页面
    const targetUrl = "https://zsgl.lzlj.com/znWeb/znPortal/#/home/course";
    if (!window.location.href.includes("/home/course")) {
      Application.App.log.Info("跳转到课程列表页面");
      window.location.href = targetUrl;
      return;
    }

    // 拦截课程列表接口
    const courseData = await this.hookCourseListRequest();
    if (!courseData) {
      Application.App.log.Error("获取课程列表数据失败");
      return;
    }

    // 查找未完成的课程
    const unfinishedCourse = this.findUnfinishedCourseFromData(courseData);
    if (!unfinishedCourse) {
      Application.App.log.Info("当前页没有未完成的课程，尝试点击查看更多");

      // 点击查看更多按钮
      const hasMore = await this.clickViewMoreButton();
      if (hasMore) {
        // 重新执行课程任务
        await this.executeCourseTask();
      } else {
        Application.App.log.Info("所有课程已完成");
      }
      return;
    }

    // 在页面中找到并点击对应的课程元素
    const courseElement = await this.findCourseElementByName(
      unfinishedCourse.courseName,
    );
    if (!courseElement) {
      Application.App.log.Error("未找到课程元素", unfinishedCourse.courseName);
      return;
    }

    // 设置任务完成监听
    this.setupCourseTaskCompletionListener();

    // 点击课程
    courseElement.click();
    Application.App.log.Info("点击课程，等待跳转", unfinishedCourse.courseName);
  }

  /**
   * 拦截课程列表请求
   */
  protected async hookCourseListRequest(): Promise<CourseItem[] | null> {
    return new Promise((resolve) => {
      let resolved = false;

      // 设置超时
      const timeout = setTimeout(() => {
        if (!resolved) {
          Application.App.log.Warn("课程列表请求拦截超时");
          resolved = true;
          resolve(null);
        }
      }, 10000);

      hookHttpRequest(
        "courselist.do",
        (response: any) => {
          if (!resolved) {
            clearTimeout(timeout);
            Application.App.log.Debug("拦截到课程列表请求", response);

            if (response && response.body && response.body.courseArr) {
              resolved = true;
              resolve(response.body.courseArr as CourseItem[]);
            } else {
              resolved = true;
              resolve(null);
            }
          }
        },
        this,
      );

      // 如果数据已经存在，直接返回
      // 某些情况下页面可能已经加载完成
      setTimeout(() => {
        // 尝试从页面中获取数据
      }, 1000);
    });
  }

  /**
   * 从数据中查找未完成的课程
   */
  protected findUnfinishedCourseFromData(
    courseArr: CourseItem[],
  ): CourseItem | null {
    for (const course of courseArr) {
      if (course.iscompleted === 0) {
        Application.App.log.Info("找到未完成的课程", course.courseName);
        return course;
      }
    }
    return null;
  }

  /**
   * 根据课程名称查找课程元素
   */
  protected async findCourseElementByName(
    courseName: string,
  ): Promise<HTMLElement | null> {
    return new Promise((resolve) => {
      this.timerManager.setInterval(
        "findCourseElement",
        () => {
          // 查找所有可能的课程元素
          const elements = document.querySelectorAll(
            "div.defineTitle, div.jss209, [class*='defineTitle']",
          );

          for (const element of elements) {
            const text = element.textContent?.trim();
            if (
              text === courseName ||
              element.getAttribute("title") === courseName
            ) {
              this.timerManager.clearInterval("findCourseElement");
              Application.App.log.Debug("找到课程元素", text);

              // 找到可点击的父元素
              let clickableElement: HTMLElement | null = element as HTMLElement;
              let attempts = 0;
              while (clickableElement && attempts < 5) {
                if (
                  clickableElement.classList.contains("defineBox") ||
                  clickableElement.classList.contains("jss205") ||
                  clickableElement.getAttribute("clickable")
                ) {
                  resolve(clickableElement);
                  return;
                }
                clickableElement = clickableElement.parentElement as HTMLElement;
                attempts++;
              }

              // 如果没找到可点击的父元素，返回元素本身
              resolve(element as HTMLElement);
              return;
            }
          }
        },
        500,
      );

      // 10秒后超时
      setTimeout(() => {
        this.timerManager.clearInterval("findCourseElement");
        resolve(null);
      }, 10000);
    });
  }

  /**
   * 点击查看更多按钮
   */
  protected async clickViewMoreButton(): Promise<boolean> {
    return new Promise((resolve) => {
      const buttons = document.querySelectorAll("button");

      for (const button of buttons) {
        if (button.textContent?.includes("查看更多")) {
          Application.App.log.Info("点击查看更多按钮");
          button.click();

          // 等待页面加载
          setTimeout(() => {
            resolve(true);
          }, 2000);
          return;
        }
      }

      Application.App.log.Info("未找到查看更多按钮");
      resolve(false);
    });
  }

  /**
   * 设置课程任务完成监听
   */
  protected setupCourseTaskCompletionListener(): void {
    const msg = NewChromeServerMessage("zsgl-tools");
    msg.Accept((client, data) => {
      Application.App.log.Debug("每日积分模式收到消息", data);

      if (data.type === "courseTaskComplete") {
        Application.App.log.Info("课程任务完成");

        // 计算学习积分（假设每个任务10分钟）
        const points = 0.4 * 10;
        this.updatePoints(PointsType.LEARNING, points);

        // 返回课程列表页面，继续下一个任务
        setTimeout(() => {
          window.location.href =
            "https://zsgl.lzlj.com/znWeb/znPortal/#/home/course";
        }, 2000);
      }
    });
  }

  /**
   * 执行知识阅读任务
   */
  protected async executeKnowledgeReadTask(): Promise<void> {
    Application.App.log.Info("开始知识阅读任务");

    // 检查是否配置了知识页面链接
    if (!this.knowledgePageUrl) {
      Application.App.log.Warn("未配置知识页面链接，跳过贡献积分任务");
      return;
    }

    // 跳转到知识页面
    if (!window.location.href.includes(this.knowledgePageUrl)) {
      Application.App.log.Info("跳转到知识页面");
      window.location.href = this.knowledgePageUrl;
      return;
    }

    // 查找自己的知识项
    const knowledgeItem = await this.findMyKnowledgeItem();
    if (!knowledgeItem) {
      Application.App.log.Info("没有找到自己的知识项");
      return;
    }

    // 点击阅读知识
    await this.clickAndReadKnowledge(knowledgeItem);
  }

  /**
   * 查找自己的知识项
   */
  protected async findMyKnowledgeItem(): Promise<HTMLElement | null> {
    return new Promise((resolve) => {
      this.timerManager.setInterval(
        "findKnowledgeItem",
        () => {
          const items = document.querySelectorAll(
            ".knowledge-item, .MuiListItem-root, .list-item",
          );
          for (const item of items) {
            // 查找可点击的知识项
            if (
              item.getAttribute("clickable") ||
              item.classList.contains("clickable")
            ) {
              this.timerManager.clearInterval("findKnowledgeItem");
              resolve(item as HTMLElement);
              return;
            }
          }
        },
        500,
      );

      // 10秒后超时
      setTimeout(() => {
        this.timerManager.clearInterval("findKnowledgeItem");
        resolve(null);
      }, 10000);
    });
  }

  /**
   * 点击并阅读知识
   */
  protected async clickAndReadKnowledge(item: HTMLElement): Promise<void> {
    item.click();
    Application.App.log.Info("点击知识项，开始阅读");

    // 等待阅读完成（模拟阅读时间）
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // 更新贡献积分
    this.updatePoints(PointsType.CONTRIBUTION, 0.6);
    Application.App.log.Info("知识阅读完成，获得0.6贡献积分");

    // 返回知识列表页面
    window.history.back();

    // 继续下一个知识阅读
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!this.isPointsFull(PointsType.CONTRIBUTION)) {
      await this.executeKnowledgeReadTask();
    } else {
      Application.App.log.Info("贡献积分已达上限");
    }
  }

  /**
   * 执行知识分享任务
   */
  protected async executeKnowledgeShareTask(): Promise<void> {
    Application.App.log.Info("开始知识分享任务");

    // 检查是否配置了知识页面链接
    if (!this.knowledgePageUrl) {
      Application.App.log.Warn("未配置知识页面链接，跳过互动积分任务");
      return;
    }

    // 跳转到知识页面
    if (!window.location.href.includes(this.knowledgePageUrl)) {
      Application.App.log.Info("跳转到知识页面");
      window.location.href = this.knowledgePageUrl;
      return;
    }

    // 查找自己的知识项
    const knowledgeItem = await this.findMyKnowledgeItem();
    if (!knowledgeItem) {
      Application.App.log.Info("没有找到自己的知识项");
      return;
    }

    // 点击分享按钮
    await this.clickShareButton(knowledgeItem);
  }

  /**
   * 点击分享按钮
   */
  protected async clickShareButton(item: HTMLElement): Promise<void> {
    // 查找分享按钮
    const shareButton = item.querySelector(
      ".share-button, [class*='share']",
    ) as HTMLElement;
    if (!shareButton) {
      Application.App.log.Warn("未找到分享按钮");
      return;
    }

    shareButton.click();
    Application.App.log.Info("点击分享按钮");

    // 等待分享完成
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 更新互动积分（分享0.6 + 被分享1 = 1.6）
    this.updatePoints(PointsType.INTERACTION, 1.6);
    Application.App.log.Info("知识分享完成，获得1.6互动积分");

    // 继续下一个分享
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!this.isPointsFull(PointsType.INTERACTION)) {
      // 查找下一个知识项
      const nextItem = await this.findMyKnowledgeItem();
      if (nextItem) {
        await this.clickShareButton(nextItem);
      }
    } else {
      Application.App.log.Info("互动积分已达上限");
    }
  }

  public Done(): boolean {
    return this.isAllPointsFull();
  }

  /**
   * 获取积分进度百分比
   */
  protected getPointsProgress(type: PointsType): number {
    const status = this.pointsState[type];
    return Math.min((status.current / status.limit) * 100, 100);
  }

  /**
   * 获取总积分进度
   */
  protected getTotalProgress(): number {
    const totalCurrent = Object.values(PointsType).reduce((sum, type) => {
      return sum + this.pointsState[type].current;
    }, 0);

    const totalLimit = Object.values(PointsType).reduce((sum, type) => {
      return sum + this.pointsState[type].limit;
    }, 0);

    return Math.min((totalCurrent / totalLimit) * 100, 100);
  }

  /**
   * 创建积分显示面板
   */
  protected createPointsPanel(): HTMLElement {
    const panel = document.createElement("div");
    panel.className = "zsgl-points-panel";
    panel.innerHTML = `
            <div class="points-header">
                <h3>每日积分进度</h3>
                <button class="close-btn">×</button>
            </div>
            <div class="points-content">
                <div class="points-item">
                    <div class="points-label">学习积分</div>
                    <div class="points-bar">
                        <div class="points-progress" style="width: ${this.getPointsProgress(
                          PointsType.LEARNING,
                        )}%"></div>
                    </div>
                    <div class="points-text">${
                      this.pointsState.learning.current
                    }/${this.pointsState.learning.limit}</div>
                </div>
                <div class="points-item">
                    <div class="points-label">贡献积分</div>
                    <div class="points-bar">
                        <div class="points-progress" style="width: ${this.getPointsProgress(
                          PointsType.CONTRIBUTION,
                        )}%"></div>
                    </div>
                    <div class="points-text">${
                      this.pointsState.contribution.current
                    }/${this.pointsState.contribution.limit}</div>
                </div>
                <div class="points-item">
                    <div class="points-label">互动积分</div>
                    <div class="points-bar">
                        <div class="points-progress" style="width: ${this.getPointsProgress(
                          PointsType.INTERACTION,
                        )}%"></div>
                    </div>
                    <div class="points-text">${
                      this.pointsState.interaction.current
                    }/${this.pointsState.interaction.limit}</div>
                </div>
                <div class="points-total">
                    <div class="points-label">总进度</div>
                    <div class="points-bar">
                        <div class="points-progress total" style="width: ${this.getTotalProgress()}%"></div>
                    </div>
                    <div class="points-text">${this.getTotalProgress().toFixed(
                      1,
                    )}%</div>
                </div>
            </div>
        `;

    // 添加样式
    const style = document.createElement("style");
    style.textContent = `
            .zsgl-points-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                padding: 15px;
                z-index: 10000;
                min-width: 250px;
            }
            .points-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
            }
            .points-header h3 {
                margin: 0;
                font-size: 16px;
                color: #333;
            }
            .close-btn {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #999;
            }
            .close-btn:hover {
                color: #333;
            }
            .points-item, .points-total {
                margin-bottom: 12px;
            }
            .points-label {
                font-size: 14px;
                color: #666;
                margin-bottom: 5px;
            }
            .points-bar {
                height: 8px;
                background: #f0f0f0;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 5px;
            }
            .points-progress {
                height: 100%;
                background: linear-gradient(90deg, #4CAF50, #8BC34A);
                border-radius: 4px;
                transition: width 0.3s ease;
            }
            .points-progress.total {
                background: linear-gradient(90deg, #2196F3, #03A9F4);
            }
            .points-text {
                font-size: 12px;
                color: #999;
                text-align: right;
            }
            .points-total {
                margin-top: 15px;
                padding-top: 10px;
                border-top: 1px solid #eee;
            }
        `;
    document.head.appendChild(style);

    // 关闭按钮事件
    const closeBtn = panel.querySelector(".close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        panel.remove();
      });
    }

    return panel;
  }

  /**
   * 显示积分面板
   */
  public showPointsPanel(): void {
    const existingPanel = document.querySelector(".zsgl-points-panel");
    if (existingPanel) {
      existingPanel.remove();
    }

    const panel = this.createPointsPanel();
    document.body.appendChild(panel);
  }

  /**
   * 更新积分面板
   */
  protected updatePointsPanel(): void {
    const panel = document.querySelector(".zsgl-points-panel");
    if (!panel) return;

    // 更新学习积分
    const learningProgress = panel.querySelector(
      ".points-item:nth-child(1) .points-progress",
    ) as HTMLElement;
    const learningText = panel.querySelector(
      ".points-item:nth-child(1) .points-text",
    );
    if (learningProgress && learningText) {
      learningProgress.style.width = `${this.getPointsProgress(
        PointsType.LEARNING,
      )}%`;
      learningText.textContent = `${this.pointsState.learning.current}/${this.pointsState.learning.limit}`;
    }

    // 更新贡献积分
    const contributionProgress = panel.querySelector(
      ".points-item:nth-child(2) .points-progress",
    ) as HTMLElement;
    const contributionText = panel.querySelector(
      ".points-item:nth-child(2) .points-text",
    );
    if (contributionProgress && contributionText) {
      contributionProgress.style.width = `${this.getPointsProgress(
        PointsType.CONTRIBUTION,
      )}%`;
      contributionText.textContent = `${this.pointsState.contribution.current}/${this.pointsState.contribution.limit}`;
    }

    // 更新互动积分
    const interactionProgress = panel.querySelector(
      ".points-item:nth-child(3) .points-progress",
    ) as HTMLElement;
    const interactionText = panel.querySelector(
      ".points-item:nth-child(3) .points-text",
    );
    if (interactionProgress && interactionText) {
      interactionProgress.style.width = `${this.getPointsProgress(
        PointsType.INTERACTION,
      )}%`;
      interactionText.textContent = `${this.pointsState.interaction.current}/${this.pointsState.interaction.limit}`;
    }

    // 更新总进度
    const totalProgress = panel.querySelector(
      ".points-total .points-progress",
    ) as HTMLElement;
    const totalText = panel.querySelector(".points-total .points-text");
    if (totalProgress && totalText) {
      totalProgress.style.width = `${this.getTotalProgress()}%`;
      totalText.textContent = `${this.getTotalProgress().toFixed(1)}%`;
    }
  }
}
