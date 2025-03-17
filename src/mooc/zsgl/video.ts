/*
 * @Author: guotao
 * @Date: 2025-03-12 17:19:39
 * @LastEditors: guotao
 * @LastEditTime: 2025-03-17 18:04:11
 * @FilePath: \course-tools\src\mooc\zsgl\video.ts
 * @Description:
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */
import { Mooc } from "@App/internal/app/mooc";
import { MoocTaskSet } from "@App/internal/app/mooc";
import { Task, TaskType } from "@App/internal/app/task";
import { CssBtn } from "../chaoxing/utils";
import {
  randNumber,
  post,
  substrex,
  protocolPrompt,
  createBtn,
} from "@App/internal/utils/utils";
import { Application } from "@App/internal/application";
import { resolve } from "path";
import { hookHttpRequest } from "./utils/utils";
import { isContext } from "vm";

export class ZsglVideo extends Task {
  protected outerTimer: NodeJS.Timeout;
  protected timer: NodeJS.Timeout;
  protected video: HTMLVideoElement;
  protected controlBar: HTMLDivElement;
  protected iframe: HTMLIFrameElement;
  protected courseDetailData: any;

  public Init(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      let attemptCount = 0;
      await this.hookCourseDetailRequests().then(() => {
        const chooseTaskTimer = setInterval(() => {
          attemptCount++;
          if (attemptCount > 10) {
            clearInterval(chooseTaskTimer);
            reject(new Error("初始化失败：超过最大尝试次数（10次）"));
            return;
          }
          const taskDiv = Array.from(
            document.querySelectorAll("span")
          ).find((div) =>
            div.textContent?.includes(`${this.courseDetailData.fileName}`)
          );
          console.log("寻找taskDiv", this.courseDetailData.fileName);
          if (taskDiv) {
            clearInterval(chooseTaskTimer);
            taskDiv.click();
            this.video=document.querySelector("#course-video_html5_api");
          }
        }, 1000);
      }); // 添加钩子函数
      this.outerTimer = setInterval(() => {
        attemptCount++;
        if (attemptCount > 10) {
          clearInterval(this.outerTimer);
          reject(new Error("初始化失败：超过最大尝试次数（10次）"));
          return;
        }
        const startButton = document.querySelector(".MuiButton-root");
        if (startButton && this.courseDetailData.cwType === "scorm") {
          // 修复3：先停止定时器再执行点击
          // 修复4：移除事件监听避免重复绑定
          const clickHandler = () => {
            this.findvideoinit()
              .then(() => {
                // 修复点1：移除参数
                Application.App.log.Debug("视频任务初始化完成");
                clearInterval(this.outerTimer);
                resolve(); // 修复点2：显式决议
              })
              .catch((e) => {
                Application.App.log.Error(e.message);
                reject(e); // 修复点3：错误传递
              });
          };
          startButton.removeEventListener("click", clickHandler);
          startButton.addEventListener("click", clickHandler, { once: true });

          console.log("准备执行startButton", startButton);
          (startButton as HTMLElement).click();
        } else {
          resolve();
        }
      }, 1000);
    }).then(() => {
      this.initPlayer();
      this.Start();
      this.createControlBar();
      Application.App.log.Debug("外层初始化最终完成");
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
            self.courseDetailData = courseFileArr
              .map((item: any) => {
                return {
                  hasLearned: item.hasLearned,
                  fileName: item.fileName,
                  cwType: item.cwType,
                };
              })
              .find((item: any) => item.hasLearned !== "1");
            console.log("课程详情数据2", self.courseDetailData);
            resolve();
          } else {
            const courseId = responseData?.courseId;
            const taskKey = `zsgl_task_${courseId}`;
            const taskStatus = localStorage.getItem(taskKey);
            const taskStatusObj = taskStatus ? JSON.parse(taskStatus) : null;
            if (taskStatusObj && Date.now() < taskStatusObj.expire) {
              taskStatusObj.status = "finished";
              localStorage.setItem(taskKey, JSON.stringify(taskStatusObj));
              this.courseDetailData = responseData?.courseFileArr;
              resolve();
            }
            this.Done();
          }
        },
        this
      );
    });
  }
  private findvideoinit(): Promise<void> {
    return new Promise((resolve, reject) => {
      let attemptCount = 0;
      const videoTimer = setInterval(() => {
        attemptCount++;
        console.debug(`[视频查找] 第 ${attemptCount} 次尝试`);

        if (attemptCount > 10) {
          clearInterval(videoTimer);
          reject(new Error("视频查找失败：超过最大尝试次数（10次）"));
          return;
        }

        const deepFindVideo = (doc: Document): HTMLVideoElement => {
          try {
            console.debug(
              `[视频查找] 正在检查文档: ${doc.title || "未命名文档"}`
            );

            let video = doc.querySelector("video");
            if (video) {
              console.debug("[视频查找] 找到视频元素", {
                id: video.id,
                src: video.src,
                parent: video.parentElement?.tagName,
              });
              return video;
            }

            const frames = doc.querySelectorAll("frame, iframe");
            console.debug(`[视频查找] 发现 ${frames.length} 个框架`);

            for (const frame of Array.from(frames) as (
              | HTMLFrameElement
              | HTMLIFrameElement
            )[]) {
              try {
                console.debug(`[视频查找] 检查框架:`, {
                  id: frame.id,
                  src: frame.src.substring(0, 50), // 截取部分URL避免日志过长
                });

                const frameDoc =
                  frame.contentDocument || frame.contentWindow?.document;
                if (!frameDoc) {
                  console.debug("[视频查找] 框架无文档对象");
                  continue;
                }

                if (frame.id === "course_frame_id") {
                  console.debug("[视频查找] 发现目标框架 course_frame_id");
                  const targetVideo = frameDoc.querySelector("video");
                  if (targetVideo) {
                    console.debug("[视频查找] 在目标框架找到视频");
                    return targetVideo;
                  }
                }

                console.debug("[视频查找] 进入嵌套框架查找...");
                const result = deepFindVideo(frameDoc);
                if (result) return result;
              } catch (e) {
                console.warn("[视频查找] 跨域访问被阻止:", {
                  frameId: frame.id,
                  src: frame.src,
                  error: e.message,
                });
              }
            }
            return null;
          } catch (e) {
            console.error("[视频查找] 文档遍历异常:", {
              error: e.stack,
              documentURL: doc.URL,
            });
            return null;
          }
        };
        const iframe = document.querySelector("iframe");
        const iframeDoc =
          iframe.contentDocument || iframe.contentWindow?.document || document;
        const video = deepFindVideo(iframeDoc);
        if (video) {
          clearInterval(videoTimer);
          console.info("[视频查找] 视频元素查找成功", video);
          this.video = video;
          video.addEventListener("ended", () => {
            Application.App.log.Info("视频播放结束");
            this.Done();
          });
          resolve();
        } else {
          console.debug(`[视频查找] 第 ${attemptCount} 次尝试未找到视频`);
        }
      }, 1000);
    });
  }
  private videoInit(): Promise<void> {
    return new Promise((resolve, reject) => {});
  }
  protected initPlayer() {
    Application.App.log.Debug("播放器初始化配置", {
      mute: Application.App.config.video_mute,
      multiple: Application.App.config.video_multiple,
    });
    this.video.muted = Application.App.config.video_mute;
    this.video.playbackRate = Application.App.config.video_multiple;

    // Application.App.config.auto && this.video.play();
  }

  private createControlBar() {
    Application.App.log.Debug("创建控制栏组件");
    this.controlBar = document.createElement("div");
    this.controlBar.className = "zsgl-tools-bar1";

    const boomBtn = CssBtn(
      createBtn("秒过视频", "快速完成当前视频", "zsgl-btn")
    );
    boomBtn.onclick = () => this.handleBoomVideo();

    const toggleBtn = CssBtn(
      createBtn(
        Application.App.config.auto ? "暂停挂机" : "开始挂机",
        "",
        "zsgl-toggle-btn"
      )
    );
    toggleBtn.onclick = () => this.toggleAutoPlay(toggleBtn);

    this.controlBar.append(boomBtn, toggleBtn);
    // document.querySelector('.video-container').append(this.controlBar);
    // Application.App.log.Debug("控制栏挂载完成", {
    //     buttons: this.controlBar.children.length
    // });
    const container =
      document.querySelector("#watermarkFrame") || document.body;
    container.prepend(this.controlBar);
    Application.App.log.Debug("控制栏挂载完成", {
      container: container.tagName,
      buttons: this.controlBar.children.length,
    });
  }

  private handleBoomVideo() {
    if (!protocolPrompt("秒过视频可能产生记录，是否继续?", "zsgl_boom_prompt"))
      return;
    this.video.currentTime = this.video.duration - 1;
    this.video.dispatchEvent(new Event("timeupdate"));
    Application.App.log.Debug("触发秒过操作", {
      currentTime: this.video.currentTime,
      duration: this.video.duration,
    });
  }

  private toggleAutoPlay(btn: HTMLButtonElement) {
    Application.App.config.auto = !Application.App.config.auto;
    btn.innerText = Application.App.config.auto ? "暂停挂机" : "开始挂机";
    Application.App.log.Debug("切换自动播放状态", {
      newState: Application.App.config.auto,
    });

    Application.App.config.auto && this.video.play();
    !Application.App.config.auto && this.video.pause();
  }

  public Start(): Promise<void> {
    Application.App.log.Debug("自动播放检查", {
      autoConfig: Application.App.config.auto,
      videoPaused: this.video.paused,
    });
    return new Promise((resolve, reject) => {
      console.log(this.video.currentTime, "this.video.currentTime");

      // this.video.currentTime = 0;
      setTimeout(() => {
        this.video.currentTime = 0;
      }, 5000); //为了解决视频播放完成后任务没完成导致无限循环的问题，不知道有没有更好的方法
      Application.App.config.auto && this.video.play();
      resolve();
    });
  }

  public Type(): TaskType {
    return "video";
  }

  public Done(): boolean {
    // 在ended事件处理中添加
    // this.video.addEventListener("complete", () => {
    //   Application.App.log.Debug("视频章节完成");
    // });
    this.callEvent("courseDetailTaskComplete");
    return this.video.ended;
  }
  public Next(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
