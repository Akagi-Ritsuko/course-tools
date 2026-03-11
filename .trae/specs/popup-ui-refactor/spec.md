# Popup UI 重构 Spec

## Why
当前 popup.html 使用原生 CSS 样式和 Vue 2，UI 风格较为陈旧，缺乏现代化的组件设计。通过引入 shadcn-vue 组件库，可以提升 UI 的美观性和用户体验，同时新增每日积分模式功能入口。

## What Changes
- **BREAKING**: 升级 Vue 2.6.12 到 Vue 3.x（shadcn-vue 要求 Vue 3）
- 新增 shadcn-vue 组件库及其依赖（tailwindcss、radix-vue 等）
- 重构 popup.html 的整体 UI 布局和样式
- 新增"每日积分模式" Tab 页面
- 新增悬浮框组件用于显示积分进度
- 新增配置项：知识链接、贡献积分获取上限、互动积分获取上限

## Impact
- Affected specs: 
  - `daily-points-mode` - 需要与后端积分逻辑集成
- Affected code: 
  - `src/views/popup.ts` - Vue 3 重构
  - `src/views/popup.html` - UI 重构
  - `src/config.ts` - 新增配置项
  - `package.json` - 依赖更新
  - `webpack.config.js` - 构建配置更新

## ADDED Requirements

### Requirement: Vue 3 升级
系统 SHALL 将 Vue 2 升级到 Vue 3，以支持 shadcn-vue 组件库。

#### Scenario: Vue 3 迁移
- **WHEN** 执行升级操作
- **THEN** 项目使用 Vue 3.x
- **AND** 所有 Vue 2 的 Options API 代码迁移为 Vue 3 兼容写法
- **AND** 构建配置更新以支持 Vue 3

### Requirement: shadcn-vue 组件库集成
系统 SHALL 集成 shadcn-vue 组件库及其依赖。

#### Scenario: 安装依赖
- **WHEN** 执行依赖安装
- **THEN** 安装 tailwindcss、@tailwindcss/vite、radix-vue、class-variance-authority、clsx、tailwind-merge、lucide-vue-next 等依赖
- **AND** 配置 tailwindcss
- **AND** 配置 shadcn-vue 组件

### Requirement: Popup UI 重构
系统 SHALL 使用 shadcn-vue 组件重构 popup.html 的 UI。

#### Scenario: Tab 组件实现
- **WHEN** 用户打开 popup
- **THEN** 显示现代化的 Tab 导航
- **AND** 包含原有的"知识管理" Tab
- **AND** 包含新增的"每日积分模式" Tab

#### Scenario: 配置项组件
- **WHEN** 用户在 Tab 页面中查看配置
- **THEN** 使用 shadcn-vue 的 Input、Checkbox、Label 等组件显示配置项
- **AND** 保持原有的配置保存逻辑

### Requirement: 每日积分模式 Tab
系统 SHALL 提供每日积分模式的配置和操作界面。

#### Scenario: 配置项显示
- **WHEN** 用户切换到"每日积分模式" Tab
- **THEN** 显示以下配置项：
  - 知识链接（Input）
  - 贡献积分获取上限（Input，默认 300）
  - 互动积分获取上限（Input，默认 100）
- **AND** 显示"开始"按钮

#### Scenario: 开始按钮点击
- **WHEN** 用户点击"开始"按钮
- **THEN** 弹出悬浮框显示积分进度
- **AND** 开始执行每日积分任务

### Requirement: 积分进度悬浮框
系统 SHALL 提供独立的悬浮框组件显示积分进度。

#### Scenario: 悬浮框显示
- **WHEN** 用户点击"开始"按钮
- **THEN** 显示悬浮框组件
- **AND** 悬浮框内容独立于 popup.html
- **AND** 显示三种积分的进度条：
  - 学习积分进度（默认上限 100）
  - 贡献积分进度（使用配置的上限）
  - 互动积分进度（使用配置的上限）
- **AND** 显示"结束"按钮

#### Scenario: 进度实时更新
- **WHEN** 积分任务执行中
- **THEN** 进度条实时更新
- **AND** 显示当前积分/上限积分

#### Scenario: 结束按钮点击
- **WHEN** 用户点击"结束"按钮
- **THEN** 停止积分任务
- **AND** 关闭悬浮框

### Requirement: 配置项扩展
系统 SHALL 在 config.ts 中新增每日积分模式相关配置。

#### Scenario: 新增配置项
- **WHEN** 系统初始化配置
- **THEN** 包含以下新配置项：
  - `knowledge_page_url`: 知识页面链接
  - `contribution_points_limit`: 贡献积分获取上限
  - `interaction_points_limit`: 互动积分获取上限

## MODIFIED Requirements

### Requirement: Popup Vue 实例
Popup Vue 实例 SHALL 使用 Vue 3 Composition API 重构。

#### Scenario: 迁移到 Composition API
- **WHEN** 重构 popup.ts
- **THEN** 使用 `createApp` 替代 `new Vue`
- **AND** 使用 `ref`、`reactive` 等响应式 API
- **AND** 保持原有的配置读写逻辑

## REMOVED Requirements
无
