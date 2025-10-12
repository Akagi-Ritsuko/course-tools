/*
 * @Author: guotao
 * @Date: 2025-09-27 02:32:51
 * @LastEditors: guotao 1531188409@qq.com
 * @LastEditTime: 2025-10-03 00:58:43
 * @FilePath: \course-tools\src\mooc\zsgl\course.ts
 * @Description:
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */
import { Application } from "@App/internal/application";
import { ZsglTask, ZsglTaskControlBar } from "./task";
import { TaskFactory } from "./factory";
import { Mooc, MoocTaskSet, MoocEvent } from "@App/internal/app/mooc";
import { Task } from "@App/internal/app/task";
import { EventListener } from "@App/internal/utils/event";
import { hookHttpRequest } from "./utils/utils";
import { prototype } from "vue/types/umd";
import { CssBtn } from "./utils/utils";
import {
  randNumber,
  post,
  substrex,
  protocolPrompt,
  createBtn,
} from "@App/internal/utils/utils";

//课程任务
export class ZsglCourse extends EventListener<MoocEvent>
  implements MoocTaskSet {
  protected taskList: Array<ZsglTask> = [];
  protected attachments: Array<any>;

  private courseDetailData: any[]=[]; // 课程详情数据
  public Init(): Promise<any> {
    return new Promise(async (resolve) => {
      let first = true;
      window.onresize = null;
      // this.taskList = new Array<ZsglTask>();
      Application.App.log.Debug("初始化course课程任务");
      window.addEventListener("load", async () => {
        Application.App.log.Debug("document.addEventListener(load)");
        let prev: HTMLElement;
        const container =
          document.querySelector("#watermarkFrame") || document.body;
        prev = document.createElement("div");
        container.prepend(prev);
        const bar = new ZsglCourseControlBar(prev);
          await this.hookCourseDetailRequests(); // 获取课程详情
        this.OperateCard();
        first && resolve(undefined);
        first = false;
      });
    });
  }
  protected hookCourseDetailRequests(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      await hookHttpRequest(
        "queryCourseDetail.do",
        (response, self) => {
          Application.App.log.Debug("原始响应数据", response);
          const responseData = response?.body;
          if (responseData && responseData?.isCompleted !== "Y") {
            const courseFileArr = responseData?.courseFileArr;
            
            console.log("课程详情数据1", courseFileArr);
            const courseId= responseData?.courseId;
            self.courseDetailData = courseFileArr
              .map((item: any, index: number) => {
                return {
                  hasLearned: item.hasLearned,
                  fileName: item.fileName,
                  cwType: item.cwType,
                  jobIndex: index,
                  courseId
                };
              })
              .filter((item: any) => {
                return item.hasLearned === "0";
              });
            console.log("课程详情数据2", JSON.stringify(self.courseDetailData));
            resolve();
          } else {
            this.callEvent("courseTaskComplete");
            resolve();
          }
        },
        this
      );
    });
  }
  public Stop(): Promise<any> {
    throw new Error("Method not implemented.");
  }

  protected taskIndex: number = 0;

  public Next(): Promise<Task> {
    return new Promise((resolve) => {
      if (this.taskList.length > this.taskIndex) {
        resolve(this.taskList[this.taskIndex]);
        return this.taskIndex++;
      } else {
        this.callEvent("courseTaskComplete");
      }
      // 当页任务点全部结束,翻页.由于会重新加载窗口调用reload,在加载完成之后再返回任务点.(本方法是同步调用,所以使用此种方法)
      // this.addEventListenerOnce("reload", async () => {
      //     // resolve(await this.Next());
      // })
      // this.nextPage(null);
    });
  }

  public SetTaskPointer(index: number): void {
    this.taskIndex = index;
  }

  // 操作任务卡,一个页面会包含很多任务,取出来
  public async OperateCard() {
    // 构建任务
    console.log(
      "OperateCard 课程详情数据2",
      JSON.stringify(this.courseDetailData),
      this.courseDetailData.length
    );
    const loadedFlagValue = this.courseDetailData[0];
    let attemptCount = 0;
    const checkTimer = setInterval(async () => {
      attemptCount++;
      if (attemptCount > 10) {
        clearInterval(checkTimer);
        this.callEvent("courseTaskComplete"); // 如果课程详情数据为空,则表示课程已经完成,直接调用完成事件
        return;
      }
      // this.callEvent("courseTaskComplete");
      const taskDiv = Array.from(
        document.querySelectorAll("span")
      ).find((div) => div.textContent?.includes(`${loadedFlagValue.fileName}`));
      console.log("寻找taskDiv", loadedFlagValue.fileName);
      if (taskDiv) {
        clearInterval(checkTimer);
        for (let index = 0; index < this.courseDetailData.length; index++) {
          let value = this.courseDetailData[index];
          let task: ZsglTask;
          // 任务工厂去创建对应的任务对象
          task = TaskFactory.CreateCourseTask(value);
          console.log("OperateCard task", task, index);
          console.log("OperateCard taskList", this.taskList);
          if (!task) {
            continue;
          }
          task.jobIndex = index;
          this.taskList.push(task);
          console.log("OperateCard taskList after", this.taskList);
          task.addEventListener("complete", () => {
            this.callEvent("taskComplete", index, task);
          });
          await task.Init();
          }
          this.taskIndex = 0;
          this.callEvent("reload");
      }
    }, 500);


  }

  protected afterPage(): HTMLElement {
    //感觉奇葩的方法...
    let els = document.querySelectorAll(
      "div.ncells > *:not(.currents) > .orange01"
    );
    let now = <HTMLElement>document.querySelector("div.ncells > .currents");
    for (let i = 0; i < els.length; i++) {
      if (
        now.getBoundingClientRect().top < els[i].getBoundingClientRect().top
      ) {
        return <HTMLElement>els[i];
      }
    }
    return null;
  }

  protected nextPage(num: number) {
    let el =
      <HTMLElement>document.querySelector("span.currents ~ span") ||
      <HTMLElement>document.querySelector(".prev_next.next");
    if (el != undefined) {
      return el.click();
    }
    //只往后执行
    el = this.afterPage();
    if (el == undefined) {
      //进行有锁任务查找
      if (
        document.querySelector("div.ncells > *:not(.currents) > .lock") ==
        undefined
      ) {
        return this.callEvent("complete");
      }
      return setTimeout(() => {
        if (num > 5) {
          return this.callEvent("error", "被锁卡住了,请手动处理");
        }
        Application.App.log.Info("等待解锁");
        this.nextPage(num + 1);
      }, 5000);
    }
    (<any>el.parentElement.querySelector("a>span")).click();
  }
}
export class ZsglCourseControlBar extends ZsglTaskControlBar {
  public defaultBtn() {
    super.defaultBtn();
    let pass = CssBtn(
      createBtn("秒过视频", "秒过视频会被后台检测到", "cx-btn")
    );
    let downloadSubtitle = CssBtn(
      createBtn("下载字幕", "我要下载字幕一同食用")
    );
    pass.style.background = "#F57C00";
    downloadSubtitle.style.background = "#638EE1";
    this.prev.append(pass, this.download(), downloadSubtitle);
    pass.onclick = () => {
      if (
        !protocolPrompt("秒过视频会产生不良记录,是否继续?", "boom_no_prompt")
      ) {
        return;
      }
      // (<ZsglVideo>this.task).sendEndTimePack((isPassed: boolean) => {
      //     if (isPassed) {
      //         alert('秒过成功,刷新后查看效果');
      //     } else {
      //         alert('操作失败,错误');
      //     }
      // });
    };
    downloadSubtitle.onclick = () => {
      // (<Video>this.task).downloadSubtitle();
    };
  }
}

// // 考试
// export class CxExamTopic implements Mooc {
//     public Init(): any {
//         window.addEventListener("load", () => {
//             let el = <HTMLInputElement>document.querySelector("#paperId");
//             let info = "0";
//             if (el) {
//                 info = el.value;
//             }
//             let task = TaskFactory.CreateExamTopicTask(window, {
//                 refer: document.URL,
//                 id: "exam-" + info,
//                 info: info,
//             });
//             task.Init();
//             if (document.URL.indexOf("exam/test/reVersionTestStartNew") > 0) {
//                 if (Application.App.config.auto) {
//                     task.Start();
//                 }
//             }
//         });
//     }
// }

// // 作业
// export class CxHomeWork implements Mooc {
//     public Init(): any {
//         window.onload = () => {
//             let el = (<HTMLInputElement>document.querySelector("#workLibraryId"));
//             let info = "";
//             if (el) {
//                 info = el.value;
//             }
//             let task = TaskFactory.CreateHomeworkTopicTask(window, {
//                 refer: document.URL,
//                 id: info,
//                 info: info,
//             });
//             task.Init();
//             if (Application.App.config.auto && <HTMLInputElement>document.querySelector("#workLibraryId")) {
//                 task.Start();
//             }
//         }
//     }
// }
