# Tasks

- [x] Task 1: 创建API请求工具函数
  - [x] SubTask 1.1: 在 `src/mooc/zsgl/utils/utils.ts` 中创建 `sendApiRequest` 工具函数
  - [x] SubTask 1.2: 实现知识阅读接口调用函数 `fetchKnowledgeRead`
  - [x] SubTask 1.3: 实现知识分享接口调用函数 `fetchKnowledgeShare`
  - [x] SubTask 1.4: 实现积分详情接口调用函数 `fetchPointsDetail`
  - [x] SubTask 1.5: 添加错误处理机制和请求超时控制
  - [x] SubTask 1.6: 实现返回结果标准化处理

- [x] Task 2: 重构知识阅读任务实现
  - [x] SubTask 2.1: 修改 `executeKnowledgeReadTask` 方法，使用API接口替代页面操作
  - [x] SubTask 2.2: 实现15秒以内随机时间间隔的定时请求逻辑
  - [x] SubTask 2.3: 实现每10次调用后查询积分详情的逻辑
  - [x] SubTask 2.4: 实现积分比较逻辑，判断是否继续执行任务
  - [x] SubTask 2.5: 添加任务取消标志位，支持任务中断

- [x] Task 3: 重构知识分享任务实现
  - [x] SubTask 3.1: 修改 `executeKnowledgeShareTask` 方法，使用API接口替代页面操作
  - [x] SubTask 3.2: 实现15秒以内随机时间间隔的定时请求逻辑
  - [x] SubTask 3.3: 实现每10次调用后查询积分详情的逻辑
  - [x] SubTask 3.4: 实现积分比较逻辑，判断是否继续执行任务
  - [x] SubTask 3.5: 添加任务取消标志位，支持任务中断

- [x] Task 4: 实现任务控制功能
  - [x] SubTask 4.1: 在 `ZsglDailyPoints` 类中添加 `stopTask` 方法
  - [x] SubTask 4.2: 实现清除所有定时器的逻辑
  - [x] SubTask 4.3: 实现任务状态更新逻辑
  - [x] SubTask 4.4: 添加消息监听，响应 STOP_DAILY_POINTS 消息
  - [x] SubTask 4.5: 确保资源正确释放

- [x] Task 5: 优化任务进度悬浮窗
  - [x] SubTask 5.1: 在悬浮窗头部添加刷新icon按钮
  - [x] SubTask 5.2: 实现刷新按钮点击事件，调用积分详情接口
  - [x] SubTask 5.3: 修改"结束任务"按钮，触发停止任务消息
  - [x] SubTask 5.4: 添加任务停止状态显示

- [x] Task 6: 实现开始前告知悬浮窗
  - [x] SubTask 6.1: 创建告知悬浮窗组件 `showConfirmationDialog` 方法
  - [x] SubTask 6.2: 设置告知悬浮窗为不可拖拽
  - [x] SubTask 6.3: 添加任务说明内容（学习积分、贡献积分、互动积分说明）
  - [x] SubTask 6.4: 添加确认选项（如：同意执行任务）
  - [x] SubTask 6.5: 添加开始按钮，点击后关闭告知悬浮窗并显示进度悬浮窗

- [x] Task 7: 修改任务启动流程
  - [x] SubTask 7.1: 修改 `start` 方法，先显示告知悬浮窗
  - [x] SubTask 7.2: 用户确认后显示进度悬浮窗
  - [x] SubTask 7.3: 开始执行每日积分任务

- [x] Task 8: 测试和验证
  - [x] SubTask 8.1: 测试API请求工具函数
  - [x] SubTask 8.2: 测试知识阅读任务API实现
  - [x] SubTask 8.3: 测试知识分享任务API实现
  - [x] SubTask 8.4: 测试任务控制功能（结束任务）
  - [x] SubTask 8.5: 测试刷新按钮功能
  - [x] SubTask 8.6: 测试开始前告知悬浮窗

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 2, Task 3]
- [Task 5] depends on [Task 1]
- [Task 6] depends on [Task 5]
- [Task 7] depends on [Task 6]
- [Task 8] depends on [Task 1, Task 2, Task 3, Task 4, Task 5, Task 6, Task 7]
