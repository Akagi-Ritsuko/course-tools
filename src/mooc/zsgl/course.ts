/*
 * @Author: guotao
 * @Date: 2025-03-15 10:55:02
 * @LastEditors: guotao
 * @LastEditTime: 2025-03-16 13:20:48
 * @FilePath: \course-tools\src\mooc\zsgl\course.ts
 * @Description:
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */
import { Task, TaskType } from "@App/internal/app/task";
import { Application } from "@App/internal/application";
import { hookHttpRequest } from "./utils/utils";

export class ZsglCourse extends Task {
  protected gateTaskData: any;
  protected studyMapData: any;
  public Init(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      // 先执行拦截请求
      await this.hookStudymapGateRequests().then(() => {
        console.log("拦截请求完成", this.studyMapData);
        // 数据获取完成后执行元素查找
        if (this.studyMapData) {
          const checkExistTimer = setInterval(() => {
            const currentbutton = Array.from(
              document.querySelectorAll("li")
            ).find((li) => {
              return li.textContent.includes(`第 1 关`);
            });
            if (currentbutton) {
              clearInterval(checkExistTimer);
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
      await this.Start();
      this.addEventListenerOnce("load", () => {
        console.log("reload");
        this.Init();
      });
      resolve();
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
            .map((item: { status: number; gateName: any }, index: any) => {
              const gateName = item.gateName;
              const gateNameIndex = index;
              console.log(gateName, gateNameIndex, "当前关卡");
              return {
                gateName,
                gateNameIndex,
                status: item.status,
              };
            })
            .find((item: { status: number }) => item.status === 3);

          Application.App.log.Debug("成功拦截课程数据", {
            courseCount: self.studyMapData?.length || 0,
            gateName: self.studyMapData?.gateName || "",
          });
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
          Application.App.log.Debug("原始响应数据", response);
          const responseData = response?.body;
          self.gateTaskData = responseData.taskList.find(
            (item: { status: number }) => item.status === 1
          );
          Application.App.log.Debug("成功拦截课程任务数据", {
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
      const taskKey = `zsgl_task_${this.gateTaskData.resourceId}`;
      const checkExistTimer = setInterval(() => {
        console.log("课程任务执行完成", this.gateTaskData.taskName);
        const currentbutton = Array.from(document.querySelectorAll("p")).find(
          (li) => {
            return li.textContent.includes(`${this.gateTaskData.taskName}`);
          }
        );
        console.log(currentbutton, "开始任务中的当前按钮");
        if (currentbutton) {
          clearInterval(checkExistTimer);
          currentbutton.click();

          localStorage.setItem(
            taskKey,
            JSON.stringify({
              status: "started",
              // 三个小时后过期
              expire: Date.now() + 1000 * 60 * 60 * 3,
            })
          );
        }
      });
      const checkTaskStatusTimer = setInterval(() => {
        const taskStatus = JSON.parse(localStorage.getItem(taskKey) || "{}");
        if (taskStatus.status === "finished") {
          clearInterval(checkTaskStatusTimer);
          window.location.reload();
        }
      }, 1000);
    });
  }
  public Type(): TaskType {
    throw new Error("Method not implemented.");
  }
}
