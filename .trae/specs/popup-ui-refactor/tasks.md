# Tasks

- [ ] Task 1: Vue 3 升级和依赖安装
  - [ ] SubTask 1.1: 更新 package.json 中的 Vue 版本到 3.x
  - [ ] SubTask 1.2: 安装 shadcn-vue 相关依赖（tailwindcss、radix-vue、class-variance-authority、clsx、tailwind-merge、lucide-vue-next）
  - [ ] SubTask 1.3: 更新 webpack 配置以支持 Vue 3 和 tailwindcss
  - [ ] SubTask 1.4: 创建 tailwind.config.js 配置文件
  - [ ] SubTask 1.5: 创建 postcss.config.js 配置文件

- [ ] Task 2: 重构 popup.ts 使用 Vue 3
  - [ ] SubTask 2.1: 将 Options API 迁移到 Composition API
  - [ ] SubTask 2.2: 使用 createApp 替代 new Vue
  - [ ] SubTask 2.3: 更新响应式数据使用 ref/reactive
  - [ ] SubTask 2.4: 保持原有的配置读写逻辑

- [ ] Task 3: 重构 popup.html UI 布局
  - [ ] SubTask 3.1: 引入 tailwindcss 样式
  - [ ] SubTask 3.2: 创建 shadcn-vue 组件目录结构
  - [ ] SubTask 3.3: 实现 Tabs 组件用于 Tab 导航
  - [ ] SubTask 3.4: 重构头部样式使用现代化设计
  - [ ] SubTask 3.5: 重构配置项使用 shadcn-vue Input、Checkbox 组件

- [ ] Task 4: 新增每日积分模式配置项
  - [ ] SubTask 4.1: 在 config.ts 中添加 knowledge_page_url 配置项
  - [ ] SubTask 4.2: 在 config.ts 中添加 contribution_points_limit 配置项
  - [ ] SubTask 4.3: 在 config.ts 中添加 interaction_points_limit 配置项
  - [ ] SubTask 4.4: 在 SystemConfig.config.zsgl.items 中添加新配置项定义

- [ ] Task 5: 创建每日积分模式 Tab 页面
  - [ ] SubTask 5.1: 创建 DailyPointsMode.vue 组件
  - [ ] SubTask 5.2: 实现知识链接 Input 配置
  - [ ] SubTask 5.3: 实现贡献积分上限 Input 配置
  - [ ] SubTask 5.4: 实现互动积分上限 Input 配置
  - [ ] SubTask 5.5: 实现开始按钮（使用 shadcn-vue Button 组件）

- [ ] Task 6: 创建积分进度悬浮框组件
  - [ ] SubTask 6.1: 创建 PointsProgressModal.vue 组件（独立文件）
  - [ ] SubTask 6.2: 实现学习积分进度条
  - [ ] SubTask 6.3: 实现贡献积分进度条
  - [ ] SubTask 6.4: 实现互动积分进度条
  - [ ] SubTask 6.5: 实现结束按钮
  - [ ] SubTask 6.6: 实现悬浮框的显示/隐藏逻辑

- [ ] Task 7: 集成每日积分模式功能
  - [ ] SubTask 7.1: 连接开始按钮与 ZsglDailyPoints 类
  - [ ] SubTask 7.2: 实现积分状态的实时同步
  - [ ] SubTask 7.3: 实现结束按钮停止任务逻辑
  - [ ] SubTask 7.4: 实现悬浮框与 background.js 的消息通信

- [ ] Task 8: 测试和验证
  - [ ] SubTask 8.1: 测试 Vue 3 升级后的 popup 功能
  - [ ] SubTask 8.2: 测试配置项读写功能
  - [ ] SubTask 8.3: 测试每日积分模式 Tab 显示
  - [ ] SubTask 8.4: 测试悬浮框显示和进度更新
  - [ ] SubTask 8.5: 测试开始/结束按钮功能

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1, Task 2]
- [Task 5] depends on [Task 3, Task 4]
- [Task 6] depends on [Task 1, Task 3]
- [Task 7] depends on [Task 5, Task 6]
- [Task 8] depends on [Task 2, Task 3, Task 4, Task 5, Task 6, Task 7]
