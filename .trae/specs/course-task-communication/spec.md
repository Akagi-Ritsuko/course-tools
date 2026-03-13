# 课程任务通信机制重构 Spec

## Why

当前的课程任务执行使用 HTTP 拦截方式获取课程列表，但拦截时机不稳定，且 dailyPoints.ts 与 course.ts 之间缺乏有效的任务完成通信机制。需要参考 studymap 的通信方式，改用直接构造请求的方式，并建立基于 localStorage 的任务完成通知机制。

## What Changes

- 移除课程列表 HTTP 拦截方式，改用直接构造 API 请求
- 参考 studymap 的 localStorage 通信机制，建立 dailyPoints.ts 与 course.ts 之间的任务完成通知
- 课程在新窗口打开执行，完成后通知 dailyPoints.ts 继续查找下一个任务

## Impact

- Affected specs: 课程任务执行流程、任务通信机制
- Affected code:
  - `src/mooc/zsgl/dailyPoints.ts`
  - `src/mooc/zsgl/course.ts`

## ADDED Requirements

### Requirement: 直接构造课程列表请求

The system SHALL 直接构造课程列表 API 请求，不再使用 HTTP 拦截方式。

#### Scenario: 构造课程列表请求

- **GIVEN** dailyPoints 模式启动
- **WHEN** 需要获取课程列表
- **THEN** 直接构造 API 请求 URL，curPage 从 1 开始
- **AND** 使用 `extractSidFromStorage()` 获取 sid 作为请求参数
- **AND** 发送请求获取课程列表数据

### Requirement: localStorage 任务完成通信

The system SHALL 使用 localStorage 进行任务完成状态的通信。

#### Scenario: 设置任务开始状态

- **GIVEN** 找到未完成的课程
- **WHEN** 在新窗口打开课程详情页
- **THEN** 在 localStorage 中设置任务状态为 `{ status: "started", expire: timestamp }`
- **AND** key 格式为 `zsgl_dailyl_task_${courseId}`

#### Scenario: 监听任务完成通知

- **GIVEN** 任务状态已设置为 "started"
- **WHEN** course.ts 完成课程任务
- **THEN** course.ts 更新 localStorage 状态为 `{ status: "finished", expire: timestamp }`
- **AND** dailyPoints.ts 通过 storage 事件监听到变化
- **AND** 继续查找下一个未完成的课程任务

### Requirement: course.ts 任务完成通知

The system SHALL 在课程任务完成后通知 dailyPoints.ts。

#### Scenario: 课程任务完成

- **GIVEN** course.ts 中所有课程任务已完成
- **WHEN** 触发 `courseTaskComplete` 事件
- **THEN** 检查 localStorage 中是否有状态为 "started" 的任务
- **AND** 更新状态为 "finished"

## MODIFIED Requirements

### Requirement: executeCourseTask 方法

**原逻辑：**

- 使用 HTTP 拦截获取课程列表
- 在新窗口打开课程后直接返回

**新逻辑：**

- 直接构造 API 请求获取课程列表（curPage 从 1 开始）
- 在新窗口打开课程后，设置 localStorage 任务状态
- 监听 storage 事件，等待任务完成通知
- 收到完成通知后，继续查找下一个未完成任务

### Requirement: course.ts 任务完成处理

**新增：**

- 在 `notifyStudyMapCourseComplete()` 方法中同时处理 dailyPoints 的任务状态

## REMOVED Requirements

### Requirement: HTTP 拦截课程列表

**Reason**: 改用直接构造 API 请求方式，更稳定可靠
**Migration**: 移除 `setupCourseListHook` 和 `waitForCourseListHook` 方法
