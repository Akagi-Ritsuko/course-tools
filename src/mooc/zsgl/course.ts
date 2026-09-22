/*
 * @Author: guotao
 * @Date: 2025-09-27 02:32:51
 * @LastEditors: guotao
 * @LastEditTime: 2026-09-22 16:04:21
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
import {
  hookHttpRequest,
  hookAndModifyHttpResponse,
  removeHttpRequestHook,
  CssBtn,
  TimerManager,
  findElementByText,
  setupVisibilitySpoof,
  setupSwitchScreenNeutralizer,
  sendApiRequest,
} from "./utils/utils";
import { createBtn, protocolPrompt } from "@App/internal/utils/utils";
import { CourseDetailItem, TaskInfo, TaskStatus } from "./types";
import { ZSGL_CONSTANTS } from "./constants";

/**
 * ZsglCourse 课程任务类
 * 继承自 EventListener<MoocEvent> 并实现 MoocTaskSet 接口
 */
export class ZsglCourse extends EventListener<MoocEvent>
  implements MoocTaskSet {
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
  /** 事件监听是否已注册(幂等守卫) */
  private listenersRegistered: boolean = false;
  /** 任务卡是否已操作过(防止 load 与立即执行双路径重复触发) */
  private cardOperated: boolean = false;
  /** 切屏检测改写钩子是否已注册(幂等) */
  private switchScreenHooked: boolean = false;
  /** 是否为三方/混合课程(courseFileArr 含 URL 类型任务) */
  private isThirdPartyCourse: boolean = false;
  /** 三方课程自动化流程是否已启动(幂等,防重复点击「立即学习」) */
  private thirdPartyFlowStarted: boolean = false;
  /** 首次 queryCourseDetail 请求 URL(三方课程轮询复用,免感知具体路径) */
  private courseDetailRequestUrl: string = "";

  public Init(): Promise<any> {
    return new Promise(async (resolve) => {
      let first = true;
      window.onresize = null;
      Application.App.log.Debug("初始化course课程任务");
      Application.App.log.Debug("当前页面URL:", window.location.href);
      Application.App.log.Debug("当前页面hash:", window.location.hash);

      // 幂等注册,防止重复 Init 时监听器累积
      if (!this.listenersRegistered) {
        this.listenersRegistered = true;

        // 伪装页面可见性,后台标签页/最小化时视频继续播放
        setupVisibilitySpoof();

        // 改写课程详情响应:关闭切屏/截图检测开关(站点据此以属性赋值安装 window.onblur 检测)
        // ⚠️ M1d 实验开关(见 .trae/documents/zsgl-debug-handoff.md P1):响应体改写疑似
        // 诱发卡片路径打开的 DRM 播放器软解(renderer ~130%/GPU 闲置),本轮注释改写以验证;
        // 切窗防御仍由 setupSwitchScreenNeutralizer() 属性赋值中和兜底
        if (!this.switchScreenHooked) {
          this.switchScreenHooked = true;
          hookAndModifyHttpResponse(
            ZSGL_CONSTANTS.HTTP_ENDPOINTS.QUERY_COURSE_DETAIL,
            (response) => {
              // M1d: 不改写 isOpenSwitchScreen/isOpenScreenShot,原样放行
              return response;
            },
            this,
          );
        }

        // 兜底:拦截站点对 window.onblur/onfocus/onresize 的属性赋值,
        // 防止切窗弹窗、强制暂停与超限终止任务
        setupSwitchScreenNeutralizer();

        this.addEventListener("courseTaskComplete", () => {
          this.notifyStudyMapCourseComplete();
        });

        // 设置页面关闭监听
        this.setupCloseCourseListener();
      }

      this.hookCourseDetailRequests();

      // 任务卡只操作一次,避免 load 与立即执行双路径重复触发
      const operateCardOnce = () => {
        if (this.cardOperated) {
          first && resolve(undefined);
          first = false;
          return;
        }
        this.cardOperated = true;

        // 注意:不要往 #watermarkFrame / body 里 prepend 节点——
        // 站点水印组件(getIsWatermark)会因外来节点抛 removeChild TypeError
        this.OperateCard();
        first && resolve(undefined);
        first = false;
      };

      window.addEventListener("load", operateCardOnce);

      // 如果页面已经加载完成，直接执行
      if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
      ) {
        Application.App.log.Debug("页面已加载完成，直接初始化");
        operateCardOnce();
      }
    });
  }
  public courseTaskCompleteFc() {
    // 通知逻辑由 Init 中注册的 courseTaskComplete 监听器触发,避免重复执行
    this.callEvent("courseTaskComplete");
  }
  /** 钩子获取课程详情请求 */
  protected hookCourseDetailRequests(): void {
    Application.App.log.Debug(
      "设置HTTP钩子，监听:",
      ZSGL_CONSTANTS.HTTP_ENDPOINTS.QUERY_COURSE_DETAIL,
    );

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

          // 记录首次请求 URL,供三方课程轮询复用(同源 fetch,无需感知具体路径)
          if (url && !self.courseDetailRequestUrl) {
            self.courseDetailRequestUrl = url;
          }

          // 识别三方/混合课程:任务中含 URL 类型(课程内容由三节课页承载)
          if (
            courseFileArr &&
            courseFileArr.some((item: any) => item.cwType === "URL")
          ) {
            self.isThirdPartyCourse = true;
            Application.App.log.Info(
              "检测到三方/混合课程(URL 类型任务),将走三方课程分支",
            );
          }

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
              Application.App.log.Debug("课程详情数据", self.courseDetailData);
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
    this.taskList.forEach((task) => task.Stop());
    // 移除本实例注册的HTTP钩子,释放对 course 实例的强引用
    removeHttpRequestHook(
      ZSGL_CONSTANTS.HTTP_ENDPOINTS.QUERY_COURSE_DETAIL,
      this,
    );
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
            if (
              key === `${ZSGL_CONSTANTS.STORAGE_PREFIX}${this.currentCourseId}`
            ) {
              const taskStatus: TaskStatus = {
                status: "finished",
                expire: value.expire,
              };
              localStorage.setItem(key, JSON.stringify(taskStatus));
              Application.App.log.Info("课程完成，已更新 localStorage", key);
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
    window.addEventListener("storage", (e: StorageEvent) => {
      if (e.key && e.key.startsWith("zsgl_close_course_") && e.newValue) {
        try {
          const closeStatus = JSON.parse(e.newValue);
          if (closeStatus.status === "close") {
            Application.App.log.Info(
              `[关闭监听] 收到关闭课程通知: courseId=${closeStatus.courseId}`,
            );
            Application.App.log.Debug(
              `[关闭监听] 收到关闭课程通知`,
              closeStatus,
            );

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
    this.timerManager.setInterval(
      "checkCloseFlag",
      () => {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("zsgl_close_course_")) {
            try {
              const value = JSON.parse(localStorage.getItem(key) || "{}");
              if (value.status === "close") {
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
      },
      3000,
    );
  }

  /** 关闭课程页面 */
  private closeCoursePage(): void {
    Application.App.log.Info("[关闭页面] 尝试关闭课程页面");

    // 先停止所有任务
    this.Stop();

    // 尝试关闭窗口
    window.close();

    // 如果 window.close() 不起作用（可能是因为脚本打开的窗口），提示用户
    setTimeout(() => {
      Application.App.log.Info("[关闭页面] 无法自动关闭页面，请手动关闭");
      alert("学习积分已达上限，请关闭此页面");
    }, 1000);
  }

  public Next(): Promise<Task> {
    return new Promise((resolve) => {
      Application.App.log.Debug(
        "Next 课程任务索引:",
        this.taskIndex,
        this.taskList.length,
      );
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
    Application.App.log.Debug(
      "OperateCard 课程详情数据长度:",
      this.courseDetailData.length,
    );

    if (this.courseDetailData.length === 0) {
      Application.App.log.Warn("课程详情数据为空，等待数据...");
      // 等待数据加载
      let waitCount = 0;
      this.timerManager.setInterval(
        "waitForData",
        () => {
          waitCount++;
          Application.App.log.Debug("等待课程数据...", waitCount);

          if (this.courseDetailData.length > 0) {
            this.timerManager.clearInterval("waitForData");
            this.processCourseData();
          } else if (waitCount > 20) {
            this.timerManager.clearInterval("waitForData");
            Application.App.log.Error("等待课程数据超时");
            this.courseTaskCompleteFc();
          }
        },
        1000,
      );
      return;
    }

    this.processCourseData();
  }

  /** 处理课程数据 */
  private async processCourseData(): Promise<void> {
    // 三方/混合课程分支:自动点「立即学习」打开三节课页 + 轮询服务端完成状态,
    // 不构建本页任务(URL 类型任务由三节课学习页承载)
    if (this.isThirdPartyCourse && Application.App.config.auto) {
      this.startThirdPartyFlow();
      return;
    }

    const loadedFlagValue = this.courseDetailData[0];
    let attemptCount = 0;

    this.timerManager.setInterval(
      "checkTaskDiv",
      async () => {
        attemptCount++;
        if (attemptCount > ZSGL_CONSTANTS.MAX_ATTEMPT_COUNT) {
          this.timerManager.clearInterval("checkTaskDiv");
          this.courseTaskCompleteFc();
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
      },
      ZSGL_CONSTANTS.CHECK_INTERVAL_MS,
    );
  }

  /**
   * 三方/混合课程自动化流程:
   * 1. 轮询查找「立即学习」按钮并自动点击(仅一次),打开三节课学习页;
   * 2. 定时轮询 queryCourseDetail(服务端状态为准),全部 hasLearned=1 时
   *    走现有 courseTaskComplete 闭环(通知学习地图 + 关页)
   * 不依赖跨域 localStorage:三节课与 zsgl 不同源,以 zsgl 服务端状态为准
   */
  private startThirdPartyFlow(): void {
    if (this.thirdPartyFlowStarted) {
      return;
    }
    this.thirdPartyFlowStarted = true;
    Application.App.log.Info(
      "[三方课程] 启动自动化:自动点击「立即学习」+ 轮询课程完成状态",
    );

    // 1. 轮询查找「立即学习」按钮(MUI Button 由 React 渲染,需等待挂载)
    let findAttempts = 0;
    this.timerManager.setInterval(
      "findLearnButton",
      () => {
        findAttempts++;
        if (findAttempts > ZSGL_CONSTANTS.MAX_ATTEMPT_COUNT * 4) {
          this.timerManager.clearInterval("findLearnButton");
          Application.App.log.Error(
            "[三方课程] 未找到「立即学习」按钮,请人工打开三节课学习页",
          );
          return;
        }
        let btn: HTMLElement | null = findElementByText(
          "button",
          ZSGL_CONSTANTS.BUTTON_TEXT.LEARN_BUTTON,
        );
        if (!btn) {
          // MUI 按钮结构: <button><span class="MuiButton-label">立即学习</span></button>
          const label = findElementByText(
            "span",
            ZSGL_CONSTANTS.BUTTON_TEXT.LEARN_BUTTON,
          );
          btn = (label?.closest("button") as HTMLElement) || null;
        }
        if (btn) {
          this.timerManager.clearInterval("findLearnButton");
          Application.App.log.Info(
            `[三方课程] 已自动点击「${ZSGL_CONSTANTS.BUTTON_TEXT.LEARN_BUTTON}」`,
          );
          btn.click();
        }
      },
      ZSGL_CONSTANTS.CHECK_INTERVAL_MS,
    );

    // 2. 定时轮询服务端完成状态(默认30s;三方课程页面停留即可维持时长上报)
    this.timerManager.setInterval(
      "thirdPartyPoll",
      () => {
        this.pollThirdPartyCourseStatus();
      },
      ZSGL_CONSTANTS.THIRD_PARTY_POLL_INTERVAL_MS,
    );
  }

  /** 轮询三方课程完成状态:全部 hasLearned=1 时走现有 courseTaskComplete 闭环 */
  private async pollThirdPartyCourseStatus(): Promise<void> {
    if (!this.courseDetailRequestUrl) {
      return;
    }
    try {
      const res = await sendApiRequest<any>(
        "GET",
        this.courseDetailRequestUrl,
      );
      const arr = res?.data?.body?.courseFileArr;
      if (!Array.isArray(arr) || arr.length === 0) {
        return;
      }
      const learnedCount = arr.filter(
        (item: any) => String(item.hasLearned) === "1",
      ).length;
      if (learnedCount >= arr.length) {
        this.timerManager.clearInterval("thirdPartyPoll");
        Application.App.log.Info(
          "[三方课程] 服务端判定全部任务已学习,走课程完成闭环",
        );
        this.courseTaskCompleteFc();
      } else {
        Application.App.log.Debug(
          `[三方课程] 轮询: ${learnedCount}/${arr.length} 已完成`,
        );
      }
    } catch (e) {
      Application.App.log.Warn("[三方课程] 轮询 queryCourseDetail 失败", e);
    }
  }

  /** 构建任务列表 */
  private async buildTasks(): Promise<void> {
    Application.App.log.Info(
      "开始构建任务列表，共",
      this.courseDetailData.length,
      "个任务",
    );

    // 重建前先停止并清空旧任务,防止任务对象与监听器累积
    this.taskList.forEach((task) => task.Stop());
    this.taskList = [];

    for (let index = 0; index < this.courseDetailData.length; index++) {
      const value = this.courseDetailData[index];
      Application.App.log.Debug(
        `构建任务 ${index + 1}:`,
        value.fileName,
        "类型:",
        value.cwType,
      );

      const task = TaskFactory.CreateCourseTask(value);

      if (!task) {
        Application.App.log.Warn(`任务 ${index + 1} 创建失败，跳过`);
        continue;
      }

      task.jobIndex = index;
      try {
        await task.Init();
      } catch (e) {
        // 单个任务初始化失败(如视频元素尚未挂载)只跳过该任务,不让整个课程流程死掉
        Application.App.log.Error(`任务 ${index + 1} 初始化失败，跳过`, e);
        continue;
      }
      this.taskList.push(task);
      task.addEventListener("complete", () => {
        this.callEvent("taskComplete", index, task);
      });
      Application.App.log.Debug(`任务 ${index + 1} 初始化完成`);
    }

    Application.App.log.Info(
      "任务列表构建完成，共",
      this.taskList.length,
      "个有效任务",
    );
  }

  /** 获取下一页元素 */
  protected afterPage(): HTMLElement | null {
    const els = document.querySelectorAll(
      `${ZSGL_CONSTANTS.SELECTORS.NCELLS} > *:not(${ZSGL_CONSTANTS.SELECTORS.CURRENTS}) > ${ZSGL_CONSTANTS.SELECTORS.ORANGE01}`,
    );
    const now = document.querySelector(
      `${ZSGL_CONSTANTS.SELECTORS.NCELLS} > ${ZSGL_CONSTANTS.SELECTORS.CURRENTS}`,
    ) as HTMLElement;

    for (let i = 0; i < els.length; i++) {
      if (
        now &&
        now.getBoundingClientRect().top < els[i].getBoundingClientRect().top
      ) {
        return els[i] as HTMLElement;
      }
    }
    return null;
  }

  /** 翻页 */
  protected nextPage(num: number): void {
    let el =
      (document.querySelector(
        `${ZSGL_CONSTANTS.SELECTORS.CURRENTS} ~ span`,
      ) as HTMLElement) ||
      (document.querySelector(
        ZSGL_CONSTANTS.SELECTORS.PREV_NEXT,
      ) as HTMLElement);

    if (el != undefined) {
      return el.click();
    }

    el = this.afterPage();
    if (el == undefined) {
      if (
        document.querySelector(
          `${ZSGL_CONSTANTS.SELECTORS.NCELLS} > *:not(${ZSGL_CONSTANTS.SELECTORS.CURRENTS}) > ${ZSGL_CONSTANTS.SELECTORS.LOCK}`,
        ) == undefined
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
