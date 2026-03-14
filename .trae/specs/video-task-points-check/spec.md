# 视频任务完成实时通知与积分上限检查 Spec

## Why
当前课程任务完成通知是在整个课程所有任务完成后才触发，但用户需要在每个视频任务完成时就检查积分是否达到上限，以便及时关闭课程页面，节省资源。

## What Changes
- 新增视频任务完成事件通知机制，在每个视频任务完成时通知 dailyPoints.ts
- 新增积分上限检查功能，dailyPoints.ts 收到通知后检查是否达到每日学习积分上限
- 新增页面关闭通知机制，当积分达到上限时通知 course.ts 关闭课程页面
- 保持原有课程完成通知机制不变

## Impact
- Affected specs: 课程任务通信机制
- Affected code:
  - `src/mooc/zsgl/dailyPoints.ts` - 新增积分上限检查和页面关闭通知
  - `src/mooc/zsgl/course.ts` - 新增视频任务完成事件触发
  - `src/mooc/zsgl/video.ts` - 新增视频完成事件通知
  - `src/mooc/zsgl/scorm.ts` - 新增视频完成事件通知

## ADDED Requirements

### Requirement: 视频任务完成事件通知

系统 SHALL 在每个视频任务完成时通知 dailyPoints.ts 模块。

#### Scenario: 视频任务完成通知
- **GIVEN** 用户正在执行课程任务
- **WHEN** 一个视频任务完成
- **THEN** video.ts 或 scorm.ts 触发 `videoTaskComplete` 事件
- **AND** 事件包含当前课程 ID 信息
- **AND** 不影响原有的 `taskComplete` 事件

### Requirement: 积分上限检查

系统 SHALL 在收到视频任务完成通知后检查积分是否达到上限。

#### Scenario: 积分上限检查
- **GIVEN** dailyPoints.ts 收到视频任务完成通知
- **WHEN** 检查当前学习积分
- **THEN** 调用 API 获取最新积分详情
- **AND** 比较当前积分与每日上限
- **AND** 如果达到上限，触发页面关闭通知

### Requirement: 页面关闭通知

系统 SHALL 在积分达到上限时通知 course.ts 关闭课程页面。

#### Scenario: 页面关闭通知
- **GIVEN** 学习积分达到每日上限
- **WHEN** dailyPoints.ts 检测到上限
- **THEN** 设置 localStorage 标志位 `zsgl_close_course_${courseId}` 为 `true`
- **AND** course.ts 监听到变化后关闭当前课程页面

### Requirement: 保持原有逻辑不变

系统 SHALL 保持原有的课程完成通知机制不变。

#### Scenario: 原有课程完成通知
- **GIVEN** 课程所有任务完成
- **WHEN** 触发 `courseTaskComplete` 事件
- **THEN** 更新 localStorage 任务状态为 `finished`
- **AND** dailyPoints.ts 继续查找下一个任务

## MODIFIED Requirements

### Requirement: video.ts 和 scorm.ts 任务完成处理

**新增：**
- 在视频任务完成时，除了触发 `taskComplete` 事件外，还需触发 `videoTaskComplete` 事件
- 事件数据包含 `courseId` 和 `taskId` 信息

### Requirement: dailyPoints.ts 事件监听

**新增：**
- 监听 `videoTaskComplete` 事件或 localStorage 变化
- 收到通知后调用 `fetchPointsDetail()` 获取最新积分
- 检查学习积分是否达到上限
- 达到上限时设置关闭标志位

### Requirement: course.ts 页面关闭

**新增：**
- 监听 localStorage 中的关闭标志位
- 收到关闭通知后调用 `window.close()` 或提示用户关闭页面

## REMOVED Requirements

无
