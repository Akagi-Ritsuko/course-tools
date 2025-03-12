import { Task, TaskType } from "@App/internal/app/task";
import { CssBtn } from "../chaoxing/utils";
import { randNumber, post, substrex, protocolPrompt, createBtn } from "@App/internal/utils/utils";
import { Application } from "@App/internal/application";

export class ZsglVideo extends Task {
    protected timer: NodeJS.Timeout;
    protected video: HTMLVideoElement;
    protected controlBar: HTMLDivElement;

    public Init(): Promise<void> {
        return new Promise((resolve) => {
            this.timer = setInterval(() => {
                let video = document.querySelector('video');
                if (video) {
                    clearInterval(this.timer);
                    this.video = video;
                    this.initPlayer();
                    this.createControlBar();
                    video.addEventListener('ended', () => this.callEvent('complete'));
                    resolve();
                }
            }, 500);
        });
    }

    // private initPlayer() {
    //     this.video.muted = Application.App.config.video_mute;
    //     this.video.playbackRate = Application.App.config.video_multiple;
    //     Application.App.config.auto && this.video.play();
    // }

    // private createControlBar() {
    //     this.controlBar = document.createElement('div');
    //     this.controlBar.className = 'zsgl-tools-bar';
        
    //     const boomBtn = CssBtn(createBtn('秒过视频', '快速完成当前视频', 'zsgl-btn'));
    //     boomBtn.onclick = () => this.handleBoomVideo();

    //     const toggleBtn = CssBtn(createBtn(
    //         Application.App.config.auto ? '暂停挂机' : '开始挂机',
    //         '',
    //         'zsgl-toggle-btn'
    //     ));
    //     toggleBtn.onclick = () => this.toggleAutoPlay(toggleBtn);

    //     this.controlBar.append(boomBtn, toggleBtn);
    //     document.querySelector('.video-container').append(this.controlBar);
    // }

    // private handleBoomVideo() {
    //     if (!protocolPrompt('秒过视频可能产生记录，是否继续?', 'zsgl_boom_prompt')) return;
    //     this.video.currentTime = this.video.duration - 1;
    //     this.video.dispatchEvent(new Event('timeupdate'));
    // }

    // private toggleAutoPlay(btn: HTMLButtonElement) {
    //     Application.App.config.auto = !Application.App.config.auto;
    //     btn.innerText = Application.App.config.auto ? '暂停挂机' : '开始挂机';
    //     Application.App.config.auto && this.video.play();
    // }

    // public Start(): Promise<void> {
    //     return new Promise((resolve) => {
    //         this.timer = setInterval(() => {
    //             Application.App.config.auto && this.video.paused && this.video.play();
    //         }, 5000);
    //         resolve();
    //     });
    // }

    // public Type(): TaskType {
    //     return 'video';
    // }

    // public Done(): boolean {
    //     return this.video.ended;
    // }

    // protected queryVideo(): HTMLVideoElement {
    //     const video = document.getElementById("video_html5_api");
    //     Application.App.log.Debug("视频元素DOM结构", {
    //         id: video?.id,
    //         paused: video?.paused,
    //         currentTime: video?.currentTime,
    //         parentNode: video?.parentNode?.nodeName
    //     });
    //     return video;
    // }

    protected initPlayer() {
        Application.App.log.Debug("播放器初始化配置", {
            mute: Application.App.config.video_mute,
            multiple: Application.App.config.video_multiple
        });
        this.video.muted = Application.App.config.video_mute;
        this.video.playbackRate = Application.App.config.video_multiple;
        Application.App.config.auto && this.video.play();
    }

    private createControlBar() {
        Application.App.log.Debug("创建控制栏组件");
        this.controlBar = document.createElement('div');
        this.controlBar.className = 'zsgl-tools-bar';
        
        const boomBtn = CssBtn(createBtn('秒过视频', '快速完成当前视频', 'zsgl-btn'));
        boomBtn.onclick = () => this.handleBoomVideo();

        const toggleBtn = CssBtn(createBtn(
            Application.App.config.auto ? '暂停挂机' : '开始挂机',
            '',
            'zsgl-toggle-btn'
        ));
        toggleBtn.onclick = () => this.toggleAutoPlay(toggleBtn);

        this.controlBar.append(boomBtn, toggleBtn);
        document.querySelector('.video-container').append(this.controlBar);
        Application.App.log.Debug("控制栏挂载完成", {
            buttons: this.controlBar.children.length
        });
    }

    private handleBoomVideo() {
        if (!protocolPrompt('秒过视频可能产生记录，是否继续?', 'zsgl_boom_prompt')) return;
        this.video.currentTime = this.video.duration - 1;
        this.video.dispatchEvent(new Event('timeupdate'));
        Application.App.log.Debug("触发秒过操作", {
            currentTime: this.video.currentTime,
            duration: this.video.duration
        });
    }

    private toggleAutoPlay(btn: HTMLButtonElement) {
        Application.App.config.auto = !Application.App.config.auto;
        btn.innerText = Application.App.config.auto ? '暂停挂机' : '开始挂机';
        Application.App.log.Debug("切换自动播放状态", {
            newState: Application.App.config.auto
        });
        Application.App.config.auto && this.video.play();
    }

    public Start(): Promise<void> {
        Application.App.log.Debug("自动播放检查", {
            autoConfig: Application.App.config.auto,
            videoPaused: this.video.paused
        });
        return new Promise((resolve) => {
            this.timer = setInterval(() => {
                           // 在Start方法中添加
    this.video.addEventListener('play', () => {
        Application.App.log.Debug("播放状态变更", {
            action: 'play',
            currentTime: this.video.currentTime,
            duration: this.video.duration
        });
    });

    this.video.addEventListener('pause', () => {
        Application.App.log.Debug("播放状态变更", {
            action: 'pause', 
            currentTime: this.video.currentTime,
            paused: this.video.paused
        });
    });
                Application.App.config.auto && this.video.paused && this.video.play();
            }, 5000);
            resolve();
        });
    }

    public Type(): TaskType {
        return 'video';
    }

    public Done(): boolean {
            // 在ended事件处理中添加
    this.video.addEventListener("ended", () => {
        Application.App.log.Debug("视频章节完成");
    });
        return this.video.ended;
    }

 


}