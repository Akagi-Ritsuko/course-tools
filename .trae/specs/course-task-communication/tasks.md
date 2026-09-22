# Tasks

- [x] Task 1: 重构课程列表获取方式
  - [x] SubTask 1.1: 移除 `setupCourseListHook` 和 `waitForCourseListHook` 方法
  - [x] SubTask 1.2: 修改 `fetchCourseListWithPage` 方法，curPage 从 1 开始
  - [x] SubTask 1.3: 在 `executeCourseTask` 中先调用 `extractSidFromStorage()` 获取 sid
  - [x] SubTask 1.4: 直接使用 API 请求获取课程列表，不再依赖拦截

- [x] Task 2: 实现 localStorage 任务通信机制
  - [x] SubTask 2.1: 创建 `setTaskStarted(courseId)` 方法，设置任务开始状态
  - [x] SubTask 2.2: 创建 `waitForTaskComplete(courseId)` 方法，监听任务完成
  - [x] SubTask 2.3: 使用轮询方式检查 localStorage 状态
  - [x] SubTask 2.4: 添加超时处理，避免无限等待

- [x] Task 3: 改造 executeCourseTask 方法
  - [x] SubTask 3.1: 移除拦截相关代码
  - [x] SubTask 3.2: 使用 `fetchCourseListWithPage(1)` 获取第一页数据
  - [x] SubTask 3.3: 找到未完成课程后，调用 `setTaskStarted(courseId)`
  - [x] SubTask 3.4: 在新窗口打开课程详情页
  - [x] SubTask 3.5: 调用 `waitForTaskComplete(courseId)` 等待完成
  - [x] SubTask 3.6: 收到完成通知后，继续查找下一个任务

- [x] Task 4: 修改 course.ts 任务完成通知
  - [x] SubTask 4.1: 在 `notifyStudyMapCourseComplete()` 中同时处理 dailyPoints 任务状态
  - [x] SubTask 4.2: 检查 localStorage 中以 `zsgl_daily_task_` 开头的 key
  - [x] SubTask 4.3: 更新状态为 "finished"

- [x] Task 5: 测试和验证
  - [x] SubTask 5.1: 测试直接构造请求获取课程列表
  - [x] SubTask 5.2: 测试 localStorage 通信机制
  - [x] SubTask 5.3: 测试任务完成后的继续查找逻辑

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1, Task 2]
- [Task 4] depends on [Task 2]
- [Task 5] depends on [Task 1, Task 2, Task 3, Task 4]
