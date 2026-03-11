# Tasks

- [x] Task 1: 升级 webpack 到 5.x 以适配 Node.js 22
  - [x] SubTask 1.1: 升级 webpack 从 4.x 到 5.x
  - [x] SubTask 1.2: 升级 webpack-cli 到兼容版本
  - [x] SubTask 1.3: 升级 html-webpack-plugin 到兼容版本
  - [x] SubTask 1.4: 升级 ts-loader 到兼容版本
  - [x] SubTask 1.5: 升级 css-loader 和 style-loader 到兼容版本
  - [x] SubTask 1.6: 更新 webpack.config.js 配置格式（移除废弃选项）
  - [x] SubTask 1.7: 验证构建流程在 Node.js 22 下正常工作

- [x] Task 2: 升级 Vue 版本和配置构建工具
  - [x] SubTask 2.1: 升级 package.json 中的 Vue 从 2.x 到 3.x
  - [x] SubTask 2.2: 更新 webpack.config.js 的 Vue 别名配置
  - [x] SubTask 2.3: 安装 @vue/compiler-sfc 支持 Vue 3 单文件组件
  - [x] SubTask 2.4: 验证构建流程正常工作

- [x] Task 3: 安装和配置 Tailwind CSS
  - [x] SubTask 3.1: 安装 tailwindcss、postcss、autoprefixer 依赖
  - [x] SubTask 3.2: 创建 tailwind.config.js 配置文件
  - [x] SubTask 3.3: 创建 postcss.config.js 配置文件
  - [x] SubTask 3.4: 在 webpack.config.js 中添加 PostCSS loader
  - [x] SubTask 3.5: 创建全局 CSS 文件引入 Tailwind 指令

- [x] Task 4: 安装和配置 shadcn-vue
  - [x] SubTask 4.1: 安装 shadcn-vue 核心依赖（radix-vue、class-variance-authority、clsx、tailwind-merge）
  - [x] SubTask 4.2: 安装 lucide-vue-next 图标库
  - [x] SubTask 4.3: 创建 src/lib/utils.ts 工具函数文件
  - [x] SubTask 4.4: 更新 tsconfig.json 添加路径别名

- [x] Task 5: 添加 shadcn-vue 组件
  - [x] SubTask 5.1: 创建 src/components/ui/ 目录结构
  - [x] SubTask 5.2: 添加 Button 组件
  - [x] SubTask 5.3: 添加 Input 组件
  - [x] SubTask 5.4: 添加 Tabs 组件
  - [x] SubTask 5.5: 添加 Progress 组件
  - [x] SubTask 5.6: 添加 Card 组件
  - [x] SubTask 5.7: 添加 Label 组件
  - [x] SubTask 5.8: 添加 Dialog 组件（用于悬浮框）

- [x] Task 6: 创建每日积分配置组件
  - [x] SubTask 6.1: 创建 src/views/components/DailyPointsConfig.vue 组件
  - [x] SubTask 6.2: 实现知识链接输入框
  - [x] SubTask 6.3: 实现贡献积分上限输入框
  - [x] SubTask 6.4: 实现互动积分上限输入框
  - [x] SubTask 6.5: 实现"开始"按钮及点击事件

- [x] Task 7: 创建积分进度悬浮框组件
  - [x] SubTask 7.1: 创建 src/views/components/PointsProgressDialog.vue 组件
  - [x] SubTask 7.2: 实现学习积分进度条
  - [x] SubTask 7.3: 实现贡献积分进度条
  - [x] SubTask 7.4: 实现互动积分进度条
  - [x] SubTask 7.5: 实现"结束"按钮及事件处理

- [x] Task 8: 重构 popup.html 和 popup.ts
  - [x] SubTask 8.1: 重构 popup.html 使用新的组件结构
  - [x] SubTask 8.2: 将 popup.ts 迁移到 Vue 3 Composition API
  - [x] SubTask 8.3: 集成 Tabs 组件实现平台切换
  - [x] SubTask 8.4: 添加"每日积分"标签页
  - [x] SubTask 8.5: 确保现有配置功能正常工作

- [x] Task 9: 集成测试和验证
  - [x] SubTask 9.1: 验证 popup 界面正常显示
  - [x] SubTask 9.2: 验证标签页切换功能
  - [x] SubTask 9.3: 验证每日积分配置保存功能
  - [x] SubTask 9.4: 验证悬浮框显示和交互
  - [x] SubTask 9.5: 验证进度条实时更新
  - [x] SubTask 9.6: 验证构建输出正确

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 2, Task 3]
- [Task 5] depends on [Task 4]
- [Task 6] depends on [Task 5]
- [Task 7] depends on [Task 5]
- [Task 8] depends on [Task 6, Task 7]
- [Task 9] depends on [Task 8]
