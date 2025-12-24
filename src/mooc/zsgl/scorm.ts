/*
 * @Author: guotao
 * @Date: 2025-03-12 17:19:39
 * @LastEditors: guotao
 * @LastEditTime: 2025-12-24 21:21:03
 * @FilePath: \course-tools1\src\mooc\zsgl\scorm.ts
 * @Description:
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */
import { Mooc } from "@App/internal/app/mooc";
import { MoocTaskSet } from "@App/internal/app/mooc";
import { Task, TaskType } from "@App/internal/app/task";
import { ZsglTask } from "./task";
import { CssBtn } from "../chaoxing/utils";
import { ZsglCourseControlBar } from "./course";
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
import { ZsglTaskControlBar } from "./task";
export class ZsglAudio extends ZsglTask {

  protected outerTimer: NodeJS.Timeout;
  protected timer: NodeJS.Timeout;
  protected video: HTMLVideoElement;
  protected controlBar: HTMLDivElement;
  protected iframe: HTMLIFrameElement;
  protected taskDiv: HTMLSpanElement;
  protected exitBtn:HTMLSpanElement;

  public async Start(): Promise<any> {
    await new Promise<void>(async (resolve, reject) => {
      Application.App.log.Debug("开始点击任务按钮",this.taskDiv);
      this.taskDiv.click();
      let attemptCount = 0;
      const eventPreventHandler = function (this: any, e: Event) {
                console.log(`${this.name} ${e.type}事件触发`, e);
                e.stopImmediatePropagation();
                e.stopPropagation();
            }
            //处理页面的事件监听函数的检测
            window.addEventListener('blur', eventPreventHandler, true);
            window.addEventListener('resize', eventPreventHandler, true);
            document.addEventListener('visibilitychange', eventPreventHandler, true);
            document.addEventListener('resize', eventPreventHandler, true);
            document.addEventListener('fullscreenchange', eventPreventHandler, true);
            document.addEventListener('focus', eventPreventHandler, true);
            document.addEventListener('webkitfullscreenchange', eventPreventHandler, true);
            document.addEventListener('blur', eventPreventHandler, true);
            // this.video.addEventListener('seeked', eventPreventHandler, true);
            // this.video.addEventListener('seeking', eventPreventHandler, true);
      this.outerTimer = setInterval(() => {
        attemptCount++;
        if (attemptCount > 10) {
          clearInterval(this.outerTimer);
          reject(new Error("初始化失败：超过最大尝试次数（10次）"));
          return;
        }
        const startButton = document.querySelector(".MuiButton-root");
        Application.App.log.Debug(" Start开始按钮",JSON.stringify(this.taskinfo));
        if (startButton && this.taskinfo.cwType === "scorm") {
          Application.App.log.Debug("开始点击开始按钮",startButton);
          // 修复3：先停止定时器再执行点击事件，确保视频加载完成
          clearInterval(this.outerTimer);
          // 修复4：移除事件监听避免重复绑定
          const clickHandler = () => {
            this.findvideoinit()
              .then(() => {
                // 修复点1：移除参数
                Application.App.log.Debug("视频任务初始化完成");
                this.exitBtn = document.querySelector("span.exit");
                const container =document.querySelector("#watermarkFrame") || document.body;
                const prev = document.createElement("div");
                container.prepend(prev);
                const bar = new ZsglCourseControlBar(prev);//因为开始iframe的加载,所以需要重新创建一个控制栏
                this.initPlayer();
                Application.App.log.Debug("退出按钮",this.exitBtn);
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
          clearInterval(this.outerTimer);
          resolve();
        }
      }, 1000);
    });
    
    Application.App.log.Debug("外层初始化最终完成");
  }
  public Type(): TaskType {
    return "audio";
  }
  protected initPlayer() {
    Application.App.log.Debug("播放器初始化配置", {
      mute: Application.App.config.video_mute,
      multiple: Application.App.config.video_multiple,
    });
    this.video.muted = Application.App.config.video_mute;
    this.video.playbackRate = Application.App.config.video_multiple;
    this.video.currentTime = 0; //重置播放时间来实现未完成的任务失常不够的问题

    const eventPreventHandler = function (this: any, e: Event) {
          console.log(`${this.name} ${e.type}事件触发`, e);
          e.stopImmediatePropagation();
          e.stopPropagation();
      }
    
    // 添加对视频元素的事件阻止
    this.video.addEventListener('seeked', eventPreventHandler, true);
    this.video.addEventListener('seeking', eventPreventHandler, true);
    
    // 处理页面失去焦点导致视频暂停的问题：阻止页面级别的事件传播
    window.addEventListener('blur', eventPreventHandler, true);
    window.addEventListener('resize', eventPreventHandler, true);
    document.addEventListener('visibilitychange', eventPreventHandler, true);
    document.addEventListener('resize', eventPreventHandler, true);
    document.addEventListener('fullscreenchange', eventPreventHandler, true);
    document.addEventListener('focus', eventPreventHandler, true);
    document.addEventListener('webkitfullscreenchange', eventPreventHandler, true);
    document.addEventListener('blur', eventPreventHandler, true);
    
    // 确保视频在初始化后自动播放
    Application.App.config.auto && this.video.play();
  }
  public Init(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let attemptCount = 0;
      // const chooseTaskTimer = setInterval(() => {
      //     attemptCount++;
      //     if (attemptCount > 10) {
      //       clearInterval(chooseTaskTimer);
      //       reject(new Error("初始化失败：超过最大尝试次数（10次）"));
      //       return;
      //     }
          const taskDiv = Array.from(
            document.querySelectorAll("span")
          ).find((div) =>
            div.textContent?.includes(`${this.taskinfo.fileName}`)
          );
          console.log("寻找taskDiv", this.taskinfo.fileName);
          if (taskDiv) {
            // clearInterval(chooseTaskTimer);
            this.taskDiv = taskDiv;
            // taskDiv.click();
            Application.App.log.Debug("开始初始化视频", taskDiv);
            resolve(); // 初始化完成
            // this.video=document.querySelector("#course-video_html5_api");
          }
          // else {
          //   clearInterval(chooseTaskTimer);
          //   reject(new Error("未找到任务元素"));
          // }
        // }, 500);
    }); // 添加钩子函数
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
          clearInterval(this.outerTimer);
          this.video = video;
          
          // 添加视频暂停自动恢复的定时器
          const videoPlayOrPauseTimer = setInterval(() => {
            Application.App.config.auto && this.video.paused && this.video.play();
          }, 5000);
          
          video.addEventListener("ended", () => {
            Application.App.log.Info("视频播放结束");
            // 清除自动恢复定时器
            clearInterval(videoPlayOrPauseTimer);
            this.callEvent("taskComplete"); // 触发事件
            Application.App.log.Debug("退出按钮",this.exitBtn);
            this.exitBtn.click(); // 触发退出按钮
          }, { once: true });
          
          // 确保视频在页面失去焦点时继续播放
          video.addEventListener('pause', () => {
            console.log('Video paused, attempting to resume...');
            setTimeout(() => {
              if (this.video.paused && Application.App.config.auto) {
                this.video.play();
              }
            }, 100);
          }, true);
          
          resolve();
        } else {
          console.debug(`[视频查找] 第 ${attemptCount} 次尝试未找到视频`);
        }
      }, 1000);
    });
  }
}
export class ZsglAudioControlBar extends ZsglTaskControlBar  {
    public defaultBtn() {
        super.defaultBtn();
        let pass = CssBtn(createBtn("秒过视频", "秒过视频会被后台检测到", "cx-btn"));
        let downloadSubtitle = CssBtn(createBtn("下载字幕", "我要下载字幕一同食用"));
        pass.style.background = "#F57C00";
        downloadSubtitle.style.background = "#638EE1";
        this.prev.append(pass, this.download(), downloadSubtitle);
        pass.onclick = () => {
            if (!protocolPrompt("秒过视频会产生不良记录,是否继续?", "boom_no_prompt")) {
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
        }
    }
}
