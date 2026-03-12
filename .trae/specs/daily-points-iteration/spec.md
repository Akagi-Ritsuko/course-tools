# 每日积分模式迭代开发 Spec

## Why
当前每日积分模式的知识阅读和知识分享任务实现方式不够可靠，需要通过直接调用API接口来获取积分。同时需要增强任务控制功能和用户交互体验，包括添加结束任务功能、刷新积分进度、开始前告知悬浮窗等功能。

## What Changes
- 新增API请求工具函数，用于调用知识阅读、知识分享和积分详情接口
- 修改知识阅读任务实现，改为通过API接口获取积分
- 修改知识分享任务实现，改为通过API接口获取积分
- 新增任务控制功能，支持立即停止正在执行的每日积分任务
- 修改任务进度悬浮窗，新增刷新按钮和开始前告知悬浮窗

## Impact
- Affected specs: 每日积分模式
- Affected code: 
  - `src/mooc/zsgl/dailyPoints.ts` - 核心业务逻辑修改
  - `src/internal/utils/dailyPointsPanel.ts` - 悬浮窗组件修改
  - `src/mooc/zsgl/utils/utils.ts` - 新增API请求工具函数

## ADDED Requirements

### Requirement: API请求工具函数
系统 SHALL 提供统一的API请求工具函数，支持调用知识阅读、知识分享和积分详情接口。

#### Scenario: 知识阅读接口调用
- **WHEN** 系统需要获取知识阅读积分
- **THEN** 调用知识阅读接口 `knowledgecloud/page/details.do`
- **AND** 传入正确的pageId和sid参数
- **AND** 处理接口返回结果
- **AND** 具备错误处理机制和请求超时控制

#### Scenario: 知识分享接口调用
- **WHEN** 系统需要获取知识分享积分
- **THEN** 调用知识分享接口 `knowledge/cloud/page/like/isShareOut.do`
- **AND** 传入正确的pageId和sid参数
- **AND** 处理接口返回结果
- **AND** 具备错误处理机制和请求超时控制

#### Scenario: 积分详情接口调用
- **WHEN** 系统需要查询当前积分详情
- **THEN** 调用积分详情接口 `personal/statistics/queryUserPointPercent.do`
- **AND** 传入正确的时间范围参数
- **AND** 返回标准化处理的积分数据

### Requirement: 知识阅读任务API实现
系统 SHALL 通过API接口实现知识阅读任务，定时发送请求获取贡献积分。

#### Scenario: 定时发送阅读请求
- **WHEN** 知识阅读任务开始执行
- **THEN** 系统通过API发送知识阅读请求
- **AND** 每次请求间隔为15秒以内的随机时间
- **AND** 每完成10次接口调用后查询积分详情
- **AND** 比较当前积分与目标积分判断是否继续执行

#### Scenario: 积分达到上限停止任务
- **WHEN** 贡献积分达到上限或目标
- **THEN** 系统停止知识阅读任务
- **AND** 更新任务状态
- **AND** 继续执行下一个任务

### Requirement: 知识分享任务API实现
系统 SHALL 通过API接口实现知识分享任务，定时发送请求获取互动积分。

#### Scenario: 定时发送分享请求
- **WHEN** 知识分享任务开始执行
- **THEN** 系统通过API发送知识分享请求
- **AND** 每次请求间隔为15秒以内的随机时间
- **AND** 每完成10次接口调用后查询积分详情
- **AND** 比较当前积分与目标积分判断是否继续执行

#### Scenario: 积分达到上限停止任务
- **WHEN** 互动积分达到上限或目标
- **THEN** 系统停止知识分享任务
- **AND** 更新任务状态
- **AND** 继续执行下一个任务

### Requirement: 任务控制功能
系统 SHALL 提供任务控制功能，支持立即停止正在执行的每日积分任务。

#### Scenario: 点击结束任务按钮
- **WHEN** 用户点击悬浮窗中的"结束任务"按钮
- **THEN** 系统立即停止当前正在执行的任务
- **AND** 清除所有定时器
- **AND** 释放相关资源
- **AND** 更新任务状态为已停止

#### Scenario: 任务终止后状态更新
- **WHEN** 任务被终止
- **THEN** 悬浮窗显示任务已停止状态
- **AND** 积分数据保持最后状态
- **AND** 用户可以重新开始任务

### Requirement: 任务进度悬浮窗优化
系统 SHALL 优化任务进度悬浮窗，提供更好的用户交互体验。

#### Scenario: 刷新积分进度
- **WHEN** 用户点击悬浮窗中的刷新按钮
- **THEN** 系统调用积分详情接口获取最新数据
- **AND** 更新悬浮窗显示的积分进度

#### Scenario: 开始前告知悬浮窗
- **WHEN** 用户点击开始每日积分任务
- **THEN** 显示开始前告知悬浮窗
- **AND** 告知悬浮窗不可拖拽
- **AND** 包含任务说明内容
- **AND** 包含确认选项和开始按钮

#### Scenario: 确认开始任务
- **WHEN** 用户在告知悬浮窗中点击开始按钮
- **THEN** 关闭告知悬浮窗
- **AND** 显示任务进度悬浮窗
- **AND** 开始执行每日积分任务

## MODIFIED Requirements

### Requirement: 知识阅读任务执行
知识阅读任务 SHALL 通过API接口实现，替代原有的页面操作方式。

#### Scenario: API方式获取积分
- **WHEN** 执行知识阅读任务
- **THEN** 使用API工具函数发送请求
- **AND** 不再依赖页面元素查找和点击

### Requirement: 知识分享任务执行
知识分享任务 SHALL 通过API接口实现，替代原有的页面操作方式。

#### Scenario: API方式获取积分
- **WHEN** 执行知识分享任务
- **THEN** 使用API工具函数发送请求
- **AND** 不再依赖页面元素查找和点击

## REMOVED Requirements
无
