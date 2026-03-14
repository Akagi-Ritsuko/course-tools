# Tasks

- [x] Task 1: 在 video.ts 和 scorm.ts 中添加视频任务完成通知
  - [x] SubTask 1.1: 在 video.ts 的 setupVideoEndHandler 方法中添加 localStorage 通知
  - [x] SubTask 1.2: 在 scorm.ts 的 setupVideoEndHandler 方法中添加 localStorage 通知
  - [x] SubTask 1.3: 定义通知的 localStorage key 格式为 `zsgl_video_complete_${courseId}_${taskId}`

- [x] Task 2: 在 dailyPoints.ts 中添加积分上限检查逻辑
  - [x] SubTask 2.1: 添加监听视频完成通知的方法
  - [x] SubTask 2.2: 实现 fetchPointsDetail 方法获取最新积分
  - [x] SubTask 2.3: 实现积分上限判断逻辑
  - [x] SubTask 2.4: 达到上限时设置关闭标志位 `zsgl_close_course_${courseId}`

- [x] Task 3: 在 course.ts 中添加页面关闭监听
  - [x] SubTask 3.1: 添加监听 localStorage 关闭标志位的方法
  - [x] SubTask 3.2: 收到关闭通知后尝试关闭页面或提示用户
  - [x] SubTask 3.3: 清理 localStorage 标志位

- [x] Task 4: 确保原有逻辑不受影响
  - [x] SubTask 4.1: 测试原有课程完成通知机制正常工作
  - [x] SubTask 4.2: 测试原有任务执行流程正常工作

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 1], [Task 2], [Task 3]
