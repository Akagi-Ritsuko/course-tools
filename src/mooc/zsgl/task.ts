import { Task } from "@App/internal/app/task";
import { CssBtn } from "./utils/utils";
import { Application } from "@App/internal/application";
import { createBtn } from "@App/internal/utils/utils";

export class ZsglTaskControlBar {
    public task: Task;
    protected prev: HTMLElement;

    constructor(prev: HTMLElement, task: Task) {
        this.task = task;
        this.prev = document.createElement("div");
        prev.style.textAlign = "center";
        prev.style.width = "100%";
        prev.prepend(this.prev);
        this.defaultBtn();
    }

    public defaultBtn() {
        let startBtn = CssBtn(createBtn(Application.App.config.auto ? "暂停挂机" : "开始挂机", "点击开始自动挂机", "zsgl-auto-btn"));
        startBtn.onclick = () => {
            if (startBtn.innerText == '暂停挂机') {
                Application.App.config.auto = false;
                startBtn.innerText = "开始挂机";
                startBtn.title = "点击开始自动挂机";
                Application.App.log.Info("挂机停止了");
            } else {
                Application.App.config.auto = true;
                startBtn.innerText = '暂停挂机';
                startBtn.title = "停止挂机,开始好好学习";
                Application.App.log.Info("挂机开始了");
                this.task.Start();
            }
        };
        this.prev.append(startBtn);
    }

    public append(el: HTMLElement): void {
        this.prev.append(el);
    }
}