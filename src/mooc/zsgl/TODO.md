# 问题清单

## 1. 解决考试的答案问题

### 问题描述
- 考试模块需要获取并显示正确答案
- 当前答案解密和匹配逻辑需要验证

### 相关文件
- `src/mooc/zsgl/exam.ts` - 考试模块
- `src/mooc/zsgl/constants.ts` - AES解密配置

### 待办事项
- [ ] 验证AES解密配置是否正确
- [ ] 测试答案匹配逻辑
- [ ] 优化答案显示方式

---

## 2. 解决SCORM类型任务的各种子类型问题

### 问题描述
当前 `factory.ts` 中对SCORM类型的处理不够完善，需要支持更多子类型：

```typescript
case "video":
    return new ZsglVideo(document, taskinfo);
case "knowledge":
case "document":
case "audio":
case "URL":
    Application.App.log.Debug(`暂不支持的课程类型: ${taskinfo.cwType}`);
    return null;
```

### 相关文件
- `src/mooc/zsgl/factory.ts` - 任务工厂
- `src/mooc/zsgl/scorm.ts` - SCORM任务
- `src/mooc/zsgl/video.ts` - 视频任务

### 待办事项
- [x] 实现 `knowledge` 类型任务处理（课程页面部分已完成，待测试）
  - [x] 创建 knowledge.ts 模块
  - [x] 实现 playTime 和 learnedDuration 时长计算
  - [x] 实现"立即学习"按钮点击
  - [x] 实现 iframe 加载等待
  - [x] 实现剩余时长等待后退出
  - [ ] 学习地图中的 knowledge 类型支持
  - [ ] iframe 加载判断优化（跨域处理）
- [ ] 实现 `document` 类型任务处理（文档阅读）
- [ ] 实现 `audio` 类型任务处理（音频播放）
- [ ] 实现 `URL` 类型任务处理（链接访问）
- [ ] 统一各类型的基类和接口

### 类型说明
| 类型 | 说明 | 处理方式 | 状态 |
|------|------|----------|------|
| `video` | 视频任务 | 自动播放视频 | ✅ 已实现 |
| `scorm` | SCORM课件 | 自动播放课件内视频 | ✅ 已实现 |
| `knowledge` | 知识点 | 等待学习时长后退出 | 🔄 进行中 |
| `document` | 文档 | 自动标记已读 | ⏳ 待实现 |
| `audio` | 音频 | 自动播放音频 | ⏳ 待实现 |
| `URL` | 链接 | 自动访问链接 | ⏳ 待实现 |

---

## 2.1 实现 URL 类型任务处理

### 功能描述
`URL` 类型任务是课程中的外部链接资源，需要实现自动访问并标记完成。

### 实现方案
1. **自动访问**：检测到URL类型任务时，自动在新窗口打开链接
2. **标记完成**：访问后自动标记任务为已完成
3. **等待机制**：等待一定时间后自动跳转到下一个任务

### 相关代码位置
`src/mooc/zsgl/factory.ts#L44-45`:
```typescript
case "URL":
    Application.App.log.Debug(`暂不支持的课程类型: ${taskinfo.cwType}`);
    return null;
```

### 待办事项
- [ ] 创建 `ZsglUrl` 任务类（继承 `ZsglTask`）
- [ ] 实现 `Init()` 方法：获取链接地址
- [ ] 实现 `Start()` 方法：自动打开链接
- [ ] 实现 `Done()` 方法：判断是否完成
- [ ] 在 `factory.ts` 中注册新类型
- [ ] 添加配置项：是否自动打开URL链接

### 新建文件
- `src/mooc/zsgl/url.ts` - URL任务处理模块

### 代码设计
```typescript
// src/mooc/zsgl/url.ts
export class ZsglUrl extends ZsglTask {
    protected url: string;
    
    public async Start(): Promise<any> {
        // 自动打开链接
        if (this.url) {
            window.open(this.url, '_blank');
            // 等待一段时间后标记完成
            await sleep(3000);
            this.callEvent("taskComplete");
        }
    }
    
    public Type(): TaskType {
        return "url";
    }
}
```

### 配置项
```typescript
{
    title: "自动打开链接",
    description: "自动打开课程中的外部链接资源",
    type: "checkbox",
    key: "auto_open_url",
    value: true,
},
```

---

## 3. 新增每日积分模式模块

### 问题描述
需要新增一个自动刷课模式，用于自动完成当天的积分任务。

### 功能需求
1. **模式切换**：用户可以选择开启/关闭每日积分模式
2. **自动刷课**：自动播放未完成的课程视频
3. **积分统计**：显示当天已获得的积分
4. **任务队列**：自动获取当天可做的积分任务列表
5. **智能跳过**：跳过已完成或不可用的任务

### 相关文件
- `src/mooc/zsgl/platform.ts` - 平台工厂（需要添加新模式判断）
- `src/config.ts` - 配置项（需要添加新配置）
- 新建 `src/mooc/zsgl/dailyPoints.ts` - 每日积分模块

### 待办事项
- [ ] 设计每日积分模式的架构
- [ ] 实现积分任务列表获取
- [ ] 实现自动刷课逻辑
- [ ] 添加积分统计功能
- [ ] 添加UI控制面板
- [ ] 添加配置项到 `config.ts`

### 配置项设计
```typescript
{
    title: "每日积分模式",
    description: "自动刷课获取当天积分",
    type: "checkbox",
    key: "daily_points_mode",
    value: false,
},
{
    title: "目标积分",
    description: "每天目标获得的积分数",
    type: "text",
    key: "daily_points_target",
    unit: "分",
    value: "100",
},
```

---

## 4. 学习地图选修部分支持

### 问题描述
当前学习地图模块可能未正确处理选修课程部分，需要确认是否需要支持学习地图中的选修课程。

### 功能需求
1. **选修识别**：识别学习地图中的选修课程
2. **选修处理**：根据配置决定是否自动学习选修课程
3. **进度同步**：确保选修课程进度正确同步

### 相关文件
- `src/mooc/zsgl/studyMap.ts` - 学习地图模块
- `src/mooc/zsgl/platform.ts` - 平台工厂

### 待办事项
- [ ] 调研学习地图选修课程的数据结构
- [ ] 确定选修课程的判断逻辑
- [ ] 实现选修课程的过滤/包含功能
- [ ] 添加配置项：是否学习选修课程

### 配置项设计
```typescript
{
    title: "学习选修课程",
    description: "在学习地图中是否自动学习选修课程",
    type: "checkbox",
    key: "study_elective_courses",
    value: false,
},
```
---
## 5. 学习地图任务完成后未返回学习地图页面问题

### 问题描述
学习地图的任务跳转到具体任务完成后，没有关闭任务页面并返回到学习地图页面开启下一次任务。学习地图页面和具体任务页面是不同的网页。

### 问题表现
1. **任务页面未关闭**：任务完成后，任务页面保持打开状态
2. **未返回学习地图**：没有自动跳转回学习地图页面
3. **无法继续任务**：无法自动开启下一个任务
4. **需要手动操作**：用户需要手动关闭任务页面并返回学习地图

### 问题原因
1. **页面URL不同**：学习地图页面和任务页面使用不同的URL路径
   - 学习地图页面：`/home/studyDetail`
   - 任务页面：`/home/courseDetail/`
2. **任务完成检测**：任务完成后没有正确检测到并触发返回逻辑
3. **导航逻辑缺失**：缺少任务完成后返回学习地图的导航代码

### 相关文件
- `src/mooc/zsgl/studyMap.ts` - 学习地图模块
- `src/mooc/zsgl/course.ts` - 课程任务模块
- `src/mooc/zsgl/video.ts` - 视频任务模块
- `src/mooc/zsgl/task.ts` - 任务基类

### 当前实现
查看 `studyMap.ts` 中的 `Start()` 方法：
```typescript
public Start(): Promise<any> {
    Application.App.log.Info("开始执行课程任务");
    return new Promise<void>((resolve) => {
        this.timerManager.setInterval("findTaskBtn", () => {
            // 查找并点击任务按钮
            const currentbutton = ...;
            if (currentbutton) {
                this.timerManager.clearInterval("findTaskBtn");
                currentbutton.click();
                
                // 保存任务状态
                const taskStatus: TaskStatus = {
                    status: "started",
                    expire: Date.now() + ZSGL_CONSTANTS.TASK_EXPIRE_MS,
                };
                localStorage.setItem(taskKey, JSON.stringify(taskStatus));
                
                // ❌ 缺少：任务完成后返回学习地图的逻辑
                resolve();
            }
        }, ZSGL_CONSTANTS.CHECK_INTERVAL_MS);
    });
}
```

### 待办事项
- [x] 研究任务完成的检测机制
- [x] 实现任务完成后返回学习地图页面的导航逻辑（已实现 localStorage 通信）
- [x] 添加任务页面关闭机制（已在 mooc.ts 中实现 window.close()）
- [x] 确保返回后能够自动开启下一个任务
- [ ] ⏳ 待验证：测试完整的任务流程：学习地图 → 任务 → 学习地图 → 下一个任务

### 解决方案思路
1. **监听任务完成事件**：在任务模块中监听任务完成事件
2. **返回学习地图**：任务完成后导航回学习地图页面
3. **关闭任务页面**：使用 `window.close()` 或导航关闭当前页面
4. **重新初始化**：返回学习地图后重新初始化学习地图模块
5. **自动开启下一个任务**：学习地图模块自动检测并开启下一个任务

### 代码设计
```typescript
// 在 studyMap.ts 的 Start() 方法中添加
public Start(): Promise<any> {
    Application.App.log.Info("开始执行课程任务");
    return new Promise<void>((resolve) => {
        this.timerManager.setInterval("findTaskBtn", () => {
            const currentbutton = ...;
            if (currentbutton) {
                this.timerManager.clearInterval("findTaskBtn");
                currentbutton.click();
                
                const taskKey = `${ZSGL_CONSTANTS.STORAGE_PREFIX}${this.gateTaskData.resourceId}`;
                const taskStatus: TaskStatus = {
                    status: "started",
                    expire: Date.now() + ZSGL_CONSTANTS.TASK_EXPIRE_MS,
                };
                localStorage.setItem(taskKey, JSON.stringify(taskStatus));
                
                // ✅ 新增：监听任务完成
                const handler = createStorageHandler(taskKey);
                window.addEventListener("storage", handler);
                
                resolve();
            }
        }, ZSGL_CONSTANTS.CHECK_INTERVAL_MS);
    });
}

// 修改 createStorageHandler 函数
export function createStorageHandler(key: string): StorageHandler {
    const handler = function (event: StorageEvent) {
        if (event.key === key) {
            const taskStatus = JSON.parse(event.newValue || "{}");
            if (taskStatus.status === "finished") {
                window.removeEventListener('storage', handler);
                
                // ✅ 新增：返回学习地图页面
                Application.App.log.Info("任务完成，返回学习地图页面");
                window.location.href = "#/home/studyDetail";
            }
        }
    } as StorageHandler;
    handler.key = key;
    return handler;
}
```

### 配置项设计
```typescript
{
    title: "任务完成后自动返回",
    description: "任务完成后自动返回学习地图页面",
    type: "checkbox",
    key: "auto_return_to_studymap",
    value: true,
},
{
    title: "任务完成后关闭页面",
    description: "任务完成后自动关闭任务页面",
    type: "checkbox",
    key: "auto_close_task_page",
    value: true,
},
```

---
## 6. 焦点变化和页面最小化时视频暂停问题

### 问题描述
当浏览器标签页失去焦点或页面最小化时，视频会自动暂停播放，影响自动刷课功能。

### 问题原因
1. **浏览器策略**：现代浏览器为了节省资源，会在页面不可见时限制媒体播放
2. **页面检测**：网站可能通过 `visibilitychange`、`blur` 等事件检测用户行为
3. **事件监听**：网站可能监听了焦点变化事件并暂停视频

### 相关文件
- `src/mooc/zsgl/scorm.ts` - SCORM任务（视频播放逻辑）
- `src/mooc/zsgl/video.ts` - 视频任务
- `src/mooc/zsgl/utils/utils.ts` - 事件阻止工具函数

### 当前实现
已有 `setupEventPrevention()` 函数尝试阻止这些事件：
```typescript
export function setupEventPrevention(target: Window | Document | HTMLElement): void {
    const handler = createEventPreventHandler();
    const events = [
        'blur', 'resize', 'visibilitychange', 'fullscreenchange',
        'focus', 'webkitfullscreenchange'
    ];
    events.forEach(event => {
        target.addEventListener(event, handler, true);
    });
}
```

### 待办事项
- [ ] 调研浏览器页面可见性API的工作原理
- [ ] 验证当前事件阻止是否生效
- [ ] 尝试使用 `Page Visibility API` 欺骗检测
- [ ] 考虑使用 `Object.defineProperty` 修改 `document.hidden` 属性
- [ ] 测试最小化后的视频恢复机制

### 解决方案思路
1. **事件拦截**：在捕获阶段拦截并阻止 `visibilitychange`、`blur` 等事件
2. **属性欺骗**：重写 `document.hidden`、`document.visibilityState` 属性
3. **定时恢复**：检测视频暂停后自动恢复播放（已实现 `setupVideoAutoResume`）
4. **Web Worker**：使用 Web Worker 保持后台运行

### 代码优化方向
```typescript
// 方案1：重写 visibilityState
Object.defineProperty(document, 'visibilityState', {
    get: () => 'visible',
    configurable: true
});

Object.defineProperty(document, 'hidden', {
    get: () => false,
    configurable: true
});

// 方案2：阻止 visibilitychange 事件传播
document.addEventListener('visibilitychange', (e) => {
    e.stopImmediatePropagation();
}, true);
```

### 配置项
```typescript
{
    title: "后台继续播放",
    description: "页面最小化或失去焦点时继续播放视频",
    type: "checkbox",
    key: "background_play",
    value: true,
},
```

---

## 优先级排序

| 优先级 | 问题 | 预计工作量 |
|--------|------|------------|
| P0 | 学习地图任务完成后未返回学习地图页面问题 | 高 |
| P0 | 考试答案问题 | 中 |
| P1 | SCORM子类型支持 | 高 |
| P2 | 每日积分模式 | 高 |

---

## 更新日志

| 日期 | 更新内容 |
|------|----------|
| 2025-03-09 | 创建问题清单 |
