/*
 * @Author: guotao
 * @Date: 2025-03-15
 * @Description: zsgl 每日积分模式模块
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */
import { Task, TaskType } from "@App/internal/app/task";
import { Application } from "@App/internal/application";
import { TimerManager, ApiResponse } from "./utils/utils";
import { NewChromeServerMessage } from "@App/internal/utils/message";
import { CourseItem, CourseListResponse } from "./types";
import { info } from "console";

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
  taskDelay: number; // 任务延迟时间（毫秒）
}

/**
 * 积分任务类型
 */
export type PointsTaskType = "course" | "knowledgeRead" | "knowledgeShare";

export interface KnowledgeReadResponse {
  code: number;
  body: {
    id: string;
    name: string;
    [key: string]: any;
  };
  message: string;
}

export interface KnowledgeShareResponse {
  body: {
    body: any;
    code: number;
    message: string;
  };
  code: string;
  file: any;
  message: string;
  user: any;
}

export interface PointsDetailItem {
  rate: number;
  ruleId: string;
  ruleName: string;
  userPoint: number;
}

export interface PointsDetailResponse {
  body: PointsDetailItem[];
  code: string;
  file: any;
  message: string;
  user: any;
}

const API_BASE_URL = "https://zsgl.lzlj.com/learn/app/clientapi";
const DEFAULT_TIMEOUT = 30000;

export class ZsglDailyPoints extends Task {
  protected pointsState: DailyPointsState;
  private timerManager: TimerManager = new TimerManager();
  protected knowledgePageUrl: string;
  protected currentTaskType: PointsTaskType | null = null;
  protected taskQueue: PointsTaskType[] = [];
  protected isTaskStopped: boolean = false;
  protected isSwitching: boolean = false;
  protected needSwitchTask: boolean = false;
  protected callCount: number = 0;
  protected pageId: string = "";
  protected sid: string = "";
  protected accumulatedPoints: number = 0;
  protected pointsGap: number = 0;
  protected noChangeCount: number = 0;
  protected readonly NO_CHANGE_THRESHOLD: number = 3;
  protected lastPointsData: PointsDetailItem[] = [];
  protected courseListParams: {
    curPage: number;
    numPerPage: number;
    sortType: number;
    totalPage: number;
  } = { curPage: 1, numPerPage: 30, sortType: 2, totalPage: 0 };
  
  private messageListener: ((event: MessageEvent) => void) | null = null;
  private videoStorageListener: ((e: StorageEvent) => void) | null = null;
  private abortController: AbortController | null = null;

  constructor() {
    super();
    this.knowledgePageUrl = Application.App.config.knowledge_page_url || "";
    this.pointsState = this.initPointsState();
    this.Init(); // 初始化任务
  }

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
      taskDelay: 8000,
    };
  }

  protected loadPointsState(): void {
    const saved = localStorage.getItem("zsgl_daily_points_state");
    if (saved) {
      try {
        const state = JSON.parse(saved) as DailyPointsState;
        const today = new Date().setHours(0, 0, 0, 0);
        const lastUpdateDay = new Date(state.lastUpdate).setHours(0, 0, 0, 0);

        if (today === lastUpdateDay) {
          this.pointsState = state;
        } else {
          this.pointsState = this.initPointsState();
        }
      } catch (e) {
        Application.App.log.Error("加载积分状态失败", e);
        this.pointsState = this.initPointsState();
      }
    }
  }

  protected savePointsState(): void {
    this.pointsState.lastUpdate = Date.now();
    localStorage.setItem(
      "zsgl_daily_points_state",
      JSON.stringify(this.pointsState),
    );
  }

  public stopTask(): void {
    Application.App.log.Info("停止每日积分任务");
    Application.App.log.Debug("停止每日积分任务");
    this.isTaskStopped = true;
    this.pointsState.isRunning = false;
    this.isSwitching = false;
    
    this.timerManager.clearAll();
    
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    
    if (this.messageListener) {
      window.removeEventListener("message", this.messageListener);
      this.messageListener = null;
    }
    
    if (this.videoStorageListener) {
      window.removeEventListener("storage", this.videoStorageListener);
      this.videoStorageListener = null;
    }
    
    this.savePointsState();

    window.postMessage({ type: "TASK_STOPPED" }, "*");

    Application.App.log.Info("每日积分任务已停止，所有监听器已移除");
    Application.App.log.Debug("每日积分任务已停止，所有监听器已移除");
  }

  protected setupMessageListener(): void {
    if (this.messageListener) {
      window.removeEventListener("message", this.messageListener);
    }
    
    this.messageListener = (event: MessageEvent) => {
      if (event.source !== window) return;

      const message = event.data;

      if (message.type === "STOP_DAILY_POINTS") {
        this.stopTask();
      } else if (message.type === "REFRESH_POINTS") {
        this.handleRefreshPoints();
      } else if (message.type === "CONFIRM_START_TASK") {
        Application.App.log.Debug("收到确认开始任务消息", message.data?.learningLimit, message.data?.contributionLimit, message.data?.interactionLimit);
        if (message.data?.knowledgeLink) {
          this.knowledgePageUrl = message.data.knowledgeLink;
        }
        if (message.data?.learningLimit !== undefined) {
          this.pointsState.learning.target = message.data.learningLimit;
          Application.App.log.Info(`设置学习积分目标: ${message.data.learningLimit}`);
        }
        if (message.data?.contributionLimit !== undefined) {
          this.pointsState.contribution.target = message.data.contributionLimit;
          Application.App.log.Info(`设置贡献积分目标: ${message.data.contributionLimit}`);
        }
        if (message.data?.interactionLimit !== undefined) {
          this.pointsState.interaction.target = message.data.interactionLimit;
          Application.App.log.Info(`设置互动积分目标: ${message.data.interactionLimit}`);
        }
        if (message.data?.taskDelay !== undefined) {
          this.pointsState.taskDelay = message.data.taskDelay * 1000;
          Application.App.log.Info(`设置任务延迟: ${message.data.taskDelay}秒 (${this.pointsState.taskDelay}毫秒)`);
        }
        this.savePointsState();
        this.executeTaskAfterConfirm();
      }
    };
    
    window.addEventListener("message", this.messageListener);
  }

  private readonly DAILY_POINTS_TASK_PREFIX = "zsgl_daily_task_";

  private setTaskStarted(courseId: string): void {
    const taskKey = `${this.DAILY_POINTS_TASK_PREFIX}${courseId}`;
    const taskStatus = {
      status: "started",
      expire: Date.now() + 30 * 60 * 1000,
    };
    localStorage.setItem(taskKey, JSON.stringify(taskStatus));
    Application.App.log.Info(`设置任务开始状态: ${taskKey}`);
    Application.App.log.Debug(`设置任务开始状态: ${taskKey}`, taskStatus);
  }

  private waitForTaskComplete(courseId: string): Promise<boolean> {
    return new Promise((resolve) => {
      const taskKey = `${this.DAILY_POINTS_TASK_PREFIX}${courseId}`;
      let resolved = false;

      const cleanup = () => {
        if (timeoutId) clearTimeout(timeoutId);
        window.removeEventListener('storage', storageHandler);
        checkInterval && clearInterval(checkInterval);
      };

      const storageHandler = (e: StorageEvent) => {
        if (e.key === taskKey && e.newValue) {
          try {
            const status = JSON.parse(e.newValue);
            if (status.status === "finished" && !resolved) {
              resolved = true;
              cleanup();
              localStorage.removeItem(taskKey);
              Application.App.log.Info(`任务完成 (storage事件): ${taskKey}`);
              Application.App.log.Debug(`任务完成 (storage事件): ${taskKey}`);
              resolve(true);
            }
          } catch (err) {
            Application.App.log.Warn(`解析任务状态失败: ${err}`);
          }
        }
      };

      window.addEventListener('storage', storageHandler);

      const checkInterval = setInterval(() => {
        if (resolved) {
          clearInterval(checkInterval);
          return;
        }
        const statusStr = localStorage.getItem(taskKey);
        if (statusStr) {
          const status = JSON.parse(statusStr);
          if (status.status === "finished") {
            resolved = true;
            cleanup();
            localStorage.removeItem(taskKey);
            // Application.App.log.Info(`任务完成 (轮询检测): ${taskKey}`);
            // Application.App.log.Debug(`任务完成 (轮询检测): ${taskKey}`);
            resolve(true);
          }
        }
      }, 3000);

      const timeoutId = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          cleanup();
          // Application.App.log.Warn(`等待任务完成超时: ${taskKey}`);
          resolve(false);
        }
      }, 30 * 60 * 1000);
    });
  }

  protected async executeTaskAfterConfirm(): Promise<void> {
    Application.App.log.Info("用户确认开始任务，开始执行");
    Application.App.log.Debug("用户确认开始任务，开始执行");

    this.extractPageIdFromUrl();
    this.extractSidFromStorage();

    const pointsResult = await this.fetchPointsDetail();
    if (!pointsResult.success) {
      Application.App.log.Error("获取积分详情失败");
      return;
    }

    this.updatePointsStateFromApi(pointsResult.data);

    if (this.isAllPointsFull()) {
      Application.App.log.Info("所有积分已达上限，停止每日积分模式");
      Application.App.log.Debug("所有积分已达上限，停止每日积分模式");
      return;
    }

    this.pointsState.isRunning = true;
    this.isTaskStopped = false;
    this.savePointsState();

    await this.switchToNextTask();
  }

  protected extractPageIdFromUrl(): void {
    if (this.knowledgePageUrl) {
      const match = this.knowledgePageUrl.match(
        /knowledgePage\/([A-Fa-f0-9]+)/,
      );
      if (match && match[1]) {
        this.pageId = match[1];
        Application.App.log.Info(`从知识页面链接提取pageId: ${this.pageId}`);
        Application.App.log.Debug(`从知识页面链接提取pageId: ${this.pageId}`);
        return;
      }
    }

    const currentUrl = window.location.href;
    const match = currentUrl.match(/knowledgePage\/([A-Fa-f0-9]+)/);
    if (match && match[1]) {
      this.pageId = match[1];
      Application.App.log.Info(`从当前页面URL提取pageId: ${this.pageId}`);
      Application.App.log.Debug(`从当前页面URL提取pageId: ${this.pageId}`);
    }
  }

  protected extractSidFromStorage(): void {
    try {
      const sessionInfo = localStorage.getItem("sessionInfo");
      if (sessionInfo) {
        const session = JSON.parse(sessionInfo);
        if (session.sid) {
          this.sid = session.sid;
          Application.App.log.Info(`从localStorage获取sid: ${this.sid}`);
          Application.App.log.Debug(`从localStorage获取sid: ${this.sid}`);
          return;
        }
      }

      const allKeys = Object.keys(localStorage);
      for (const key of allKeys) {
        if (
          key.toLowerCase().includes("session") ||
          key.toLowerCase().includes("sid")
        ) {
          const value = localStorage.getItem(key);
          if (value) {
            try {
              const parsed = JSON.parse(value);
              if (parsed.sid) {
                this.sid = parsed.sid;
                Application.App.log.Info(
                  `从localStorage[${key}]获取sid: ${this.sid}`,
                );
                Application.App.log.Debug(
                  `从localStorage[${key}]获取sid: ${this.sid}`,
                );
                return;
              }
            } catch {
              if (value.length > 10 && /^[A-Fa-f0-9]+$/.test(value)) {
                this.sid = value;
                Application.App.log.Info(
                  `从localStorage[${key}]获取sid: ${this.sid}`,
                );
                Application.App.log.Debug(
                  `从localStorage[${key}]获取sid: ${this.sid}`,
                );
                return;
              }
            }
          }
        }
      }

      Application.App.log.Warn("未能在localStorage中找到sid");
    } catch (e) {
      Application.App.log.Error("提取sid失败", e);
    }
  }

  protected async sendApiRequest<T = any>(
    method: "GET" | "POST",
    url: string,
    params?: Record<string, string | number>,
    body?: Record<string, any>,
    headers?: Record<string, string>,
    timeout: number = DEFAULT_TIMEOUT,
  ): Promise<ApiResponse<T>> {
    if (this.isTaskStopped) {
      return {
        success: false,
        data: null,
        error: "任务已停止",
        status: 0,
      };
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    this.abortController = controller;

    try {
      let requestUrl = url;
      const fetchOptions: RequestInit = {
        method,
        signal: controller.signal,
        credentials: "include",
      };

      if (params && Object.keys(params).length > 0) {
        const queryString = Object.entries(params)
          .map(
            ([key, value]) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
          )
          .join("&");
        requestUrl = `${url}${url.includes("?") ? "&" : "?"}${queryString}`;
      }

      if (body && method === "POST") {
        fetchOptions.body = JSON.stringify(body);
      }

      const defaultHeaders: Record<string, string> = {
        Accept: "application/json",
        Pragma: "no-cache",
      };

      if (method === "POST") {
        defaultHeaders["Content-Type"] = "application/json";
      }

      fetchOptions.headers = {
        ...defaultHeaders,
        ...headers,
      };

      Application.App.log.Debug(`发送API请求: ${method} ${requestUrl}`);

      const response = await fetch(requestUrl, fetchOptions);
      clearTimeout(timeoutId);

      if (!response.ok) {
        Application.App.log.Error(
          `API请求失败: ${response.status} ${response.statusText}`,
        );
        return {
          success: false,
          data: null,
          error: `HTTP错误: ${response.status} ${response.statusText}`,
          status: response.status,
        };
      }

      const data = await response.json();
      Application.App.log.Debug(`API响应成功:`, data);

      return {
        success: true,
        data,
        error: null,
        status: response.status,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error.name === "AbortError") {
        Application.App.log.Error(`API请求超时: ${url}`);
        return {
          success: false,
          data: null,
          error: "请求超时",
          status: 0,
        };
      }

      Application.App.log.Error(`API请求异常:`, error);
      return {
        success: false,
        data: null,
        error: error.message || "未知错误",
        status: 0,
      };
    }
  }

  protected async fetchKnowledgeRead(): Promise<
    ApiResponse<KnowledgeReadResponse>
  > {
    Application.App.log.Info(`获取知识阅读: pageId=${this.pageId}`);
    Application.App.log.Debug(`获取知识阅读: pageId=${this.pageId}`);

    return this.sendApiRequest<KnowledgeReadResponse>(
      "GET",
      `${API_BASE_URL}/knowledgecloud/page/details.do`,
      {
        pageId: this.pageId,
        sid: this.sid,
        os: 99,
      },
    );
  }

  protected async fetchKnowledgeShare(): Promise<
    ApiResponse<KnowledgeShareResponse>
  > {
    Application.App.log.Info(`获取知识分享: pageId=${this.pageId}`);
    Application.App.log.Debug(`获取知识分享: pageId=${this.pageId}`);

    return this.sendApiRequest<KnowledgeShareResponse>(
      "GET",
      `${API_BASE_URL}/knowledge/cloud/page/like/isShareOut.do`,
      {
        pageId: this.pageId,
        shareOutType: "",
        sid: this.sid,
        os: 99,
      },
    );
  }

  protected async fetchPointsDetail(): Promise<
    ApiResponse<PointsDetailResponse>
  > {
    const now = new Date();
    const startDate = this.formatDate(now);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const endDateStr = this.formatDate(endDate);

    Application.App.log.Info(`获取积分详情: ${startDate} ~ ${endDateStr}`);
    Application.App.log.Debug(`获取积分详情: ${startDate} ~ ${endDateStr}`);

    return this.sendApiRequest<PointsDetailResponse>(
      "POST",
      `${API_BASE_URL}/personal/statistics/queryUserPointPercent.do`,
      {
        os: 99,
        sid: this.sid,
      },
      {
        startTime: startDate,
        endTime: endDateStr,
      },
    );
  }

  protected updatePointsStateFromApi(
    data: PointsDetailResponse | null,
    isNotRefresh: boolean = true,
  ): void {
    if (!data || !data.body) {
      Application.App.log.Warn("积分详情数据为空");
      return;
    }

    for (const item of data.body) {
      Application.App.log.Info(
        `积分项: ${item.ruleName} (${item.ruleId}) = ${item.userPoint}`,
      );
      Application.App.log.Debug(
        `积分项: ${item.ruleName} (${item.ruleId}) = ${item.userPoint}`,
      );

      if (item.ruleId === "knowledge_read_point") {
        this.pointsState.contribution.current = item.userPoint;
        Application.App.log.Info(`更新贡献积分: ${item.userPoint}`);
        Application.App.log.Debug(`更新贡献积分: ${item.userPoint}`);
      } else if (
        item.ruleId === "knowledge_shared" ||
        item.ruleId === "knowledge_sharing"
      ) {
        // 互动积分 = knowledge_shared + knowledge_sharing
        if (item.ruleId === "knowledge_shared") {
          this.pointsState.interaction.current = item.userPoint;
        } else if (item.ruleId === "knowledge_sharing") {
          this.pointsState.interaction.current += item.userPoint;
        }
        Application.App.log.Info(`更新互动积分: ${this.pointsState.interaction.current}`);
        Application.App.log.Debug(`更新互动积分: ${this.pointsState.interaction.current}`);
      } else if (
        item.ruleId === "46EA49C2D06E49BD9C59F21B94687D59" ||
        item.ruleId === "24E2D4D119E74B76AC349FA12A0B646C"
      ) {
        this.pointsState.learning.current = 0;
        this.pointsState.learning.current += item.userPoint;
        Application.App.log.Info(
          `更新学习积分（${item.ruleName}）: +${item.userPoint}，当前: ${this.pointsState.learning.current}`,
        );
        Application.App.log.Debug(
          `更新学习积分（${item.ruleName}）: +${item.userPoint}，当前: ${this.pointsState.learning.current}`,
        );
      }
    }
    window.postMessage(
      {
        type: "POINTS_UPDATED",
        data: {
          learning: this.pointsState.learning,
          contribution: this.pointsState.contribution,
          interaction: this.pointsState.interaction,
        },
      },
      "*",
    );

    this.savePointsState();

    if (!this.checkPointsChanged(data.body) && isNotRefresh&& this.pointsState.taskDelay > 0) {
      this.noChangeCount++;
      
      Application.App.log.Warn(
        `积分无变化，连续无变化次数: ${this.noChangeCount}/2`,
      );
      if (this.noChangeCount >= 2) {
        Application.App.log.Info("积分连续两次无变化，需要切换任务");
        this.needSwitchTask = true;
        return;
      }
    } else {
      this.noChangeCount = 0;
    }

    this.lastPointsData = data.body;
  }

  /** 切换到下一个任务 */
  protected async switchToNextTask(): Promise<void> {
    if (this.isSwitching) {
      Application.App.log.Warn("[任务切换] 正在切换中，跳过重复调用");
      return;
    }
    this.isSwitching = true;
    this.needSwitchTask = false;
    
    try {
      while (!this.isTaskStopped) {
        const nextTask = this.getNextTask();
        if (!nextTask) {
          Application.App.log.Info("没有下一个任务，自动停止任务");
          this.stopTask();
          break;
        }
        
        Application.App.log.Info(`切换到下一个任务: ${nextTask}`);
        this.noChangeCount = 0;
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
        
        if (this.isTaskStopped) {
          break;
        }
      }
    } finally {
      this.isSwitching = false;
    }
  }

  protected calculatePointsGap(type: PointsType): number {
    const status = this.pointsState[type];
    const target = status.target !== undefined ? status.target : status.limit;
    if (target === 0) {
      return 0;
    }
    const gap = target - status.current;
    return Math.max(0, gap);
  }

  protected updatePoints(type: PointsType, points: number): void {
    const status = this.pointsState[type];
    status.current = Math.min(status.current + points, status.limit);
    this.savePointsState();
    // this.updatePointsPanel();
    Application.App.log.Info(
      `${type}积分增加 ${points}，当前：${status.current}/${status.limit}`,
    );
    Application.App.log.Debug(
      `${type}积分增加 ${points}，当前：${status.current}/${status.limit}`,
    );
  }

  protected isPointsFull(type: PointsType): boolean {
    const status = this.pointsState[type];
    const target = status.target !== undefined ? status.target : status.limit;
    if (target === 0) {
      return true;
    }
    return status.current >= target;
  }

  protected isAllPointsFull(): boolean {
    return Object.values(PointsType).every((type) => this.isPointsFull(type));
  }

  protected getNextTask(): PointsTaskType | null {
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
        this.setupMessageListener();
        this.setupVideoCompleteListener();
        Application.App.log.Info("每日积分模式初始化完成", this.pointsState);
        Application.App.log.Debug("每日积分模式初始化完成", this.pointsState);
        resolve();
      } catch (error) {
        Application.App.log.Error("每日积分模式初始化失败", error);
        reject(error);
      }
    });
  }

  /** 设置视频完成监听 */
  private setupVideoCompleteListener(): void {
    if (this.videoStorageListener) {
      window.removeEventListener('storage', this.videoStorageListener);
    }
    
    this.videoStorageListener = (e: StorageEvent) => {
      if (this.isTaskStopped) return;
      
      if (e.key && e.key.startsWith('zsgl_video_complete_') && e.newValue) {
        try {
          const videoStatus = JSON.parse(e.newValue);
          if (videoStatus.status === 'finished') {
            Application.App.log.Info(`[视频完成监听] 收到视频完成通知: courseId=${videoStatus.courseId}, taskId=${videoStatus.taskId}`);
            Application.App.log.Debug(`[视频完成监听] 收到视频完成通知`, videoStatus);
            this.handleVideoTaskComplete(videoStatus.courseId);
            localStorage.removeItem(e.key);
          }
        } catch (err) {
          Application.App.log.Warn(`[视频完成监听] 解析视频状态失败: ${err}`);
        }
      }
    };
    
    window.addEventListener('storage', this.videoStorageListener);

    this.timerManager.setInterval('checkVideoComplete', () => {
      if (this.isTaskStopped) return;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('zsgl_video_complete_')) {
          try {
            const value = JSON.parse(localStorage.getItem(key) || '{}');
            if (value.status === 'finished') {
              Application.App.log.Info(`[视频完成轮询] 检测到视频完成: ${key}`);
              this.handleVideoTaskComplete(value.courseId);
              localStorage.removeItem(key);
            }
          } catch (err) {
            Application.App.log.Warn(`[视频完成轮询] 解析失败: ${err}`);
          }
        }
      }
    }, 5000);
  }

  /** 处理视频任务完成 */
  private async handleVideoTaskComplete(courseId: string): Promise<void> {
    if (!courseId) {
      Application.App.log.Warn('[积分检查] courseId 为空，跳过积分检查');
      return;
    }

    Application.App.log.Info('[积分检查] 开始检查积分是否达到上限');
    let pointsResult = null;
    if (this.sid) {
      pointsResult = await this.fetchPointsDetail();
    }

    if (!pointsResult || !pointsResult.success || !pointsResult.data) {
      Application.App.log.Warn('[积分检查] 获取积分详情失败');
      return;
    }

    this.updatePointsStateFromApi(pointsResult.data, false);

    const learningPoints = this.pointsState.learning.current;
    const learningTarget = this.pointsState.learning.target || this.pointsState.learning.limit;

    Application.App.log.Info(`[积分检查] 当前学习积分: ${learningPoints}/${learningTarget}`);

    if (learningPoints >= learningTarget) {
      Application.App.log.Info('[积分检查] 学习积分已达目标，发送关闭课程通知');
      
      this.notifyCloseCourse(courseId);
      this.stopTask()
    } else {
      Application.App.log.Info('[积分检查] 学习积分未达目标，继续执行');
    }
  }

  /** 通知课程页面关闭 */
  private notifyCloseCourse(courseId: string): void {
    const closeKey = `zsgl_close_course_${courseId}`;
    const closeStatus = {
      status: 'close',
      courseId: courseId,
      timestamp: Date.now()
    };
    localStorage.setItem(closeKey, JSON.stringify(closeStatus));
    Application.App.log.Info(`[关闭通知] 已设置关闭标志: ${closeKey}`);
    Application.App.log.Debug(`[关闭通知] 已设置关闭标志: ${closeKey}`, closeStatus);
  }

  public Start(): Promise<any> {
    return new Promise<void>(async (resolve) => {
      if (this.isAllPointsFull()) {
        Application.App.log.Info("所有积分已达上限，停止每日积分模式");
        Application.App.log.Debug("所有积分已达上限，停止每日积分模式");
        resolve();
        return;
      }

      this.pointsState.isRunning = true;
      this.isTaskStopped = false;
      this.savePointsState();

      await this.switchToNextTask();

      resolve();
    });
  }

  protected async executeCourseTask(): Promise<void> {
    Application.App.log.Info("开始普通课程任务");
    Application.App.log.Debug("开始普通课程任务");

    if (!this.sid) {
      this.extractSidFromStorage();
    }

    if (!this.sid) {
      Application.App.log.Error("无法获取sid，无法执行课程任务");
      return;
    }

    let curPage = 1;

    while (true) {
      Application.App.log.Info(`查询课程列表第 ${curPage} 页`);

      const response = await this.fetchCourseListWithPage(curPage);
      
      Application.App.log.Debug(`课程列表响应:`, response);
      Application.App.log.Debug(`response.body:`, response?.body);
      Application.App.log.Debug(`response.body.courseArr:`, response?.body?.courseArr);
      Application.App.log.Debug(`response.body.courseArr length:`, response?.body?.courseArr?.length);

      if (!response) {
        Application.App.log.Error(`获取课程列表失败: response为null`);
        break;
      }
      
      if (!response.body) {
        Application.App.log.Error(`获取课程列表失败: response.body为空`, response);
        break;
      }
      
      if (!response.body.courseArr) {
        Application.App.log.Error(`获取课程列表失败: courseArr为空`, response.body);
        break;
      }

      const unfinishedCourse = this.findUnfinishedCourseFromData(
        response.body.courseArr,
      );

      Application.App.log.Debug(`findUnfinishedCourseFromData 结果:`, unfinishedCourse);

      if (unfinishedCourse) {
        Application.App.log.Info(
          `找到未完成的课程: ${unfinishedCourse.courseName}`,
        );

        this.setTaskStarted(unfinishedCourse.courseId);

        this.openCourseInNewWindow(unfinishedCourse.courseId);

        Application.App.log.Info("等待课程任务完成...");
        const completed = await this.waitForTaskComplete(
          unfinishedCourse.courseId,
        );

        if (completed) {
          Application.App.log.Info("课程任务已完成，继续查找下一个任务");
          continue;
        } else {
          Application.App.log.Warn("等待任务完成超时");
          break;
        }
      }

      const totalPage = parseInt((response as any).totalPage || response.body.totalPage) || 1;
      Application.App.log.Debug(`当前页: ${curPage}, 总页数: ${totalPage}`);
      if (curPage >= totalPage) {
        Application.App.log.Info("所有课程已完成");
        break;
      }

      Application.App.log.Debug(`继续查询下一页: ${curPage + 1}`);
      curPage++;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  protected async fetchCourseListWithPage(
    curPage: number,
  ): Promise<CourseListResponse | null> {
    Application.App.log.Info(`主动请求课程列表: curPage=${curPage}`);
    Application.App.log.Debug(`主动请求课程列表: curPage=${curPage}`);

    if (!this.sid) {
      Application.App.log.Error("sid为空，无法请求课程列表");
      return null;
    }

    const result = await this.sendApiRequest<CourseListResponse>(
      "GET",
      `${API_BASE_URL}/course/courselist.do`,
      {
        curPage: curPage,
        numPerPage: this.courseListParams.numPerPage,
        sortType: this.courseListParams.sortType,
        ver: "3.8.2",
        sid: this.sid,
        os: 99,
      },
    );

    if (result.success && result.data) {
      Application.App.log.Debug(`fetchCourseListWithPage 成功, result.data:`, result.data);
      if (result.data.body && result.data.body.totalPage !== undefined) {
        this.courseListParams.totalPage = result.data.body.totalPage;
        Application.App.log.Debug(
          `更新总页数: totalPage=${result.data.body.totalPage}`,
        );
      }
      return result.data;
    }

    Application.App.log.Error(`请求课程列表失败: ${result.error}, result:`, result);
    return null;
  }

  protected openCourseInNewWindow(courseId: string): void {
    const url = `https://zsgl.lzlj.com/znWeb/znPortal/#/home/courseDetail/${courseId}`;
    Application.App.log.Info(`在新窗口打开课程: ${url}`);
    Application.App.log.Debug(`在新窗口打开课程: ${url}`);
    window.open(url, "_blank");
  }

  protected findUnfinishedCourseFromData(
    courseArr: CourseItem[],
  ): CourseItem | null {
    Application.App.log.Debug(`开始查找未完成课程, 共 ${courseArr.length} 个课程`);
    for (const course of courseArr) {
      const isCompleted = course.isCompleted;
      const isUnfinished = isCompleted === 0 || isCompleted === "0";
      Application.App.log.Debug(`课程: ${course.courseName}, isCompleted: ${isCompleted}, isUnfinished: ${isUnfinished}`);
      if (isUnfinished) {
        Application.App.log.Info("找到未完成的课程", course.courseName);
        Application.App.log.Debug("找到未完成的课程", course.courseName);
        return course;
      }
    }
    Application.App.log.Debug("未找到未完成的课程");
    return null;
  }

  protected async findCourseElementByName(
    courseName: string,
  ): Promise<HTMLElement | null> {
    return new Promise((resolve) => {
      this.timerManager.setInterval(
        "findCourseElement",
        () => {
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

              resolve(element as HTMLElement);
              return;
            }
          }
        },
        500,
      );

      setTimeout(() => {
        this.timerManager.clearInterval("findCourseElement");
        resolve(null);
      }, 10000);
    });
  }

  protected async clickViewMoreButton(): Promise<boolean> {
    return new Promise((resolve) => {
      const buttons = document.querySelectorAll("button");

      for (const button of buttons) {
        if (button.textContent?.includes("查看更多")) {
          Application.App.log.Info("点击查看更多按钮");
          Application.App.log.Debug("点击查看更多按钮");
          button.click();

          setTimeout(() => {
            resolve(true);
          }, 2000);
          return;
        }
      }

      Application.App.log.Info("未找到查看更多按钮");
      Application.App.log.Debug("未找到查看更多按钮");
      resolve(false);
    });
  }

  // protected setupCourseTaskCompletionListener(): void {
  //   const msg = NewChromeServerMessage("zsgl-tools");
  //   msg.Accept((client, data) => {
  //     Application.App.log.Debug("每日积分模式收到消息", data);

  //     if (data.type === "courseTaskComplete") {
  //       Application.App.log.Info("课程任务完成");
  //       Application.App.log.Debug("课程任务完成");

  //       const points = 0.4 * 10;
  //       this.updatePoints(PointsType.LEARNING, points);

  //       setTimeout(() => {
  //         window.location.href =
  //           "https://zsgl.lzlj.com/znWeb/znPortal/#/home/course";
  //       }, 2000);
  //     }
  //   });
  // }

  protected async executeKnowledgeReadTask(): Promise<void> {
    if (!this.pageId) {
      Application.App.log.Warn("无法从知识页面链接中提取pageId");
      return;
    }

    if (!this.sid) {
      Application.App.log.Warn("无法从localStorage中获取sid");
      return;
    }

    Application.App.log.Info(`提取到pageId: ${this.pageId}, sid: ${this.sid}`);
    Application.App.log.Debug(`提取到pageId: ${this.pageId}, sid: ${this.sid}`);
    Application.App.log.Info("开始知识阅读任务（API方式）");
    Application.App.log.Debug("开始知识阅读任务（API方式）");

    this.pointsGap = this.calculatePointsGap(PointsType.CONTRIBUTION);
    this.accumulatedPoints = 0;
    this.callCount = 0;

    Application.App.log.Info(`贡献积分分差: ${this.pointsGap}`);
    Application.App.log.Debug(`贡献积分分差: ${this.pointsGap}`);

    if (this.pointsGap <= 0) {
      Application.App.log.Info("贡献积分已达目标，跳过知识阅读任务");
      Application.App.log.Debug("贡献积分已达目标，跳过知识阅读任务");
      return;
    }

    this.isTaskStopped = false;

    while (!this.isTaskStopped && this.accumulatedPoints < this.pointsGap && !this.needSwitchTask) {
      const result = await this.fetchKnowledgeRead();

      if (result.success) {
        this.callCount++;
        this.accumulatedPoints += 0.6;
        Application.App.log.Info(
          `知识阅读成功，第${this.callCount}次调用，累积积分: ${this.accumulatedPoints}/${this.pointsGap}`,
        );
        Application.App.log.Debug(
          `知识阅读成功，第${this.callCount}次调用，累积积分: ${this.accumulatedPoints}/${this.pointsGap}`,
        );

        if (this.callCount % 5 === 0) {
          const pointsResult = await this.fetchPointsDetail();
          if (pointsResult.success) {
            this.updatePointsStateFromApi(pointsResult.data);
            this.pointsGap = this.calculatePointsGap(PointsType.CONTRIBUTION);
            this.accumulatedPoints = 0;
            Application.App.log.Info(`重新计算分差: ${this.pointsGap}`);
            Application.App.log.Debug(`重新计算分差: ${this.pointsGap}`);

            if (this.pointsGap <= 0 || this.needSwitchTask) {
              Application.App.log.Info("贡献积分已达目标或需要切换任务，停止知识阅读任务");
              Application.App.log.Debug("贡献积分已达目标或需要切换任务，停止知识阅读任务");
              break;
            }
          }
        }
      } else {
        Application.App.log.Warn(`知识阅读失败: ${result.error}`);
      }
      const delay = this.getRandomDelay();
      if (delay > 0) {
        await this.sleep(delay);
      }
    }

    if (this.isTaskStopped) {
      Application.App.log.Info("知识阅读任务已被停止");
      Application.App.log.Debug("知识阅读任务已被停止");
    } else if (this.needSwitchTask) {
      Application.App.log.Info("检测到需要切换任务，知识阅读任务提前结束");
      Application.App.log.Debug("检测到需要切换任务，知识阅读任务提前结束");
    } else {
      Application.App.log.Info("贡献积分已达目标，知识阅读任务完成");
      Application.App.log.Debug("贡献积分已达目标，知识阅读任务完成");
    }
  }

  protected sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private getRandomDelay(): number {
    const baseDelay = this.pointsState.taskDelay;
    if (baseDelay === 0) {
      return 0;//为0直接跳过执行等待
    }
    const randomOffset = Math.random() * 10000 - 5000;
    const actualDelay = baseDelay + randomOffset;
    return Math.max(0, Math.floor(actualDelay));
  }

  protected checkPointsChanged(newData: PointsDetailItem[]): boolean {
    if (this.lastPointsData.length === 0) {
      return true;
    }
    return JSON.stringify(newData) !== JSON.stringify(this.lastPointsData);
  }

  protected formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  protected async executeKnowledgeShareTask(): Promise<void> {
    if (!this.pageId) {
      Application.App.log.Warn("无法从知识页面链接中提取pageId");
      return;
    }

    if (!this.sid) {
      Application.App.log.Warn("无法从localStorage中获取sid");
      return;
    }

    Application.App.log.Info(`提取到pageId: ${this.pageId}, sid: ${this.sid}`);
    Application.App.log.Debug(`提取到pageId: ${this.pageId}, sid: ${this.sid}`);
    Application.App.log.Info("开始知识分享任务（API方式）");
    Application.App.log.Debug("开始知识分享任务（API方式）");

    this.pointsGap = this.calculatePointsGap(PointsType.INTERACTION);
    this.accumulatedPoints = 0;
    this.callCount = 0;

    Application.App.log.Info(`互动积分分差: ${this.pointsGap}`);
    Application.App.log.Debug(`互动积分分差: ${this.pointsGap}`);

    if (this.pointsGap <= 0) {
      Application.App.log.Info("互动积分已达目标，跳过知识分享任务");
      Application.App.log.Debug("互动积分已达目标，跳过知识分享任务");
      return;
    }

    this.isTaskStopped = false;

    while (!this.isTaskStopped && this.accumulatedPoints < this.pointsGap && !this.needSwitchTask) {
      const result = await this.fetchKnowledgeShare();

      if (result.success) {
        this.callCount++;
        this.accumulatedPoints += 0.6;
        Application.App.log.Info(
          `知识分享成功，第${this.callCount}次调用，累积积分: ${this.accumulatedPoints}/${this.pointsGap}`,
        );
        Application.App.log.Debug(
          `知识分享成功，第${this.callCount}次调用，累积积分: ${this.accumulatedPoints}/${this.pointsGap}`,
        );

        if (this.callCount % 5 === 0) {
          const pointsResult = await this.fetchPointsDetail();
          if (pointsResult.success) {
            this.updatePointsStateFromApi(pointsResult.data);
            this.pointsGap = this.calculatePointsGap(PointsType.INTERACTION);
            this.accumulatedPoints = 0;
            Application.App.log.Info(`重新计算分差: ${this.pointsGap}`);

            if (this.pointsGap <= 0 || this.needSwitchTask) {
              Application.App.log.Info("互动积分已达目标或需要切换任务，停止知识分享任务");
              Application.App.log.Debug("互动积分已达目标或需要切换任务，停止知识分享任务");
              break;
            }
          }
        }
      } else {
        Application.App.log.Warn(`知识分享失败: ${result.error}`);
      }

      const delay = this.getRandomDelay();
      if (delay > 0) {
        await this.sleep(delay);
      }
    }

    if (this.isTaskStopped) {
      Application.App.log.Info("知识分享任务已被停止");
      Application.App.log.Debug("知识分享任务已被停止");
    } else if (this.needSwitchTask) {
      Application.App.log.Info("检测到需要切换任务，知识分享任务提前结束");
      Application.App.log.Debug("检测到需要切换任务，知识分享任务提前结束");
    } else {
      Application.App.log.Info("互动积分已达目标，知识分享任务完成");
      Application.App.log.Debug("互动积分已达目标，知识分享任务完成");
    }
  }

  protected async handleRefreshPoints(): Promise<void> {
    Application.App.log.Info("手动刷新积分进度");
    Application.App.log.Debug("手动刷新积分进度");

    if (!this.sid) {
      this.extractSidFromStorage();
    }

    if (this.sid) {
      const result = await this.fetchPointsDetail();
      if (result.success) {
        this.updatePointsStateFromApi(result.data, false);
        window.postMessage(
          {
            type: "POINTS_UPDATED",
            data: {
              learning: this.pointsState.learning,
              contribution: this.pointsState.contribution,
              interaction: this.pointsState.interaction,
            },
          },
          "*",
        );
      }
    } else {
      Application.App.log.Warn("无法获取sid，无法刷新积分");
    }
  }

  public Done(): boolean {
    return this.isAllPointsFull();
  }

  protected getPointsProgress(type: PointsType): number {
    const status = this.pointsState[type];
    return Math.min((status.current / status.limit) * 100, 100);
  }

  protected getTotalProgress(): number {
    const totalCurrent = Object.values(PointsType).reduce((sum, type) => {
      return sum + this.pointsState[type].current;
    }, 0);

    const totalLimit = Object.values(PointsType).reduce((sum, type) => {
      return sum + this.pointsState[type].limit;
    }, 0);

    return Math.min((totalCurrent / totalLimit) * 100, 100);
  }

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

    const closeBtn = panel.querySelector(".close-btn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        panel.remove();
      });
    }

    return panel;
  }

  public showPointsPanel(): void {
    const existingPanel = document.querySelector(".zsgl-points-panel");
    if (existingPanel) {
      existingPanel.remove();
    }

    const panel = this.createPointsPanel();
    document.body.appendChild(panel);
  }
}
