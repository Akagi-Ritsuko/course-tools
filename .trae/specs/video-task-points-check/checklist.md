# Checklist

- [x] video.ts 在视频任务完成时正确触发 localStorage 通知
- [x] scorm.ts 在视频任务完成时正确触发 localStorage 通知
- [x] localStorage 通知 key 格式正确为 `zsgl_video_complete_${courseId}_${taskId}`
- [x] dailyPoints.ts 正确监听视频完成通知
- [x] dailyPoints.ts 的 fetchPointsDetail 方法能正确获取最新积分
- [x] dailyPoints.ts 正确判断学习积分是否达到上限
- [x] 达到上限时 dailyPoints.ts 正确设置关闭标志位
- [x] course.ts 正确监听 localStorage 关闭标志位
- [x] course.ts 收到关闭通知后正确处理页面关闭
- [x] course.ts 正确清理 localStorage 标志位
- [x] 原有课程完成通知机制不受影响
- [x] 原有任务执行流程不受影响
- [x] 不影响 studyMap.ts 的原有逻辑
