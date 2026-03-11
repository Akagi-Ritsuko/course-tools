# Checklist

## Vue 3 升级和依赖
- [ ] package.json 中 Vue 版本已更新到 3.x
- [ ] shadcn-vue 相关依赖已安装（tailwindcss、radix-vue 等）
- [ ] webpack 配置已更新支持 Vue 3
- [ ] tailwind.config.js 已创建并配置
- [ ] postcss.config.js 已创建并配置

## Popup.ts 重构
- [ ] popup.ts 已迁移到 Vue 3 Composition API
- [ ] 使用 createApp 替代 new Vue
- [ ] 响应式数据使用 ref/reactive
- [ ] 配置读写逻辑正常工作

## Popup.html UI 重构
- [ ] tailwindcss 样式已引入
- [ ] shadcn-vue 组件目录结构已创建
- [ ] Tabs 组件已实现
- [ ] 头部样式已现代化
- [ ] 配置项使用 shadcn-vue 组件

## 每日积分模式配置项
- [ ] config.ts 中 knowledge_page_url 配置项已添加
- [ ] config.ts 中 contribution_points_limit 配置项已添加
- [ ] config.ts 中 interaction_points_limit 配置项已添加
- [ ] SystemConfig.config.zsgl.items 中新配置项已添加

## 每日积分模式 Tab 页面
- [ ] DailyPointsMode.vue 组件已创建
- [ ] 知识链接 Input 配置已实现
- [ ] 贡献积分上限 Input 配置已实现
- [ ] 互动积分上限 Input 配置已实现
- [ ] 开始按钮已实现

## 积分进度悬浮框
- [ ] PointsProgressModal.vue 组件已创建（独立文件）
- [ ] 学习积分进度条已实现
- [ ] 贡献积分进度条已实现
- [ ] 互动积分进度条已实现
- [ ] 结束按钮已实现
- [ ] 悬浮框显示/隐藏逻辑已实现

## 功能集成
- [ ] 开始按钮与 ZsglDailyPoints 类已连接
- [ ] 积分状态实时同步已实现
- [ ] 结束按钮停止任务逻辑已实现
- [ ] 悬浮框与 background.js 消息通信已实现

## 测试验证
- [ ] Vue 3 升级后 popup 功能正常
- [ ] 配置项读写功能正常
- [ ] 每日积分模式 Tab 显示正常
- [ ] 悬浮框显示和进度更新正常
- [ ] 开始/结束按钮功能正常
