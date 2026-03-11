# Checklist

## webpack 5 升级（适配 Node.js 22）
- [x] webpack 已从 4.x 升级到 5.x
- [x] webpack-cli 已升级到兼容版本
- [x] html-webpack-plugin 已升级到兼容版本
- [x] ts-loader 已升级到兼容版本
- [x] css-loader 和 style-loader 已升级到兼容版本
- [x] webpack.config.js 配置格式已更新（移除废弃选项）
- [x] 构建流程在 Node.js 22 下正常工作

## Vue 升级和构建配置
- [x] Vue 版本已从 2.x 升级到 3.x
- [x] webpack.config.js 已更新 Vue 别名配置
- [x] @vue/compiler-sfc 已安装
- [x] 构建流程正常工作

## Tailwind CSS 配置
- [x] tailwindcss、postcss、autoprefixer 已安装
- [x] tailwind.config.js 配置文件已创建
- [x] postcss.config.js 配置文件已创建
- [x] webpack.config.js 已添加 PostCSS loader
- [x] 全局 CSS 文件已创建并引入 Tailwind 指令

## shadcn-vue 配置
- [x] shadcn-vue 核心依赖已安装
- [x] lucide-vue-next 图标库已安装
- [x] src/lib/utils.ts 工具函数文件已创建
- [x] tsconfig.json 已添加路径别名

## shadcn-vue 组件
- [x] src/components/ui/ 目录结构已创建
- [x] Button 组件已添加
- [x] Input 组件已添加
- [x] Tabs 组件已添加
- [x] Progress 组件已添加
- [x] Card 组件已添加
- [x] Label 组件已添加
- [x] Dialog 组件已添加

## 每日积分配置组件
- [x] DailyPointsConfig.vue 组件已创建
- [x] 知识链接输入框已实现
- [x] 贡献积分上限输入框已实现
- [x] 互动积分上限输入框已实现
- [x] "开始"按钮及点击事件已实现

## 积分进度悬浮框组件
- [x] PointsProgressDialog.vue 组件已创建
- [x] 学习积分进度条已实现
- [x] 贡献积分进度条已实现
- [x] 互动积分进度条已实现
- [x] "结束"按钮及事件处理已实现

## popup 重构
- [x] popup.html 已使用新组件结构重构
- [x] popup.ts 已迁移到 Vue 3 Composition API
- [x] Tabs 组件已集成实现平台切换
- [x] "每日积分"标签页已添加
- [x] 现有配置功能正常工作

## 集成测试
- [x] popup 界面正常显示
- [x] 标签页切换功能正常
- [x] 每日积分配置保存功能正常
- [x] 悬浮框显示和交互正常
- [x] 进度条实时更新正常
- [x] 构建输出正确
