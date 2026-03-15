import {Launcher, Application} from "@App/internal/application";
import {Mooc, MoocFactory, MoocTaskSet} from "@App/internal/app/mooc";
import {Task} from "@App/internal/app/task";
import {DailyPointsFloatingPanel} from "@App/internal/utils/dailyPointsPanel";

export class MoocLauncher implements Launcher {
    protected moocFactory: MoocFactory;
    protected dailyPointsPanel: DailyPointsFloatingPanel;

    constructor(moocFactory: MoocFactory) {
        this.moocFactory = moocFactory;
        this.dailyPointsPanel = new DailyPointsFloatingPanel();
    }

    public async start() {
        try {
            let state = document.readyState;
            Application.App.log.Debug("Start document state:", state);
            let moocInstance = this.moocFactory.CreateMooc();

            (window as any).__moocInstance__ = moocInstance;
            (window as any).__moocInstances__ =
              (window as any).__moocInstances__ || [];
            if (moocInstance) {
              (window as any).__moocInstances__.push({
                instance: moocInstance,
                type: moocInstance.constructor?.name,
                createdAt: new Date().toISOString(),
                url: window.location.href,
              });
            }

            console.log("mooc start", moocInstance);
            if (moocInstance != null) {
                await moocInstance.Init();
                console.log("mooc初始化完成", moocInstance);
                console.log((<MoocTaskSet>moocInstance).Next, "mooc.Next");
                if ((<MoocTaskSet>moocInstance).Next != undefined) {
                    this.runMoocTask(<MoocTaskSet>moocInstance);
                }
            }
        } catch (e) {
            Application.App.log.Fatal("扩展发生了一个致命错误:", e);
        }
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
        });
        moocTask.addEventListener("courseDetailTaskComplete", (task: Task) => {
            window.location.reload();
        })
        moocTask.addEventListener("courseTaskComplete", () => {
            Application.App.log.Debug("courseTaskComplete 当前课程任务完成了");
        })
        moocTask.addEventListener("taskComplete", (index: number, task: Task) => {
            Application.App.log.Debug("taskComplete事件触发");
            moocTask.SetTaskPointer(index + 1);
            if (!Application.App.config.auto) {
                return;
            }
            let interval = Application.App.config.interval;
            Application.App.log.Info(interval + "分钟后自动切换下一个任务点");

            this.timer = setTimeout(async () => {
                await task.Submit();
                await this.runTask(moocTask);
            }, interval * 60 * 1000);
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
