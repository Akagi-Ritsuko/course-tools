import { Video } from "@App/mooc/chaoxing/video";
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

export class ZsglVideo extends Task {
  protected timer: NodeJS.Timeout;
  protected video: HTMLVideoElement;
  protected controlBar: HTMLDivElement;
  protected iframe: HTMLIFrameElement;

  public Init(): Promise<void> {
    return new Promise((resolve) => {
      const outerTimer = setInterval(() => {
        const startButton = document.querySelector(".MuiButton-root");
        if (startButton) {
          console.log("准备执行startButton", startButton);
          (startButton as HTMLElement).click();
          clearInterval(outerTimer);
          this.findvideoinit()
            .then(resolve)
            .catch((e) => {
              Application.App.log.Error(e.message);
              clearInterval(outerTimer);
            });
        }
      }, 500);
    }).then(() => {
      Application.App.log.Debug("视频任务初始化完成");
    //   clearInterval(outerTimer);
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

        const video = deepFindVideo(document);
        if (video) {
          clearInterval(videoTimer);
          console.info("[视频查找] 视频元素查找成功", video);
          this.video = video;
          this.initPlayer();
          this.createControlBar();
          video.addEventListener("ended", () => this.callEvent("complete"));
          resolve();
        } else {
          console.debug(`[视频查找] 第 ${attemptCount} 次尝试未找到视频`);
        }
      }, 1000);
    });
  }
  protected initPlayer() {
    Application.App.log.Debug("播放器初始化配置", {
      mute: Application.App.config.video_mute,
      multiple: Application.App.config.video_multiple,
    });
    this.video.muted = Application.App.config.video_mute;
    this.video.playbackRate = Application.App.config.video_multiple;
    Application.App.config.auto && this.video.play();
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
    const container = document.querySelector("watermarkFrame") || document.body;
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
  }

  public Start(): Promise<void> {
    Application.App.log.Debug("自动播放检查", {
      autoConfig: Application.App.config.auto,
      videoPaused: this.video.paused,
    });
    return new Promise((resolve) => {
      this.timer = setInterval(() => {
        // 在Start方法中添加
        this.video.addEventListener("play", () => {
          Application.App.log.Debug("播放状态变更", {
            action: "play",
            currentTime: this.video.currentTime,
            duration: this.video.duration,
          });
        });

        this.video.addEventListener("pause", () => {
          Application.App.log.Debug("播放状态变更", {
            action: "pause",
            currentTime: this.video.currentTime,
            paused: this.video.paused,
          });
        });
        Application.App.config.auto && this.video.paused && this.video.play();
      }, 5000);
      resolve();
    });
  }

  public Type(): TaskType {
    return "video";
  }

  public Done(): boolean {
    // 在ended事件处理中添加
    this.video.addEventListener("ended", () => {
      Application.App.log.Debug("视频章节完成");
    });
    return this.video.ended;
  }
}
