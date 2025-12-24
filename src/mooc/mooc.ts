import {Launcher, Application} from "@App/internal/application";
import {Mooc, MoocFactory, MoocTaskSet} from "@App/internal/app/mooc";
import {Task} from "@App/internal/app/task";

export class mooc implements Launcher {
    protected moocFactory: MoocFactory;

    constructor(moocFactory: MoocFactory) {
        this.moocFactory = moocFactory;
    }

    public async start() {
        try {
            let state = document.readyState;
            Application.App.log.Debug("Start document state:", state);
            let mooc = this.moocFactory.CreateMooc();
            console.log("mooc start", mooc);
            if (mooc != null) {
                await mooc.Init();
                console.log("mooc初始化完成", mooc);
                console.log((<MoocTaskSet>mooc).Next, "mooc.Next")
                // MoocTaskSet接口判断,接管流程
                if ((<MoocTaskSet>mooc).Next != undefined) {
                    this.runMoocTask(<MoocTaskSet>mooc);
                }
            }
        } catch (e) {
            Application.App.log.Fatal("扩展发生了一个致命错误:", e);
        }
        //最小化警告
        if (top == self) {
            let isShow = false;
            document.addEventListener("visibilitychange", () => {
                if (document.hidden) {
                    if (isShow) {
                        return;
                    }
                    Application.App.log.Warn("请注意!最小化可能导致视频无法正常播放!允许切换窗口.");
                    isShow = true;
                }
            })
        }
    }

    protected timer: NodeJS.Timeout;

    protected runMoocTask(moocTask: MoocTaskSet) {
        Application.App.log.Debug("runMoocTask 开始执行任务:");
        moocTask.addEventListener("reload", () => {
            Application.App.log.Warn("runMoocTask reload",Application.App.config.auto,moocTask);
            if (Application.App.config.auto) {
                this.runTask(moocTask);
            }

            clearTimeout(this.timer);
        });
        moocTask.addEventListener("examReload", () => {
            Application.App.log.Warn("runMoocTask examReload",Application.App.config.auto,moocTask);
                this.runTask(moocTask);

            clearTimeout(this.timer);
        });
        moocTask.addEventListener("complete", () => {
            Application.App.log.Warn("当前视频任务完成了");
            // window.close(); 
            // alert("任务完成了");
        });
        moocTask.addEventListener("courseDetailTaskComplete", (task: Task) => {
            window.location.reload();
        })
        moocTask.addEventListener("courseTaskComplete", () => {
            Application.App.log.Debug("courseTaskComplete 当前课程任务完成了");
            window.close();
        })
        moocTask.addEventListener("taskComplete", (index: number, task: Task) => {
            moocTask.SetTaskPointer(index + 1);
            if (!Application.App.config.auto) {
                return;
            }
            let interval = Application.App.config.interval;
            Application.App.log.Info(interval + "分钟后自动切换下一个任务点");
            this.timer = setTimeout(async () => {
                await task.Submit();
                await this.runTask(moocTask);
            }, 0);
        });
        moocTask.addEventListener(
          "questionTaskComplete",
            (index: number, task: Task) => {
              console.log("questionTaskComplete", index, task);
            moocTask.SetTaskPointer(index + 1);
            this.timer = setTimeout(async () => {
              await task.Submit();
              await this.runTask(moocTask);
            }, 0);
          }
        );
        moocTask.addEventListener("examTaskComplete", () => {
          Application.App.log.Debug("examTaskComplete 当前考试任务完成了");
          window.close();
        });
        moocTask.addEventListener("error", (msg: string) => {
            Application.App.log.Fatal(msg);
            alert(msg);
        });
    }

    // 防止taskComplete和reload冲突
    protected once: boolean = false;
    protected nowTask: Task;

    protected async runTask(moocTask: MoocTaskSet) {
        Application.App.log.Debug("runTask 开始执行任务:",this.once);
        if (this.once) {
            return;
        }
        this.once = true;
        Application.App.log.Debug("runTask 开始执行任务:");
        let task = await moocTask.Next();
        while (task != null) {
            if (task.Done()) {
                task = await moocTask.Next();
                continue;
            }
            // if (Application.App.config.answer_ignore && task.Type() == "topic") {
            //     task = await moocTask.Next();
            //     continue;
            // }
            //开始任务
            if (Application.App.config.auto&&task.Type() !== "exam") {
                await task.Start();
            }
            if (task.Type() == "exam") {
                await task.Start();
            }
            this.nowTask = task;
            break;
        }
        this.once = false
    }
}