# 每日积分系统技术文档

## 目录

1. [Bug修复记录](#bug修复记录)
2. [每日积分系统技术说明](#每日积分系统技术说明)

---

## Bug修复记录

### 1. 问题现象

#### 1.1 问题描述
点击popup页面"每日积分"标签页的"开始"按钮后，悬浮窗没有显示在目标页面上。

#### 1.2 复现步骤
1. 打开浏览器扩展popup页面
2. 切换到"每日积分"标签页
3. 点击"开始"按钮
4. 观察页面跳转后悬浮窗未显示

#### 1.3 错误日志
```
[每日积分] popup: 点击开始按钮 {...}
[每日积分] popup: 目标URL https://zsgl.lzlj.com/...
[每日积分] popup: 创建新标签页 {id: 123}
[每日积分] popup: 新标签页加载完成
[每日积分] popup: 发送消息到新标签页 123
Error: Could not establish connection. Receiving end does not exist.
```

### 2. 问题根源分析

#### 2.1 架构分析

项目采用三层架构进行消息传递：

```
┌─────────────────┐     chrome.tabs.sendMessage     ┌─────────────────┐
│   popup.ts      │ ──────────────────────────────► │   start.ts      │
│  (扩展弹出页)    │                                  │ (Content Script)│
└─────────────────┘                                  └────────┬────────┘
                                                              │
                                                              │ window.postMessage
                                                              ▼
                                                     ┌─────────────────┐
                                                     │ dailyPointsPanel│
                                                     │   (页面脚本)     │
                                                     └─────────────────┘
```

#### 2.2 关键代码分析

**问题代码1：消息发送时机错误**

```typescript
// popup.ts - 原始代码
chrome.tabs.create({ url: targetUrl }, (newTab) => {
  chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
    if (tabId === newTab.id && info.status === "complete") {
      setTimeout(() => {
        chrome.tabs.sendMessage(newTab.id!, {...}); // 此时 mooc.js 可能尚未注入
      }, 1000);
    }
  });
});
```

**问题分析：**
- `info.status === "complete"` 表示DOM加载完成
- 但 `mooc.js` 是通过 `background.ts` 动态注入的
- 注入流程：`start.ts` 发送 `{ status: "loading" }` → `background.ts` 注入脚本
- 注入过程需要额外时间，1秒延迟不足以保证注入完成

**问题代码2：消息监听器未初始化**

```typescript
// dailyPointsPanel.ts - 原始代码
constructor() {
  this.init();
}

private init() {
  window.addEventListener("load", () => {
    this.listenForMessages(); // 在 window.onload 后才注册监听器
  });
}
```

**问题分析：**
- 消息监听器在 `window.onload` 事件后才注册
- 如果消息在 `onload` 之前发送，监听器尚未就绪

### 3. 修复方案

#### 3.1 添加重试机制

```typescript
// popup.ts - 修复后代码
const sendMessageWithRetry = (
  tabId: number,
  message: any,
  retries: number = 5,
  delay: number = 2000,
) => {
  chrome.tabs.sendMessage(tabId, message, (response) => {
    if (chrome.runtime.lastError) {
      if (retries > 0) {
        setTimeout(() => {
          sendMessageWithRetry(tabId, message, retries - 1, delay);
        }, delay);
      }
    }
  });
};
```

#### 3.2 修改为当前标签页跳转

```typescript
// popup.ts - 修复后代码
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTab = tabs[0];
  
  chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
    if (tabId === currentTab.id && info.status === "complete") {
      chrome.tabs.onUpdated.removeListener(listener);
      setTimeout(() => {
        sendMessageWithRetry(currentTab.id!, {
          type: "START_DAILY_POINTS",
          data: config,
        });
      }, 2000);
    }
  });

  chrome.tabs.update(currentTab.id, { url: targetUrl });
});
```

#### 3.3 完善消息转发链路

```typescript
// start.ts - 添加消息转发
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "START_DAILY_POINTS") {
    window.postMessage({ type: "START_DAILY_POINTS", data: request.data }, '*');
    sendResponse({ success: true });
  }
  return true;
});
```

```typescript
// dailyPointsPanel.ts - 改用 window.postMessage
private listenForMessages() {
  window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    const message = event.data;
    if (message.type === "START_DAILY_POINTS") {
      this.start(message.data);
    }
  });
}
```

### 4. 验证方法

#### 4.1 测试步骤
1. 重新加载扩展
2. 打开任意网页
3. 点击扩展popup页面的"每日积分"标签页
4. 点击"开始"按钮
5. 观察控制台日志输出

#### 4.2 预期日志输出
```
[每日积分] popup: 点击开始按钮 {...}
[每日积分] popup: 当前标签页 {...}
[每日积分] popup: 开始跳转到目标页面
[每日积分] popup: 标签页跳转完成
[每日积分] popup: 尝试发送消息 (剩余重试次数: 5)
[每日积分] start: 收到消息 {type: "START_DAILY_POINTS", ...}
[每日积分] start: 转发START_DAILY_POINTS消息到页面
[每日积分] panel: 收到页面消息 {type: "START_DAILY_POINTS", ...}
[每日积分] panel: 处理START_DAILY_POINTS
[每日积分] panel: start方法被调用
[每日积分] panel: 创建悬浮窗
```

### 5. 预防措施

#### 5.1 消息传递最佳实践
- 使用重试机制处理异步注入场景
- 添加详细的日志输出便于调试
- 在消息处理完成后返回响应确认

#### 5.2 代码规范
- 所有消息类型使用常量定义
- 消息处理函数添加类型检查
- 避免在 `window.onload` 之后注册监听器

### 6. Bug修复记录（2026-03-12）

#### 6.1 消息监听器未初始化

**问题描述：**
`setupMessageListener()` 方法定义了但从未被调用，导致 `REFRESH_POINTS` 消息无法被接收。

**修复方案：**
在 `Init()` 方法中调用 `setupMessageListener()`：

```typescript
public Init(): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    try {
      this.loadPointsState();
      this.setupMessageListener();  // 添加此行
      Application.App.log.Info("每日积分模式初始化完成", this.pointsState);
      resolve();
    } catch (error) {
      Application.App.log.Error("每日积分模式初始化失败", error);
      reject(error);
    }
  });
}
```

#### 6.2 知识页面链接未传递导致任务执行错误

**问题描述：**
点击开始后，`getNextTask()` 返回 `course` 而不是 `knowledgeRead` 或 `knowledgeShare`，导致知识阅读和知识分享任务未执行。

**问题原因：**
`CONFIRM_START_TASK` 消息中包含 `data.knowledgeLink`，但 `executeTaskAfterConfirm()` 没有使用这个数据设置 `this.knowledgePageUrl`。`getNextTask()` 检查 `this.knowledgePageUrl`，如果为空则跳过知识任务。

**修复方案：**
在消息监听器中提取并设置 `knowledgePageUrl`：

```typescript
protected setupMessageListener(): void {
  window.addEventListener("message", (event) => {
    if (event.source !== window) return;

    const message = event.data;

    if (message.type === "STOP_DAILY_POINTS") {
      this.stopTask();
    } else if (message.type === "REFRESH_POINTS") {
      this.handleRefreshPoints();
    } else if (message.type === "CONFIRM_START_TASK") {
      if (message.data?.knowledgeLink) {
        this.knowledgePageUrl = message.data.knowledgeLink;
      }
      this.executeTaskAfterConfirm();
    }
  });
}
```

#### 6.3 刷新按钮无法获取积分详情

**问题描述：**
点击刷新按钮时，`handleRefreshPoints()` 检查 `this.sid`，但 `this.sid` 为空，导致无法调用API。

**问题原因：**
`this.sid` 只在 `executeTaskAfterConfirm()` 中通过 `extractSidFromStorage()` 设置，刷新时未调用。

**修复方案：**
在 `handleRefreshPoints()` 中添加 sid 提取逻辑：

```typescript
protected async handleRefreshPoints(): Promise<void> {
  Application.App.log.Info("手动刷新积分进度");
  Application.App.log.Debug("手动刷新积分进度");

  if (!this.sid) {
    this.extractSidFromStorage();
  }

  if (this.sid) {
    const result = await this.fetchPointsDetail();
    if (result.success) {
      this.updatePointsStateFromApi(result.data);
      window.postMessage({
        type: "POINTS_UPDATED",
        data: {
          learning: this.pointsState.learning,
          contribution: this.pointsState.contribution,
          interaction: this.pointsState.interaction,
        },
      }, "*");
    }
  } else {
    Application.App.log.Warn("无法获取sid，无法刷新积分");
  }
}
```

#### 6.4 悬浮窗打开时积分显示为0

**问题描述：**
悬浮窗创建后，积分进度显示为0，但刷新按钮可以正常刷新。

**问题原因：**
`executeTaskAfterConfirm()` 中获取积分后没有发送 `POINTS_UPDATED` 消息给 panel 更新显示。

**修复方案：**
在 `executeTaskAfterConfirm()` 中添加消息发送：

```typescript
this.updatePointsStateFromApi(pointsResult.data);

window.postMessage({
  type: "POINTS_UPDATED",
  data: {
    learning: this.pointsState.learning,
    contribution: this.pointsState.contribution,
    interaction: this.pointsState.interaction,
  },
}, "*");
```

---

## 每日积分系统技术说明

### 1. 系统架构

#### 1.1 整体架构图

```
┌────────────────────────────────────────────────────────────────────┐
│                          用户界面层                                  │
├────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │
│  │   popup.html    │  │ DailyPoints     │  │ PointsProgress  │     │
│  │   (扩展弹出页)   │  │ Config.vue      │  │ Dialog.vue      │     │
│  │                 │  │ (配置组件)       │  │ (悬浮窗组件)     │     │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘     │
└───────────┼─────────────────────┼─────────────────────┼─────────────┘
            │                     │                     │
            ▼                     ▼                     ▼
┌────────────────────────────────────────────────────────────────────┐
│                          消息通信层                                  │
├────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │
│  │ chrome.tabs.    │  │ chrome.runtime. │  │ window.         │     │
│  │ sendMessage     │  │ onMessage       │  │ postMessage     │     │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘     │
└────────────────────────────────────────────────────────────────────┘
            │                     │                     │
            ▼                     ▼                     ▼
┌────────────────────────────────────────────────────────────────────┐
│                          业务逻辑层                                  │
├────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    ZsglDailyPoints                          │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │   │
│  │  │ 学习积分任务 │ │ 贡献积分任务 │ │ 互动积分任务 │            │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘            │   │
│  └─────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

#### 1.2 核心模块说明

| 模块 | 文件路径 | 职责 |
|------|----------|------|
| popup.ts | src/views/popup.ts | 扩展弹出页入口，处理用户交互 |
| DailyPointsConfig.vue | src/views/components/DailyPointsConfig.vue | 每日积分配置表单组件 |
| DailyPointsFloatingPanel | src/internal/utils/dailyPointsPanel.ts | 悬浮窗组件，显示积分进度 |
| ZsglDailyPoints | src/mooc/zsgl/dailyPoints.ts | 每日积分核心业务逻辑 |
| start.ts | src/start.ts | Content Script，消息转发 |

### 2. 积分计算规则

#### 2.1 积分类型

```typescript
export enum PointsType {
  LEARNING = "learning",     // 学习积分
  CONTRIBUTION = "contribution", // 贡献积分
  INTERACTION = "interaction",   // 互动积分
}
```

#### 2.2 积分上限配置

| 积分类型 | 默认上限 | 获取方式 |
|----------|----------|----------|
| 学习积分 | 100 | 观看课程视频 |
| 贡献积分 | 300 | 分享知识文章 |
| 互动积分 | 100 | 评论、点赞等互动 |

#### 2.3 积分状态接口

```typescript
export interface PointsStatus {
  type: PointsType;
  current: number;  // 当前积分
  limit: number;    // 每日上限
  target?: number;  // 目标积分（可选）
}

export interface DailyPointsState {
  learning: PointsStatus;
  contribution: PointsStatus;
  interaction: PointsStatus;
  lastUpdate: number;
  isRunning: boolean;
}
```

### 3. 数据流程

#### 3.1 启动流程

```
用户点击"开始"
    │
    ▼
popup.ts 获取配置参数
    │
    ▼
chrome.tabs.update 跳转目标页面
    │
    ▼
等待页面加载完成 (status === "complete")
    │
    ▼
sendMessageWithRetry 发送消息（带重试）
    │
    ▼
start.ts 接收消息，转发到页面
    │
    ▼
DailyPointsFloatingPanel 接收消息
    │
    ▼
创建悬浮窗，显示进度
```

#### 3.2 消息类型定义

```typescript
// 消息类型
type MessageType = 
  | "START_DAILY_POINTS"    // 开始任务
  | "STOP_DAILY_POINTS"     // 停止任务
  | "UPDATE_PROGRESS";      // 更新进度

// 消息数据结构
interface StartMessage {
  type: "START_DAILY_POINTS";
  data: {
    knowledgeLink: string;
    contributionLimit: number;
    interactionLimit: number;
  };
}

interface ProgressMessage {
  type: "UPDATE_PROGRESS";
  data: {
    learning?: { current: number; limit?: number };
    contribution?: { current: number; limit?: number };
    interaction?: { current: number; limit?: number };
  };
}
```

### 4. 关键接口定义

#### 4.1 DailyPointsFloatingPanel 类

```typescript
export class DailyPointsFloatingPanel {
  // 启动积分任务
  public start(data: PointsProgressData): void;
  
  // 停止积分任务
  public stop(): void;
  
  // 更新进度显示
  public updateProgress(data: ProgressData): void;
  
  // 创建悬浮窗
  private createPanel(): void;
  
  // 初始化拖拽功能
  private initDraggable(): void;
  
  // 加载/保存位置
  private loadPosition(): void;
  private savePosition(): void;
}
```

#### 4.2 ZsglDailyPoints 类

```typescript
export class ZsglDailyPoints extends Task {
  // 初始化积分状态
  private initPointsState(): DailyPointsState;
  
  // 加载/保存积分状态
  private loadPointsState(): void;
  private savePointsState(): void;
  
  // 执行积分任务
  public async Start(): Promise<void>;
  
  // 获取积分信息
  private async fetchPointsInfo(): Promise<void>;
}
```

### 5. 数据存储

#### 5.1 配置存储

使用 Chrome Storage API 存储用户配置：

```typescript
// 存储键名
const STORAGE_KEYS = {
  DAILY_POINTS_X: "daily_points_x",      // 悬浮窗X坐标
  DAILY_POINTS_Y: "daily_points_y",      // 悬浮窗Y坐标
  KNOWLEDGE_PAGE_URL: "knowledge_page_url", // 知识页面链接
  DAILY_POINTS_TARGET: "daily_points_target", // 目标积分
};
```

#### 5.2 状态持久化

```typescript
// 积分状态存储在 localStorage
interface StoredPointsState {
  learning: { current: number; limit: number };
  contribution: { current: number; limit: number };
  interaction: { current: number; limit: number };
  lastUpdate: number;
}
```

### 6. 现有功能清单

#### 6.1 用户界面功能

| 功能 | 描述 | 状态 |
|------|------|------|
| 配置表单 | 知识链接、积分上限输入 | ✅ 已完成 |
| 开始按钮 | 触发积分任务 | ✅ 已完成 |
| 悬浮窗显示 | 实时显示积分进度 | ✅ 已完成 |
| 拖拽功能 | 悬浮窗可拖动 | ✅ 已完成 |
| 位置记忆 | 记住悬浮窗位置 | ✅ 已完成 |
| 结束按钮 | 停止积分任务 | ✅ 已完成 |

#### 6.2 业务功能

| 功能 | 描述 | 状态 |
|------|------|------|
| 学习积分获取 | 自动观看课程视频 | ✅ 已完成 |
| 贡献积分获取 | 分享知识文章 | ✅ 已完成 |
| 互动积分获取 | 评论点赞等互动 | ✅ 已完成 |
| 进度实时更新 | 悬浮窗进度条更新 | ✅ 已完成 |

### 7. 扩展点及后续迭代建议

#### 7.1 扩展点

```typescript
// 1. 积分类型扩展
export enum PointsType {
  LEARNING = "learning",
  CONTRIBUTION = "contribution",
  INTERACTION = "interaction",
  // 可扩展新的积分类型
  // SIGN_IN = "signIn",
  // QUIZ = "quiz",
}

// 2. 任务类型扩展
export type PointsTaskType = 
  | "course" 
  | "knowledgeRead" 
  | "knowledgeShare";
  // 可扩展新的任务类型
  // | "signIn"
  // | "quiz"
```

#### 7.2 后续迭代建议

##### 7.2.1 功能增强
- [ ] 添加任务队列可视化
- [ ] 支持自定义积分目标
- [ ] 添加每日积分统计报表
- [ ] 支持多账号管理

##### 7.2.2 性能优化
- [ ] 减少消息传递次数
- [ ] 优化悬浮窗渲染性能
- [ ] 添加任务执行缓存

##### 7.2.3 用户体验
- [ ] 添加任务完成通知
- [ ] 支持暗色主题
- [ ] 添加快捷键支持
- [ ] 支持国际化

##### 7.2.4 代码质量
- [ ] 添加单元测试
- [ ] 完善类型定义
- [ ] 添加错误边界处理
- [ ] 代码注释完善

##### 7.2.5 待开发功能（优先级：高）

###### 1. 每日积分Tab UI优化
- [ ] 添加学习积分获取上限输入框
- [ ] 优化label和input之间的间距，加快布局

**涉及文件：**
- `src/views/components/DailyPointsConfig.vue`

**实现要点：**
```typescript
// 新增学习积分上限配置
interface DailyPointsConfig {
  knowledgeLink: string;
  learningLimit: number;      // 新增：学习积分上限
  contributionLimit: number;
  interactionLimit: number;
}
```

###### 2. 学习积分获取功能迭代
- [ ] 实现课程学习任务的自动执行
- [ ] 添加课程进度检测
- [ ] 支持多课程顺序学习

**涉及文件：**
- `src/mooc/zsgl/dailyPoints.ts` - `executeCourseTask()` 方法

**实现要点：**
```typescript
protected async executeCourseTask(): Promise<void> {
  // 1. 获取课程列表
  // 2. 筛选未完成课程
  // 3. 自动播放课程视频
  // 4. 检测学习进度
  // 5. 更新积分状态
}
```

###### 3. 积分无变化检测
- [ ] 新增校验：如果获取的积分详情与上次没有变化，自动结束每日积分任务
- [ ] 添加连续无变化次数计数
- [ ] 设置无变化阈值（如连续3次无变化则停止）

**涉及文件：**
- `src/mooc/zsgl/dailyPoints.ts`

**实现要点：**
```typescript
private noChangeCount: number = 0;
private readonly NO_CHANGE_THRESHOLD: number = 3;

protected checkPointsChanged(newData: PointsData, oldData: PointsData): boolean {
  return JSON.stringify(newData) !== JSON.stringify(oldData);
}

// 在任务执行循环中
if (!this.checkPointsChanged(newPoints, this.lastPoints)) {
  this.noChangeCount++;
  if (this.noChangeCount >= this.NO_CHANGE_THRESHOLD) {
    Application.App.log.Info("积分连续无变化，自动停止任务");
    this.stopTask();
    return;
  }
} else {
  this.noChangeCount = 0;
}
```

###### 4. 积分详情接口参数优化
- [ ] 修改获取积分详情接口的请求参数
- [ ] 时间范围从"年初到年末"改为"当天到月末"

**涉及文件：**
- `src/mooc/zsgl/dailyPoints.ts` - `fetchPointsDetail()` 方法

**实现要点：**
```typescript
protected async fetchPointsDetail(): Promise<ApiResponse<PointsData[]>> {
  const now = new Date();
  const startDate = this.formatDate(now);  // 当天
  
  // 计算月末日期
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const endDateStr = this.formatDate(endDate);  // 月末
  
  // 原代码使用年初到年末
  // const startTime = `${now.getFullYear()}-01-01`;
  // const endTime = `${now.getFullYear()}-12-31`;
  
  // 修改为当天到月末
  const startTime = startDate;
  const endTime = endDateStr;
  
  // ... 发送请求
}

private formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
```

### 8. 文件清单

```
src/
├── views/
│   ├── popup.ts                    # 扩展弹出页入口
│   ├── popup.html                  # 弹出页HTML模板
│   └── components/
│       ├── DailyPointsConfig.vue   # 每日积分配置组件
│       └── PointsProgressDialog.vue # 积分进度悬浮框组件（备用）
├── internal/
│   └── utils/
│       └── dailyPointsPanel.ts     # 悬浮窗组件
├── mooc/
│   └── zsgl/
│       └── dailyPoints.ts          # 每日积分核心逻辑
└── start.ts                        # Content Script
```

---

## 附录

### A. 相关配置文件

```javascript
// tailwind.config.js - shadcn-vue 配置
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{html,ts,vue}"],
  theme: {
    extend: {
      colors: {
        // shadcn-vue 颜色系统
        primary: { /* ... */ },
        secondary: { /* ... */ },
        // ...
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

### B. 依赖版本

| 依赖 | 版本 | 用途 |
|------|------|------|
| vue | ^3.5.13 | 前端框架 |
| radix-vue | latest | shadcn-vue 核心 |
| tailwindcss | latest | CSS 框架 |
| lucide-vue-next | latest | 图标库 |

### C. 调试技巧

1. **查看消息传递日志**
   - 打开开发者工具 (F12)
   - 查看 Console 中的 `[每日积分]` 前缀日志

2. **检查扩展状态**
   - 打开 `chrome://extensions/`
   - 点击扩展的"背景页"查看 background 日志

3. **测试消息传递**
   ```javascript
   // 在页面控制台直接测试
   window.postMessage({ type: "START_DAILY_POINTS", data: {} }, '*');
   ```

---

*文档版本: 1.1.0*
*最后更新: 2026-03-12*
*作者: AI Assistant*
