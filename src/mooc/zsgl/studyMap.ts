/*
 * @Author: guotao
 * @Date: 2025-03-15 10:55:02
 * @LastEditors: guotao
 * @LastEditTime: 2026-09-23 16:45:33
 * @FilePath: \course-tools\src\mooc\zsgl\studyMap.ts
 * @Description: zsgl 学习地图模块
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */
import { Task, TaskType } from "@App/internal/app/task";
import { Application } from "@App/internal/application";
import {
  CssBtn,
  hookHttpRequest,
  removeHttpRequestHook,
  TimerManager,
  createStorageHandler,
  findElementByText,
  setupPageKeepAlive,
} from "./utils/utils";
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
  protected studyMapDataList: StudyMapData[] = [];
  /** 定时器管理器 */
  private timerManager: TimerManager = new TimerManager();
  /** 无媒体任务(resourceType=153)新开标签页句柄:由 window.open 钩子捕获,用于十秒后代关 */
  private plainTaskWindow: Window | null = null;
  /** window.open 捕获钩子是否已安装(幂等) */
  private windowOpenHooked: boolean = false;

  public Init(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        // 页面保活:学习地图页无媒体播放、纯等任务完成通知,
        // 持 Web Lock 防后台挂机被浏览器冻结致通知延迟
        setupPageKeepAlive();

        // 先注册所有HTTP请求钩子
        await this.hookStudymapGateRequests();
        await this.hookStudymapGateTaskRequests();

        // 数据获取完成后执行元素查找
        if (this.studyMapData) {
          await this.setupCurrentLevelButton();
        } else {
          this.Done();
        }
        const taskKey = `${ZSGL_CONSTANTS.STORAGE_PREFIX}${this.gateTaskData?.resourceId}`;
        Application.App.log.Debug("zsglStudyMap开始初始化任务", taskKey);

        this.setupMessageListener(taskKey);
        Application.App.log.Debug(
          "拦截请求完成hookStudymapGateTaskRequests",
          this.gateTaskData,
        );
        // this.defaultStartButton();
        Application.App.log.Debug(
          "Application.App.config.auto",
          Application.App.config.auto,
        );

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
      this.timerManager.setInterval(
        "checkLevelBtn",
        async () => {
          const currentbutton = Array.from(
            document.querySelectorAll("li"),
          ).find((li) => {
            return li.textContent?.includes(
              `第 ${this.studyMapData.gateNameIndex + 1} 关`,
            );
          });

          if (currentbutton) {
            this.timerManager.clearInterval("checkLevelBtn");
            currentbutton.addEventListener("click", async () => {
              Application.App.log.Info("按钮被点击，开始执行任务");
              // 这里添加自定义逻辑
              await this.hookStudymapGateTaskRequests();
              if (this.gateTaskData && Application.App.config.auto === true) {
                await this.Start();
              }
            });
            // 站点关卡点击为 toggle 行为:目标关卡任务数据已在 Init 拦截到,
            // 说明页面当前展示的就是该关卡(任务列表已展开),再程序化 click
            // 会把列表折叠收起致 Start 找不到任务卡
            // (实机日志 1790150855658:点击后无 gatetask 请求 + 反复"null 开始任务中的当前按钮")
            if (!this.gateTaskData) {
              currentbutton.click();
            } else if (Application.App.config.auto === true) {
              // 已展开且数据就绪:跳过点击直接启动任务
              Application.App.log.Info(
                "目标关卡已展开且任务数据就绪,跳过关卡点击直接开始",
              );
              this.Start();
            }
            Application.App.log.Debug(
              currentbutton,
              "init当前按钮",
              `第 ${this.studyMapData.gateNameIndex + 1} 关`,
            );
            resolve();
          }
        },
        ZSGL_CONSTANTS.CHECK_INTERVAL_MS,
      );
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
    this.timerManager.setInterval(
      "createStartBtn",
      () => {
        Application.App.log.Debug("开始创建开始按钮");
        const prev = document.querySelector(
          ZSGL_CONSTANTS.SELECTORS.MUI_LIST_ROOT,
        );

        if (prev) {
          const startBtn = CssBtn(
            createBtn(
              Application.App.config.auto
                ? ZSGL_CONSTANTS.BUTTON_TEXT.STOP_AUTO
                : ZSGL_CONSTANTS.BUTTON_TEXT.START_AUTO,
              "控制所有课程页面的自动挂机状态",
              ZSGL_CONSTANTS.CSS_CLASSES.ZSGL_AUTO_BTN,
            ),
          );

          startBtn.addEventListener("click", () => {
            if (startBtn.innerText === ZSGL_CONSTANTS.BUTTON_TEXT.STOP_AUTO) {
              Application.App.config.auto = false;
              startBtn.innerText = ZSGL_CONSTANTS.BUTTON_TEXT.START_AUTO;
              startBtn.title = "控制所有课程页面的自动挂机状态";
              Application.App.log.Info("挂机停止了");
            } else {
              Application.App.config.auto = true;
              startBtn.innerText = ZSGL_CONSTANTS.BUTTON_TEXT.STOP_AUTO;
              startBtn.title = "停止挂机,开始好好学习";
              Application.App.log.Info("挂机开始了");
              // this.Init();
              if (this.gateTaskData) {
                this.Start();
              }
            }
          });

          prev.prepend(startBtn);
          this.timerManager.clearInterval("createStartBtn");
        }
      },
      ZSGL_CONSTANTS.CHECK_INTERVAL_MS,
    );
  }

  /** 拦截学习地图关卡请求 */
  protected hookStudymapGateRequests(): Promise<void> {
    return new Promise((resolve) => {
      hookHttpRequest(
        ZSGL_CONSTANTS.HTTP_ENDPOINTS.QUERY_STUDYMAP_GATE,
        (response, self) => {
          Application.App.log.Debug("原始响应数据", response);
          self.studyMapDataList = response?.body;
          const skipElective = Application.App.config.skip_elective;
          Application.App.log.Debug("是否跳过选修课程", skipElective);
          self.studyMapData = self.studyMapDataList
            .map(
              (item: any, index: number): StudyMapData => {
                const gateName = item.gateName;
                const gateNameIndex = index;
                Application.App.log.Debug(
                  gateName,
                  gateNameIndex,
                  "当前关卡",
                  "status:",
                  item.status,
                  "finishTaskNum:",
                  item.finishTaskNum,
                  "taskNum:",
                  item.taskNum,
                );
                return {
                  gateName,
                  gateNameIndex,
                  status: item.status,
                  finishTaskNum: item.finishTaskNum,
                  taskNum: item.taskNum,
                  studymapGateId: item.studymapGateId,
                };
              },
            )
            .find((item: StudyMapData) => {
              if (skipElective) {
                return item.status != 3;
              }
              return item.finishTaskNum !== item.taskNum;
            });

          Application.App.log.Debug("成功拦截课程数据", {
            courseCount: self.studyMapData?.length || 0,
            gateName: self.studyMapData?.gateName || "",
            studymapGateId: self.studyMapData?.studymapGateId || "",
          });
          Application.App.log.Debug("筛选的结果数据", self.studyMapData);
          resolve();
        },
        this,
      );
    });
  }

  /**
   * 拦截学习地图关卡任务请求
   * 重入语义:每次调用先注销本 context 旧钩子再注册(重新武装),
   * 避免上一次已超时作废(resolved=true)的回调驻留,
   * 经 hookHttpRequest 按 context 去重拦截后吞掉后续正确的 gatetask 请求
   * (Init 先拦截后点击、skip_elective=false 目标关卡≠初始关卡时必现)
   */
  protected hookStudymapGateTaskRequests(): Promise<void> {
    return new Promise((resolve) => {
      // 重新武装:注销旧钩子,否则去重机制会跳过本次注册,新回调永远无法生效
      removeHttpRequestHook(
        ZSGL_CONSTANTS.HTTP_ENDPOINTS.QUERY_STUDYMAP_GATE_TASK,
        this,
      );

      let resolved = false;

      const timeout = setTimeout(() => {
        if (!resolved) {
          Application.App.log.Warn("关卡任务请求拦截超时，继续执行");
          // 超时即作废:同步注销钩子,防止残留回调吞掉后续正确请求
          removeHttpRequestHook(
            ZSGL_CONSTANTS.HTTP_ENDPOINTS.QUERY_STUDYMAP_GATE_TASK,
            this,
          );
          resolved = true;
          resolve();
        }
      }, 3000);

      hookHttpRequest(
        ZSGL_CONSTANTS.HTTP_ENDPOINTS.QUERY_STUDYMAP_GATE_TASK,
        (response, self, url) => {
          if (!resolved) {
            const urlParams = new URLSearchParams(url.split("?")[1]);
            const requestGateId = urlParams.get("studymapGateId");

            Application.App.log.Debug(
              "原始响应数据queryStudymapGateTask",
              response,
            );
            Application.App.log.Debug(
              "请求的studymapGateId:",
              requestGateId,
              "期望的studymapGateId:",
              self.studyMapData?.studymapGateId,
            );

            if (
              requestGateId &&
              self.studyMapData?.studymapGateId &&
              requestGateId !== self.studyMapData.studymapGateId
            ) {
              Application.App.log.Debug(
                "studymapGateId不匹配，跳过此请求，继续等待正确的请求",
              );

              return;
            }

            const responseData = response?.body;
            self.gateTaskData = responseData.taskList.find(
              (item: { resourceType: number; status: number }) =>
                item.status !== 1 && item.resourceType !== 2,
            );

            if (!self.gateTaskData) {
              const unfinishedTasks = responseData.taskList.filter(
                (item: { status: number }) => item.status !== 1,
              );
              const examTasks = unfinishedTasks.filter(
                (item: { resourceType: number }) => item.resourceType === 2,
              );

              if (unfinishedTasks.length === 0) {
                Application.App.log.Info("当前关卡所有任务已完成，跳过此关卡");
                const currentIndex = self.studyMapData?.gateNameIndex;
                if (
                  currentIndex !== undefined &&
                  self.studyMapDataList[currentIndex]
                ) {
                  self.studyMapDataList[currentIndex].status = 3;
                }
                self.findNextLevelAndStart();
                clearTimeout(timeout);
                resolved = true;
                resolve();
                return;
              }

              if (unfinishedTasks.length === examTasks.length) {
                Application.App.log.Info(
                  "当前关卡只剩考试任务未完成，跳过此关卡",
                );
                const currentIndex = self.studyMapData?.gateNameIndex;
                if (
                  currentIndex !== undefined &&
                  self.studyMapDataList[currentIndex]
                ) {
                  self.studyMapDataList[currentIndex].status = 1;
                }
                self.findNextLevelAndStart();
                clearTimeout(timeout);
                resolved = true;
                resolve();
                return;
              }
            }

            Application.App.log.Debug(
              "成功拦截课程任务数据queryStudymapGateTask",
              {
                taskCount: self.gateTaskData?.length || 0,
                taskName: self.gateTaskData?.taskName || "",
                taskId: self.gateTaskData?.resourceId || "",
              },
            );
            clearTimeout(timeout);
            resolved = true;
            resolve();
          }
        },
        this,
      );
    });
  }

  /** 查找下一个关卡并开始执行 */
  private async findNextLevelAndStart(): Promise<void> {
    const skipElective = Application.App.config.skip_elective;

    this.studyMapData = this.studyMapDataList
      .map(
        (item: any, index: number): StudyMapData => {
          return {
            gateName: item.gateName,
            gateNameIndex: index,
            status: item.status,
            finishTaskNum: item.finishTaskNum,
            taskNum: item.taskNum,
            studymapGateId: item.studymapGateId,
          };
        },
      )
      .find((item: StudyMapData) => {
        if (skipElective) {
          return item.status != 3;
        }
        return item.finishTaskNum !== item.taskNum;
      });

    if (this.studyMapData) {
      Application.App.log.Info("找到下一个关卡", this.studyMapData.gateName);
      // 清除上一关任务数据:防 stale 数据误触发 setupCurrentLevelButton 的
      // "已展开跳过点击"分支对旧任务直接 Start
      this.gateTaskData = undefined;
      await this.hookStudymapGateTaskRequests();
      await this.setupCurrentLevelButton();
      
      if (this.gateTaskData && Application.App.config.auto === true) {
        await this.Start();
      }
    } else {
      Application.App.log.Info("所有关卡已完成");
      this.studyMapData = null;
    }
  }

  public Done(): boolean {
    return this.studyMapData === null;
  }

  /** 开始执行课程任务 */
  public Start(): Promise<any> {
    Application.App.log.Info("开始执行课程任务");
    return new Promise<void>((resolve) => {
      // 任务名匹配做空白归一化:接口 taskName 与页面渲染文本可能存在空格差异
      // (实机日志:taskName 为 "5-一图读懂  《...》" 含连续空格)
      const normalize = (text: string) => text.replace(/\s+/g, "");
      const targetName = normalize(this.gateTaskData?.taskName || "");
      const isPlainTask = Number(this.gateTaskData?.resourceType) === 153;
      if (isPlainTask) {
        this.hookWindowOpen();
      }
      let attemptCount = 0;
      this.timerManager.setInterval(
        "findTaskBtn",
        () => {
          Application.App.log.Debug(
            "课程任务执行完成",
            this.gateTaskData?.taskName,
          );
          attemptCount++;
          if (attemptCount > ZSGL_CONSTANTS.MAX_ATTEMPT_COUNT * 4) {
            this.timerManager.clearInterval("findTaskBtn");
            Application.App.log.Warn(
              "开始任务失败:未找到任务卡(超过最大尝试次数),请人工处理",
            );
            return;
          }

          const currentHtmlList = Array.from(
            document.querySelectorAll("li.MuiListItem-root"),
          );
          let currentbutton: HTMLElement | null = null;

          currentHtmlList.forEach((li) => {
            const currentP = Array.from(li.querySelectorAll("p")).find((p) => {
              return targetName && normalize(p.innerText).includes(targetName);
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

            // resourceType=153(无媒体图文任务):点击打开的页面非 course 页,
            // 课程页的十秒完成闭环(course.ts)不会运行,由学习地图接管——
            // 十秒后关闭新开标签页并刷新本页进入下一任务
            if (isPlainTask) {
              this.schedulePlainTaskClose();
            }
            resolve();
          }
        },
        ZSGL_CONSTANTS.CHECK_INTERVAL_MS,
      );
    });
  }

  /**
   * 捕获站点 window.open 返回的新标签页句柄(幂等):
   * 关卡任务点击由站点代码打开新标签页,学习地图需持有句柄才能代为关闭
   */
  private hookWindowOpen(): void {
    if (this.windowOpenHooked) {
      return;
    }
    this.windowOpenHooked = true;
    const originalOpen = window.open.bind(window);
    window.open = (
      url?: string | URL,
      target?: string,
      features?: string,
    ): Window | null => {
      const win = originalOpen(url, target, features);
      console.log(win, "window.open 返回的新标签页句柄");
      if (win) {
        this.plainTaskWindow = win;
        Application.App.log.Debug("[无媒体任务] 已捕获新标签页句柄");
      }
      return win;
    };
  }

  /**
   * 无媒体任务(resourceType=153)完成闭环:
   * 页面停留 PLAIN_COURSE_CLOSE_DELAY_MS 后关闭新开标签页并刷新学习地图,
   * 由下一轮 Init 重新拉取关卡任务推进(学习记录以页面访问为准,由任务页自行上报)
   */
  private schedulePlainTaskClose(): void {
    Application.App.log.Info(
      "[无媒体任务] resourceType=153,页面停留十秒后将关闭任务标签页并刷新学习地图",
    );
    this.timerManager.setTimeout(
      "plainTaskClose",
      () => {
        if (this.plainTaskWindow) {
          try {
            this.plainTaskWindow.close();
          } catch (e) {
            Application.App.log.Warn("[无媒体任务] 关闭任务标签页失败", e);
          }
          Application.App.log.Info(
            "[无媒体任务] 停留时长已满足,已关闭任务标签页,刷新学习地图进入下一任务",
          );
          window.location.reload();
        } else {
          Application.App.log.Warn(
            "[无媒体任务] 未捕获到新标签页句柄(可能被弹窗拦截),请手动关闭任务页;不自动刷新以免重复循环",
          );
        }
      },
      ZSGL_CONSTANTS.PLAIN_COURSE_CLOSE_DELAY_MS,
    );
  }

  public Type(): TaskType {
    return "studyMap";
  }

  public Stop(): Promise<void> {
    this.timerManager.clearAll();
    return Promise.resolve();
  }
}
