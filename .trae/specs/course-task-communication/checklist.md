# Checklist

- [x] 移除了 HTTP 拦截方式获取课程列表
- [x] 改用直接构造 API 请求获取课程列表
- [x] 新增 `setTaskStarted(courseId)` 方法设置任务开始状态
- [x] 新增 `waitForTaskComplete(courseId)` 方法等待任务完成
- [x] executeCourseTask 方法正确实现循环查找任务逻辑
- [x] course.ts 的 `notifyStudyMapCourseComplete()` 同时处理 dailyPoints 任务状态
- [x] localStorage key 使用正确的前缀 `zsgl_daily_task_`
- [x] 添加了超时处理，避免无限等待
