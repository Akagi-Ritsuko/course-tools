# Tasks

- [x] Task 1: 改造 hookCourseListRequest 方法
  - [x] SubTask 1.1: 添加成员变量存储请求参数（curPage, numPerPage, sortType, totalPage）
  - [x] SubTask 1.2: 在拦截回调中解析并记录请求参数
  - [x] SubTask 1.3: 返回课程列表数据的同时返回请求参数信息

- [x] Task 2: 实现分页查询逻辑
  - [x] SubTask 2.1: 创建 `fetchCourseListWithPage` 方法，支持传入 curPage 参数
  - [x] SubTask 2.2: 使用 sendApiRequest 发起课程列表请求
  - [x] SubTask 2.3: 解析响应数据，返回课程列表和分页信息

- [x] Task 3: 改造 executeCourseTask 方法
  - [x] SubTask 3.1: 移除 `clickViewMoreButton` 调用
  - [x] SubTask 3.2: 实现循环分页查询逻辑
  - [x] SubTask 3.3: 当 curPage < totalPage 且无未完成课程时，递增 curPage 继续查询
  - [x] SubTask 3.4: 当找到未完成课程或达到最后一页时，退出循环

- [x] Task 4: 实现新窗口打开课程详情
  - [x] SubTask 4.1: 创建 `openCourseInNewWindow` 方法
  - [x] SubTask 4.2: 使用 courseId 构造链接 `https://zsgl.lzlj.com/znWeb/znPortal/#/home/courseDetail/{courseId}`
  - [x] SubTask 4.3: 使用 `window.open` 在新窗口打开链接
  - [x] SubTask 4.4: 添加日志记录打开的课程信息

- [x] Task 5: 更新 findUnfinishedCourseFromData 方法
  - [x] SubTask 5.1: 修改方法返回类型，包含 courseId 信息
  - [x] SubTask 5.2: 确保正确解析 `isCompleted` 字段（注意字符串 "0" 和 "1"）

- [x] Task 6: 测试和验证
  - [x] SubTask 6.1: 测试分页查询逻辑
  - [x] SubTask 6.2: 测试新窗口打开功能
  - [x] SubTask 6.3: 测试边界情况（最后一页、无课程等）

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1, Task 2]
- [Task 4] depends on [Task 3]
- [Task 5] depends on [Task 3]
- [Task 6] depends on [Task 1, Task 2, Task 3, Task 4, Task 5]
