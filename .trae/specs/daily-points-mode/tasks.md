<!--
 * @Author: guotao
 * @Date: 2026-03-11 11:01:06
 * @LastEditors: guotao
 * @LastEditTime: 2026-03-11 11:46:06
 * @FilePath: \course-tools\.trae\specs\daily-points-mode\tasks.md
 * @Description: 
 * 
 * Copyright (c) 2026 by lzlj, All Rights Reserved. 
-->
# Tasks

- [x] Task 1: 创建每日积分模式基础架构
  - [x] SubTask 1.1: 创建 `src/mooc/zsgl/dailyPoints.ts` 文件
  - [x] SubTask 1.2: 定义积分类型枚举（学习积分、贡献积分、互动积分）
  - [x] SubTask 1.3: 定义积分状态接口（当前积分、上限、目标）
  - [x] SubTask 1.4: 创建 `ZsglDailyPoints` 主类

- [x] Task 2: 实现配置项
  - [x] SubTask 2.1: 在 `config.ts` 中添加知识页面链接配置项
  - [x] SubTask 2.2: 在 `config.ts` 中添加每日积分模式开关配置项
  - [x] SubTask 2.3: 在 `config.ts` 中添加积分目标配置项
  - [x] SubTask 2.4: 在 `config.ts` 中添加各类积分上限配置项

- [x] Task 3: 实现学习积分获取逻辑
  - [x] SubTask 3.1: 实现学习地图任务优先处理逻辑
  - [x] SubTask 3.2: 实现普通课程未完成任务查找逻辑
  - [x] SubTask 3.3: 实现学习积分计算（0.4 * 时长）
  - [x] SubTask 3.4: 实现学习积分上限检测（100分）

- [x] Task 4: 实现贡献积分获取逻辑
  - [x] SubTask 4.1: 实现知识页面访问逻辑
  - [x] SubTask 4.2: 实现知识阅读逻辑
  - [x] SubTask 4.3: 实现贡献积分计算（0.6/次）
  - [x] SubTask 4.4: 实现贡献积分上限检测（300分）

- [x] Task 5: 实现互动积分获取逻辑
  - [x] SubTask 5.1: 实现知识分享按钮查找逻辑
  - [x] SubTask 5.2: 实现分享按钮点击逻辑
  - [x] SubTask 5.3: 实现互动积分计算（1.6/次）
  - [x] SubTask 5.4: 实现互动积分上限检测（100分）

- [x] Task 6: 实现积分统计和进度追踪
  - [x] SubTask 6.1: 实现积分状态存储（localStorage）
  - [x] SubTask 6.2: 实现积分实时更新逻辑
  - [x] SubTask 6.3: 实现积分进度计算（已获得/上限）
  - [x] SubTask 6.4: 实现总积分统计

- [x] Task 7: 创建UI控制面板
  - [x] SubTask 7.1: 创建积分显示面板组件
  - [x] SubTask 7.2: 显示学习积分进度
  - [x] SubTask 7.3: 显示贡献积分进度
  - [x] SubTask 7.4: 显示互动积分进度
  - [x] SubTask 7.5: 显示总积分进度

- [x] Task 8: 修改平台工厂
  - [x] SubTask 8.1: 在 `platform.ts` 中添加每日积分模式判断
  - [x] SubTask 8.2: 实现知识页面URL识别
  - [x] SubTask 8.3: 实现每日积分模式初始化

- [x] Task 9: 实现任务调度和优先级管理
  - [x] SubTask 9.1: 实现学习积分任务优先级（学习地图 > 普通课程）
  - [x] SubTask 9.2: 实现三种积分类型的任务队列
  - [x] SubTask 9.3: 实现任务自动切换逻辑
  - [x] SubTask 9.4: 实现积分达到上限时的任务停止逻辑

- [ ] Task 10: 测试和验证
  - [ ] SubTask 10.1: 测试学习积分获取功能
  - [ ] SubTask 10.2: 测试贡献积分获取功能
  - [ ] SubTask 10.3: 测试互动积分获取功能
  - [ ] SubTask 10.4: 测试积分上限检测
  - [ ] SubTask 10.5: 测试UI控制面板显示
  - [ ] SubTask 10.6: 测试任务调度和优先级

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1, Task 2]
- [Task 4] depends on [Task 1, Task 2]
- [Task 5] depends on [Task 1, Task 2]
- [Task 6] depends on [Task 1, Task 2]
- [Task 7] depends on [Task 6]
- [Task 8] depends on [Task 1]
- [Task 9] depends on [Task 3, Task 4, Task 5, Task 6]
- [Task 10] depends on [Task 3, Task 4, Task 5, Task 6, Task 7, Task 8, Task 9]
