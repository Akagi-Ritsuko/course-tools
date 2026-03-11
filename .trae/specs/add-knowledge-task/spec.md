# Knowledge 任务类型实现 Spec

## Why

当前 `factory.ts` 中 `knowledge` 类型任务未实现，导致课程中的知识点学习任务无法自动完成。需要创建 `knowledge.ts` 模块来支持这类任务。

## What Changes

- 新建 `src/mooc/zsgl/knowledge.ts` - Knowledge 任务处理模块
- 修改 `src/mooc/zsgl/types.ts` - 添加 `playTime` 和 `learnedDuration` 属性
- 修改 `src/mooc/zsgl/factory.ts` - 注册 `knowledge` 类型任务

## Impact

- Affected code:
  - `src/mooc/zsgl/knowledge.ts` - 新建文件
  - `src/mooc/zsgl/types.ts` - 类型定义
  - `src/mooc/zsgl/factory.ts` - 任务工厂

## 任务流程分析

### Knowledge 任务特点

Knowledge 任务是一个知识点学习任务，需要满足一定的学习时长才能完成：

```
playTime: 300        → 需要学习 5 分钟（单位：秒）
learnedDuration: 575774 → 已学习 9 分 36 秒（单位：毫秒）
```

### 时长计算

```typescript
// playTime: 秒
// learnedDuration: 毫秒
剩余学习时长 = playTime * 1000 - learnedDuration

// 示例：
// playTime = 300 秒 = 300000 毫秒
// learnedDuration = 575774 毫秒
// 剩余时长 = 300000 - 575774 = -275774 毫秒（负数表示已超时，可直接退出）
```

### 页面元素

1. **开始按钮**：`button.MuiButton-root` 包含文本 "立即学习"
2. **知识页面**：`iframe` 加载知识内容
3. **退出按钮**：`span.exit` 包含文本 "退出学习"

### 执行流程

```
1. 点击任务元素（任务名称）
       ↓
2. 点击 "立即学习" 按钮
       ↓
3. 等待 iframe 加载完成
       ↓
4. 计算剩余学习时长
   remainingTime = playTime * 1000 - learnedDuration
       ↓
5. 如果 remainingTime <= 0，直接点击退出
   如果 remainingTime > 0，等待 remainingTime 毫秒后点击退出
       ↓
6. 点击 "退出学习" 按钮
       ↓
7. 触发 taskComplete 事件
```

## 实现方案

### 1. 修改 types.ts

添加 `playTime` 和 `learnedDuration` 属性：

```typescript
export interface TaskInfo {
    fileName: string;
    cwType: CourseWorkType;
    hasLearned: string;
    jobIndex: number;
    courseId?: string;
    property?: TaskProperty;
    playTime?: number;        // 需要学习的时长（秒）
    learnedDuration?: number; // 已学习的时长（毫秒）
}
```

### 2. 创建 knowledge.ts

参考 `scorm.ts` 的实现模式：

```typescript
export class ZsglKnowledge extends ZsglTask {
    /** 任务元素 */
    protected taskDiv: HTMLSpanElement;
    /** 开始按钮 */
    protected startButton: HTMLButtonElement;
    /** 退出按钮 */
    protected exitBtn: HTMLSpanElement;
    /** iframe 元素 */
    protected iframe: HTMLIFrameElement;
    /** 定时器管理器 */
    private timerManager: TimerManager = new TimerManager();
    
    // 核心方法
    public Init(): Promise<void>
    public Start(): Promise<any>
    public Type(): TaskType
    public Stop(): Promise<void>
    
    // 辅助方法
    private waitForStartButton(): Promise<void>
    private waitForIframeLoad(): Promise<void>
    private calculateRemainingTime(): number  // 计算剩余学习时长
    private waitAndExit(): Promise<void>      // 等待后退出
}
```

### 3. 核心逻辑

```typescript
/** 计算剩余学习时长（毫秒） */
private calculateRemainingTime(): number {
    const playTime = (this.taskinfo.playTime || 0) * 1000;  // 秒转毫秒
    const learnedDuration = this.taskinfo.learnedDuration || 0;  // 毫秒
    return playTime - learnedDuration;
}

/** 等待后退出 */
private async waitAndExit(): Promise<void> {
    const remainingTime = this.calculateRemainingTime();
    
    if (remainingTime <= 0) {
        Application.App.log.Info("学习时长已满足，直接退出");
        this.exitBtn?.click();
        this.callEvent("taskComplete");
        return;
    }
    
    Application.App.log.Info(`等待学习时长: ${remainingTime / 1000} 秒`);
    
    await new Promise<void>(resolve => {
        this.timerManager.setTimeout("waitDuration", () => {
            Application.App.log.Info("学习时长已满足，退出");
            this.exitBtn?.click();
            this.callEvent("taskComplete");
            resolve();
        }, remainingTime);
    });
}
```

### 4. 修改 factory.ts

```typescript
case "knowledge":
    return new ZsglKnowledge(document, taskinfo);
```

## 完整实现代码

### knowledge.ts

```typescript
/*
 * @Author: guotao
 * @Date: 2026-03-10
 * @Description: zsgl Knowledge 知识点任务模块
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */
import { Task, TaskType } from "@App/internal/app/task";
import { ZsglTask } from "./task";
import { Application } from "@App/internal/application";
import { TimerManager, findElementByText } from "./utils/utils";
import { TaskInfo } from "./types";
import { ZSGL_CONSTANTS } from "./constants";

/**
 * ZsglKnowledge 知识点任务类
 */
export class ZsglKnowledge extends ZsglTask {
    /** 任务元素 */
    protected taskDiv: HTMLSpanElement;
    /** 退出按钮 */
    protected exitBtn: HTMLSpanElement;
    /** iframe 元素 */
    protected iframe: HTMLIFrameElement;
    /** 定时器管理器 */
    private timerManager: TimerManager = new TimerManager();

    public Init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const taskDiv = findElementByText("span", this.taskinfo.fileName);

            Application.App.log.Debug("寻找 taskDiv", this.taskinfo.fileName);
            if (taskDiv) {
                this.taskDiv = taskDiv;
                Application.App.log.Debug("开始初始化 knowledge 任务", taskDiv);
                resolve();
            } else {
                Application.App.log.Error("未找到任务元素");
                reject(new Error(ZSGL_CONSTANTS.ERROR_MESSAGES.TASK_NOT_FOUND));
            }
        });
    }

    public async Start(): Promise<any> {
        await new Promise<void>(async (resolve, reject) => {
            Application.App.log.Debug("开始点击任务按钮", this.taskDiv);
            this.taskDiv.click();

            // 等待并点击开始按钮
            await this.waitForStartButton();

            // 等待 iframe 加载
            await this.waitForIframeLoad();

            // 等待学习时长后退出
            await this.waitAndExit();

            resolve();
        });
    }

    public Type(): TaskType {
        return "knowledge";
    }

    public Stop(): Promise<void> {
        this.timerManager.clearAll();
        return Promise.resolve();
    }

    /** 等待并点击开始按钮 */
    private waitForStartButton(): Promise<void> {
        return new Promise((resolve, reject) => {
            let attemptCount = 0;

            this.timerManager.setInterval("findStartBtn", () => {
                attemptCount++;
                Application.App.log.Debug(`[开始按钮查找] 第 ${attemptCount} 次尝试`);

                if (attemptCount > ZSGL_CONSTANTS.MAX_ATTEMPT_COUNT) {
                    this.timerManager.clearInterval("findStartBtn");
                    reject(new Error("未找到开始按钮"));
                    return;
                }

                const startButton = Array.from(
                    document.querySelectorAll("button.MuiButton-root")
                ).find(btn => btn.textContent?.includes("立即学习")) as HTMLButtonElement;

                if (startButton) {
                    this.timerManager.clearInterval("findStartBtn");
                    Application.App.log.Info("[开始按钮查找] 找到开始按钮，点击");
                    startButton.click();
                    resolve();
                }
            }, ZSGL_CONSTANTS.CHECK_INTERVAL_MS);
        });
    }

    /** 等待 iframe 加载 */
    private waitForIframeLoad(): Promise<void> {
        return new Promise((resolve, reject) => {
            let attemptCount = 0;

            this.timerManager.setInterval("findIframe", () => {
                attemptCount++;
                Application.App.log.Debug(`[iframe 查找] 第 ${attemptCount} 次尝试`);

                if (attemptCount > ZSGL_CONSTANTS.MAX_ATTEMPT_COUNT) {
                    this.timerManager.clearInterval("findIframe");
                    reject(new Error("未找到 iframe"));
                    return;
                }

                const iframe = document.querySelector("iframe") as HTMLIFrameElement;
                if (iframe && iframe.src) {
                    this.timerManager.clearInterval("findIframe");
                    this.iframe = iframe;
                    
                    // 查找退出按钮
                    this.exitBtn = document.querySelector(ZSGL_CONSTANTS.SELECTORS.EXIT_SPAN);
                    
                    Application.App.log.Info("[iframe 查找] iframe 加载完成");
                    resolve();
                }
            }, ZSGL_CONSTANTS.CHECK_INTERVAL_MS);
        });
    }

    /** 计算剩余学习时长（毫秒） */
    private calculateRemainingTime(): number {
        const playTime = (this.taskinfo.playTime || 0) * 1000;  // 秒转毫秒
        const learnedDuration = this.taskinfo.learnedDuration || 0;  // 毫秒
        return playTime - learnedDuration;
    }

    /** 等待后退出 */
    private async waitAndExit(): Promise<void> {
        const remainingTime = this.calculateRemainingTime();

        Application.App.log.Info("学习时长信息", {
            playTime: this.taskinfo.playTime,
            learnedDuration: this.taskinfo.learnedDuration,
            remainingTime: remainingTime / 1000 + "秒"
        });

        if (remainingTime <= 0) {
            Application.App.log.Info("学习时长已满足，直接退出");
            this.exitBtn?.click();
            this.callEvent("taskComplete");
            return;
        }

        Application.App.log.Info(`等待学习时长: ${remainingTime / 1000} 秒`);

        await new Promise<void>(resolve => {
            this.timerManager.setTimeout("waitDuration", () => {
                Application.App.log.Info("学习时长已满足，退出");
                this.exitBtn?.click();
                this.callEvent("taskComplete");
                resolve();
            }, remainingTime);
        });
    }
}
```

## 风险评估

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| iframe 跨域限制 | 无法访问 iframe 内容 | 只等待 iframe 加载，不访问内部 |
| 退出按钮未出现 | 任务无法完成 | 添加超时处理 |
| playTime/learnedDuration 为空 | 计算错误 | 使用默认值 0 |
