/*
 * @Author: guotao
 * @Date: 2025-03-15 10:55:02
 * @LastEditors: guotao
 * @LastEditTime: 2025-09-28 16:27:16
 * @FilePath: \course-tools\src\mooc\zsgl\studyMap.ts
 * @Description:
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */
import { Task, TaskType } from "@App/internal/app/task";
import { Application } from "@App/internal/application";
import { CssBtn, hookHttpRequest } from "./utils/utils";
import { createBtn, protocolPrompt } from "@App/internal/utils/utils";
import { NewChromeServerMessage } from "@App/internal/utils/message";
export class ZsglStudyMap extends Task {
  protected gateTaskData: any;
  protected studyMapData: any;
  public Init(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      // 先执行拦截请求
      await this.hookStudymapGateRequests().then(() => {
        console.log("拦截请求完成", this.studyMapData);
        // 数据获取完成后执行元素查找
        if (this.studyMapData) {
          const checkExistTimer = setInterval(async() => {
            const currentbutton = Array.from(
              document.querySelectorAll("li")
            ).find((li) => {
              return li.textContent.includes(`第 ${this.studyMapData.gateNameIndex+1} 关`);
            });
            if (currentbutton) {
              clearInterval(checkExistTimer);
              currentbutton.addEventListener('click', async() => {
                  console.log('按钮被点击，开始执行任务');
                // 这里添加自定义逻辑
                if (this.gateTaskData && Application.App.config.studymap_auto === true) {
                  await this.Start();
                }
                  });
              currentbutton.click();
              console.log(
                currentbutton,
                "init当前按钮",
                `第 ${this.studyMapData.gateNameIndex + 1} 关`
              );
            }
          }, 500);
        } else {
          this.Done();
        }
      }); // 添加 await
      await this.hookStudymapGateTaskRequests(); // 添加 await
      const taskKey = `zsgl_task_${this.gateTaskData.resourceId}`;
      Application.App.log.Debug("zsglStudyMap开始初始化任务", taskKey);
      const msg = NewChromeServerMessage("zsgl-tools");
      msg.Accept((client, data) => {
        console.log("zsglStudyMap接受消息", data);
        // Application.App.log.Debug("zsglStudyMap接受消息", data);
          switch (data.type) {
            case taskKey: {
              // Application.App.log.Debug("studyMap 任务完成", data);
              console.log("studyMap 任务完成", data);
              window.location.reload();
              break;
            }
          }
        });
      console.log("拦截请求完成hookStudymapGateTaskRequests", this.gateTaskData);
      this.defaultStartButton();
      console.log("Application.App.config.studymap_auto", Application.App.config.studymap_auto);
      // await this.Start();
      this.addEventListenerOnce("load", () => {
        console.log("reload");
        this.Init();
      });
      resolve();
    });
  }

  protected defaultStartButton(): void {
    const statrtBtnCreatTimer = setInterval(() => {
      console.log("开始创建开始按钮");
      const prev = document.querySelector("ul.MuiList-root");
      console.log(prev, "prev");
      if (prev) {
        const startBtn = CssBtn(
          createBtn(
            Application.App.config.studymap_auto ? "暂停挂机" : "开始挂机",
            "点击开始自动挂机",
            "zsgl-auto-btn"
          )
        );
        startBtn.addEventListener("click", () => {
          if (startBtn.innerText == '暂停挂机') {
              Application.App.config.studymap_auto=false
                startBtn.innerText = "开始挂机";
                startBtn.title = "点击开始自动挂机";
                Application.App.log.Info("挂机停止了");
            } else {
              Application.App.config.studymap_auto=true
                startBtn.innerText = '暂停挂机';
                startBtn.title = "停止挂机,开始好好学习";
            Application.App.log.Info("挂机开始了");
            this.Init();
                // this.Start();
            }
        });
        prev.prepend(startBtn);
        clearInterval(statrtBtnCreatTimer);
      }
    });
  }
  // 修改拦截方法返回 Promise
  protected hookStudymapGateRequests(): Promise<void> {
    return new Promise((resolve) => {
      hookHttpRequest(
        "queryStudymapGate.do",
        (response, self) => {
          Application.App.log.Debug("原始响应数据", response);
          const responseData = response?.body;
          self.studyMapData = responseData
            .map((item: {
              taskNum: any;
              finishTaskNum: any; status: number; gateName: any 
}, index: any) => {
              const gateName = item.gateName;
              const gateNameIndex = index;
              console.log(gateName, gateNameIndex, "当前关卡");
              return {
                gateName,
                gateNameIndex,
                status: item.status,
                finishTaskNum: item.finishTaskNum,
                taskNum: item.taskNum,
              };
            })
            .find((item: {
              finishTaskNum: any;
              taskNum: any; status: number 
}) => item.status !== 3||item.finishTaskNum!==item.taskNum);

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

  protected hookStudymapGateTaskRequests(): Promise<void> {
    return new Promise((resolve) => {
      hookHttpRequest(
        "queryStudymapGateTask.do",
        (response, self) => {
          Application.App.log.Debug("原始响应数据queryStudymapGateTask", response);
          const responseData = response?.body;
          self.gateTaskData = responseData.taskList.find(
            (item: { status: number }) => item.status !== 1
          );
          Application.App.log.Debug("成功拦截课程任务数据queryStudymapGateTask", {
            taskCount: self.gateTaskData?.length || 0,
            taskName: self.gateTaskData.taskName || "",
            taskId: self.gateTaskData.resourceId || "",
          });
          resolve();
        },
        this
      );
    });
  }
  public Done(): boolean {
    throw new Error("Method not implemented.");
  }
  public Start(): Promise<any> {
    console.log("开始执行课程任务");
    return new Promise((resolve) => {
      const checkExistTimer = setInterval(() => {
        console.log("课程任务执行完成", this.gateTaskData.taskName);
        const currentHtmlList = Array.from(document.querySelectorAll("li.MuiListItem-root"));
        let currentbutton =null;
        currentHtmlList.forEach((li) => {
          let currentP= Array.from(li.querySelectorAll("p")).find((p) => {
            return p.innerText.includes(this.gateTaskData.taskName)
          })
          if(currentP){
            currentbutton= currentP
          }
        })
        console.log(currentbutton, "开始任务中的当前按钮");
        if (currentbutton) {
          clearInterval(checkExistTimer);
          (currentbutton as HTMLElement).click();

          // localStorage.setItem(
          //   taskKey,
          //   JSON.stringify({
          //     status: "started",
          //     // 十个小时后过期
          //     expire: Date.now() + 1000 * 60 * 60 * 10,
          //   })
          // );
        }
      });
      // const checkTaskStatusTimer = setInterval(() => {
      //   const taskStatus = JSON.parse(localStorage.getItem(taskKey) || "{}");
      //   if (Date.now() > taskStatus.expire) {
      //     localStorage.removeItem(taskKey);
      //   }
      //   if (taskStatus.status === "finished" && Application.App.config.studymap_auto) {
      //     localStorage.removeItem(taskKey);
      //     // 任务完成，刷新页面
      //     clearInterval(checkTaskStatusTimer);
      //     window.location.reload();
      //   }
      // }, 1000);
    });
  }
  public Type(): TaskType {
    throw new Error("Method not implemented.");
  }
}
