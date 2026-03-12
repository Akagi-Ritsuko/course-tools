# 学习地图任务完成后返回学习地图页面技术方案

## Why

当前学习地图模块在课程完成后无法自动返回学习地图页面继续下一个关卡任务，导致自动刷课流程中断。原因是课程页面完成时没有正确通知学习地图页面。

## What Changes

- 在课程模块 `ZsglCourse` 中添加课程完成时的 localStorage 状态更新逻辑
- 确保学习地图页面能正确接收到课程完成通知

## Impact

- Affected code:
  - `src/mooc/zsgl/course.ts` - 课程模块，添加完成通知逻辑
  - `src/mooc/zsgl/studyMap.ts` - 学习地图模块，已有监听逻辑

## 任务层级结构分析

### 三层架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        学习地图 (studyMap.ts)                     │
│  - 显示多个关卡任务                                                │
│  - 点击关卡任务后打开课程页面                                        │
│  - 监听 localStorage 的 storage 事件                              │
└───────────────────────────────┬─────────────────────────────────┘
                                │ 点击关卡任务
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      课程页面 (course.ts)                         │
│  - 一个关卡任务对应一个课程                                         │
│  - 一个课程包含多个子任务 (video, scorm, url 等)                    │
│  - 所有子任务完成时触发 courseTaskComplete 事件                     │
└───────────────────────────────┬─────────────────────────────────┘
                                │ 包含多个子任务
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    任务 (video.ts / scorm.ts)                     │
│  - 具体的任务类型：视频、SCORM课件等                                 │
│  - 完成时触发 taskComplete 事件                                    │
└─────────────────────────────────────────────────────────────────┘
```

### 事件流转

```
任务完成
    │
    │ 触发 taskComplete 事件
    ▼
课程监听 taskComplete 事件
    │
    │ 所有任务完成
    ▼
课程触发 courseTaskComplete 事件
    │
    │ ❌ 缺失：更新 localStorage
    ▼
学习地图监听 storage 事件
    │
    │ 收到通知
    ▼
学习地图刷新页面 → 开始下一个关卡任务
```

### 当前代码分析

#### 学习地图页面 (studyMap.ts)

```typescript
// 第249-258行：点击任务时设置 localStorage
const taskKey = `${ZSGL_CONSTANTS.STORAGE_PREFIX}${this.gateTaskData.resourceId}`;
const taskStatus: TaskStatus = {
    status: "started",
    expire: Date.now() + ZSGL_CONSTANTS.TASK_EXPIRE_MS,
};
localStorage.setItem(taskKey, JSON.stringify(taskStatus));

// 第256-257行：监听 storage 事件
const handler = createStorageHandler(taskKey);
window.addEventListener("storage", handler);
```

```typescript
// utils.ts 第93-105行：storage 事件处理器
export function createStorageHandler(key: string): StorageHandler {
    const handler = function (event: StorageEvent) {
        if (event.key === key) {
            const taskStatus = JSON.parse(event.newValue || "{}");
            if (taskStatus.status === "finished") {
                window.removeEventListener('storage', handler);
                window.location.reload();  // 刷新页面
            }
        }
    } as StorageHandler;
    handler.key = key;
    return handler;
}
```

#### 课程页面 (course.ts)

```typescript
// 第142-150行：Next 方法，所有任务完成后触发 courseTaskComplete
public Next(): Promise<Task> {
    return new Promise((resolve) => {
        if (this.taskList.length > this.taskIndex) {
            resolve(this.taskList[this.taskIndex]);
            return this.taskIndex++;
        } else {
            this.callEvent("courseTaskComplete");  // ← 课程完成事件
        }
    });
}
```

```typescript
// 第226-228行：监听任务完成事件
task.addEventListener("complete", () => {
    this.callEvent("taskComplete", index, task);
});
```

### 问题根源

**课程完成时没有更新 localStorage 状态为 `finished`**，导致学习地图页面的 storage 事件监听器无法触发。

## 解决方案

### 方案：在课程完成时更新 localStorage

在 `course.ts` 中监听 `courseTaskComplete` 事件，更新 localStorage 状态为 `finished`。

### 实现步骤

#### 步骤1：课程页面需要获取正确的 taskKey

由于课程页面是新打开的页面，无法直接获取学习地图页面的 `gateTaskData.resourceId`。

**方案：遍历 localStorage 查找**

课程完成时，遍历 localStorage 查找以 `zsgl_task_` 开头的 key，找到状态为 `started` 且未过期的 key，更新为 `finished`。

#### 步骤2：修改 course.ts

在 `ZsglCourse` 类中添加课程完成通知方法：

```typescript
import { ZSGL_CONSTANTS } from "./constants";
import { TaskStatus } from "./types";

// 在构造函数或 Init 中监听 courseTaskComplete 事件
this.addEventListener("courseTaskComplete", () => {
    this.notifyStudyMapCourseComplete();
});

/** 通知学习地图课程完成 */
private notifyStudyMapCourseComplete(): void {
    const now = Date.now();
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(ZSGL_CONSTANTS.STORAGE_PREFIX)) {
            try {
                const value = JSON.parse(localStorage.getItem(key) || "{}");
                if (value.status === "started" && value.expire > now) {
                    const taskStatus: TaskStatus = {
                        status: "finished",
                        expire: value.expire,
                    };
                    localStorage.setItem(key, JSON.stringify(taskStatus));
                    Application.App.log.Info("课程完成，已更新 localStorage", key);
                    return;
                }
            } catch (e) {
                Application.App.log.Warn("解析 localStorage 失败", key);
            }
        }
    }
    Application.App.log.Warn("未找到对应的课程状态 key");
}
```

## 完整实现计划

### 修改文件清单

| 文件 | 修改内容 |
|------|----------|
| `src/mooc/zsgl/course.ts` | 添加 `notifyStudyMapCourseComplete()` 方法，监听 `courseTaskComplete` 事件 |
| `src/mooc/zsgl/studyMap.ts` | 无需修改（已有监听逻辑） |
| `src/mooc/zsgl/task.ts` | 无需修改 |
| `src/mooc/zsgl/video.ts` | 无需修改 |
| `src/mooc/zsgl/scorm.ts` | 无需修改 |

### 代码修改详情

**文件：`src/mooc/zsgl/course.ts`**

1. 添加 import：
```typescript
import { ZSGL_CONSTANTS } from "./constants";
import { TaskStatus } from "./types";
```

2. 在 `Init()` 方法中添加事件监听：
```typescript
this.addEventListener("courseTaskComplete", () => {
    this.notifyStudyMapCourseComplete();
});
```

3. 添加 `notifyStudyMapCourseComplete()` 方法：
```typescript
/** 通知学习地图课程完成 */
private notifyStudyMapCourseComplete(): void {
    const now = Date.now();
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(ZSGL_CONSTANTS.STORAGE_PREFIX)) {
            try {
                const value = JSON.parse(localStorage.getItem(key) || "{}");
                if (value.status === "started" && value.expire > now) {
                    const taskStatus: TaskStatus = {
                        status: "finished",
                        expire: value.expire,
                    };
                    localStorage.setItem(key, JSON.stringify(taskStatus));
                    Application.App.log.Info("课程完成，已更新 localStorage", key);
                    return;
                }
            } catch (e) {
                Application.App.log.Warn("解析 localStorage 失败", key);
            }
        }
    }
    Application.App.log.Warn("未找到对应的课程状态 key");
}
```

## 测试验证

### 测试流程

1. 打开学习地图页面
2. 点击"开始挂机"
3. 学习地图自动点击关卡任务，打开课程页面（新标签页）
4. 课程页面自动播放视频/SCORM
5. 所有任务完成
6. **预期**：localStorage 状态更新为 `finished`
7. **预期**：学习地图页面收到 storage 事件，刷新页面
8. **预期**：学习地图页面自动开始下一个关卡任务

### 调试日志

添加以下日志帮助调试：

```typescript
Application.App.log.Info("课程完成，已更新 localStorage", key);
Application.App.log.Warn("未找到对应的课程状态 key");
```

## 风险评估

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 多个课程同时进行 | 可能更新错误的课程状态 | 使用过期时间判断，只更新当前有效的任务 |
| storage 事件不触发 | 无法返回 | 添加日志确认事件触发 |
| 页面刷新后状态丢失 | 重复执行 | 使用 expire 字段控制有效期 |
