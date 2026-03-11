# Popup UI 重构与 shadcn-vue 集成 Spec

## Why
当前 popup.html 使用原生 HTML/CSS 和 Vue 2 构建，UI 风格较为陈旧，缺少现代化的组件库支持。通过集成 shadcn-vue 组件库并重构 UI，可以提升用户体验，并为"每日积分"功能提供更好的交互界面。

## What Changes
- 集成 shadcn-vue 组件库到项目中
- 重构 popup.html 使用 shadcn-vue 组件
- 新增"每日积分"标签页及配置界面
- 新增积分进度悬浮框组件
- **BREAKING** 需要升级 Vue 版本从 2.x 到 3.x（shadcn-vue 要求）
- **BREAKING** 需要升级 webpack 到 5.x 以适配 Node.js 22

## Impact
- Affected specs: 每日积分模式
- Affected code: 
  - `package.json` - 添加 shadcn-vue 及相关依赖
  - `src/views/popup.html` - UI 重构
  - `src/views/popup.ts` - Vue 3 迁移
  - `webpack.config.js` - 构建配置更新
  - `src/views/components/` - 新建组件目录

## ADDED Requirements

### Requirement: 构建工具升级
系统 SHALL 升级 webpack 到 5.x 版本以适配 Node.js 22 运行环境。

#### Scenario: webpack 5 升级
- **WHEN** 项目需要在 Node.js 22 环境下运行
- **THEN** webpack 升级到 5.x 版本
- **AND** webpack-cli 升级到兼容版本
- **AND** 所有相关 loader 和插件升级到兼容版本
- **AND** 构建流程正常工作

#### Scenario: 构建配置迁移
- **WHEN** webpack 升级到 5.x
- **THEN** 迁移废弃的配置选项
- **AND** 更新 webpack.config.js 配置格式
- **AND** 确保构建输出正确

### Requirement: shadcn-vue 组件库集成
系统 SHALL 正确集成并配置 shadcn-vue 组件库，确保所有组件可正常使用。

#### Scenario: 手动安装 shadcn-vue
- **WHEN** 开发者按照手动安装指南配置项目
- **THEN** shadcn-vue 组件库正确安装
- **AND** Tailwind CSS 正确配置
- **AND** 组件可在项目中正常导入使用

#### Scenario: Vue 3 迁移
- **WHEN** 项目需要使用 shadcn-vue
- **THEN** Vue 版本从 2.x 升级到 3.x
- **AND** popup.ts 使用 Vue 3 Composition API
- **AND** 现有功能保持兼容

### Requirement: 每日积分标签页
系统 SHALL 在 popup 界面中提供"每日积分"标签页，包含配置输入和操作按钮。

#### Scenario: 显示每日积分标签页
- **WHEN** 用户打开 popup 界面
- **THEN** 显示"每日积分"标签页选项
- **AND** 点击后显示配置界面

#### Scenario: 配置输入项
- **WHEN** 用户进入每日积分标签页
- **THEN** 显示知识链接文本输入框
- **AND** 显示贡献积分获取上限数字输入框
- **AND** 显示互动积分获取上限数字输入框
- **AND** 输入值可保存到配置

#### Scenario: 开始按钮
- **WHEN** 用户点击"开始"按钮
- **THEN** 弹出积分进度悬浮框
- **AND** 开始执行每日积分任务

### Requirement: 积分进度悬浮框
系统 SHALL 提供独立的积分进度悬浮框组件，显示各类型积分的获取进度。

#### Scenario: 显示进度悬浮框
- **WHEN** 用户点击"开始"按钮
- **THEN** 显示独立的悬浮框组件
- **AND** 悬浮框包含学习积分进度条
- **AND** 悬浮框包含贡献积分进度条
- **AND** 悬浮框包含互动积分进度条
- **AND** 悬浮框包含"结束"按钮

#### Scenario: 进度条可视化
- **WHEN** 积分进度更新
- **THEN** 进度条实时反映当前进度
- **AND** 显示当前积分值和上限值
- **AND** 进度条颜色根据积分类型区分

#### Scenario: 结束按钮
- **WHEN** 用户点击"结束"按钮
- **THEN** 关闭悬浮框
- **AND** 停止每日积分任务

### Requirement: 设计规范统一
系统 SHALL 使用 shadcn-vue 组件库实现所有 UI 元素，保持设计风格统一。

#### Scenario: 组件使用规范
- **WHEN** 实现 UI 元素
- **THEN** 优先使用 shadcn-vue 提供的组件
- **AND** 遵循 shadcn-vue 的设计规范
- **AND** 保持与现代 UI/UX 最佳实践一致

## MODIFIED Requirements

### Requirement: popup 界面重构
popup 界面 SHALL 使用 shadcn-vue 组件重构，保持现有功能不变。

#### Scenario: 标签页导航
- **WHEN** 用户使用 popup 界面
- **THEN** 使用 shadcn-vue Tabs 组件实现标签页切换
- **AND** 现有配置项功能保持不变

## REMOVED Requirements
无
