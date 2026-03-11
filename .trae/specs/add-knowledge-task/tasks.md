# Tasks

- [x] Task 1: 修改 types.ts 添加新属性
  - [x] SubTask 1.1: 在 TaskInfo 接口中添加 playTime 属性（秒）
  - [x] SubTask 1.2: 在 TaskInfo 接口中添加 learnedDuration 属性（毫秒）

- [x] Task 2: 创建 knowledge.ts 任务模块
  - [x] SubTask 2.1: 创建 ZsglKnowledge 类继承 ZsglTask
  - [x] SubTask 2.2: 实现 Init() 方法：查找任务元素
  - [x] SubTask 2.3: 实现 Start() 方法：执行任务流程
  - [x] SubTask 2.4: 实现 waitForStartButton() 方法：等待并点击"立即学习"按钮
  - [x] SubTask 2.5: 实现 waitForIframeLoad() 方法：等待 iframe 加载
  - [x] SubTask 2.6: 实现 calculateRemainingTime() 方法：计算剩余学习时长
  - [x] SubTask 2.7: 实现 waitAndExit() 方法：等待剩余时长后点击退出
  - [x] SubTask 2.8: 实现 Type() 方法：返回 "knowledge"
  - [x] SubTask 2.9: 实现 Stop() 方法：清理定时器

- [x] Task 3: 修改 factory.ts 注册 knowledge 类型
  - [x] SubTask 3.1: 导入 ZsglKnowledge 类
  - [x] SubTask 3.2: 在 switch 中添加 knowledge case

- [x] Task 4: 更新 TODO.md 添加进度内容
  - [x] SubTask 4.1: 更新 knowledge 类型状态为"进行中"
  - [x] SubTask 4.2: 添加已完成子项（knowledge.ts 模块、时长计算、按钮点击、iframe 加载、等待退出）
  - [x] SubTask 4.3: 添加待做项：学习地图中的 knowledge 类型支持
  - [x] SubTask 4.4: 添加待做项：iframe 加载判断优化（跨域处理）

# Task Dependencies

- Task 2 依赖 Task 1（需要类型定义）
- Task 3 依赖 Task 2（需要类实现）
- Task 4 在 Task 2 完成后执行
