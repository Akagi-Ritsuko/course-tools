import { Task, TaskType } from "@App/internal/app/task";
import { Application } from "@App/internal/application";
import { hookHttpRequest } from "./utils/utils";

export class ZsglCourse extends Task {
    protected gateTaskData: any;
    public Init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.hookStudymapGateTaskRequests();
            resolve();
        });
    }
    protected hookStudymapGateTaskRequests() {
        hookHttpRequest('queryStudymapGateTask.do', (response, self) => {
            Application.App.log.Debug("原始响应数据", response);
            self.gateTaskData = response?.body;

            Application.App.log.Debug("成功拦截课程任务数据", {
                taskCount: self.gateTaskData?.taskList?.length || 0
            });
        }, this);
    }
    public Done(): boolean {
        throw new Error("Method not implemented.");
    }
    public Start(): Promise<any> {
        throw new Error("Method not implemented.");
    }
    public Type(): TaskType {
        throw new Error("Method not implemented.");
    }
}