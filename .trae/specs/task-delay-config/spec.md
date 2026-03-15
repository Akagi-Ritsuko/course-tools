# 任务延迟配置项 Spec

## Why
当前知识阅读和知识分享任务的延迟时间是硬编码的 `Math.floor(Math.random() * 15000) + 1000`（1-16秒随机延迟），用户希望能够自定义这个延迟时间，以便根据实际情况调整任务执行间隔。

## What Changes
- 在每日任务 tab 配置界面添加"任务延迟"配置项
- 将硬编码的延迟时间改为从配置读取
- 实现延迟逻辑：实际延迟 = 配置值 ± 5秒，最小为 0
- 当延迟为 0 时，跳过 sleep 函数调用

## Impact
- Affected specs: 每日积分任务配置
- Affected code:
  - `src/views/components/DailyPointsConfig.vue` - 添加配置项 UI
  - `src/internal/utils/dailyPointsPanel.ts` - 更新接口定义
  - `src/mooc/zsgl/dailyPoints.ts` - 使用配置项替代硬编码

## ADDED Requirements

### Requirement: 任务延迟配置项
系统 SHALL 提供任务延迟配置项，允许用户自定义知识阅读和知识分享任务之间的等待时间。

#### Scenario: 用户配置任务延迟
- **WHEN** 用户在每日任务 tab 中填写任务延迟值
- **THEN** 系统保存该配置并在任务执行时使用

#### Scenario: 延迟时间计算
- **WHEN** 任务执行需要延迟时
- **THEN** 实际延迟时间 = 配置值 ± 5秒（随机），最小为 0

#### Scenario: 延迟为 0
- **WHEN** 配置值为 0 或计算后的延迟为 0
- **THEN** 跳过 sleep 函数调用，立即执行下一步

### Requirement: 配置项 UI
系统 SHALL 在每日任务 tab 中提供任务延迟配置输入框。

#### Scenario: 显示配置项
- **WHEN** 用户打开每日任务 tab
- **THEN** 显示任务延迟配置输入框，默认值为 8 秒（当前硬编码的平均值约 8.5 秒）

#### Scenario: 配置项说明
- **WHEN** 用户查看任务延迟配置项
- **THEN** 显示 tips 说明："实际延迟 = 配置值 ± 5秒，最小为 0，为 0 则不等待"
