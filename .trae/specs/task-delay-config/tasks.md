# Tasks

- [x] Task 1: 更新接口定义和类型
  - [x] SubTask 1.1: 在 `dailyPointsPanel.ts` 的 `PointsProgressData` 接口中添加 `taskDelay` 字段
  - [x] SubTask 1.2: 更新 `start` 方法中读取 `taskDelay` 配置

- [x] Task 2: 添加配置项 UI
  - [x] SubTask 2.1: 在 `DailyPointsConfig.vue` 中添加任务延迟输入框
  - [x] SubTask 2.2: 添加 tips 说明文字："实际延迟 = 配置值 ± 5秒，最小为 0，为 0 则不等待"
  - [x] SubTask 2.3: 设置默认值为 8 秒
  - [x] SubTask 2.4: 更新 `DailyPointsConfig` 接口和 emit 数据

- [x] Task 3: 实现延迟逻辑
  - [x] SubTask 3.1: 在 `dailyPoints.ts` 中接收 `taskDelay` 配置
  - [x] SubTask 3.2: 创建 `getRandomDelay` 方法实现延迟计算逻辑（配置值 ± 5秒，最小为 0）
  - [x] SubTask 3.3: 修改 `executeKnowledgeReadTask` 中的延迟逻辑，使用配置项
  - [x] SubTask 3.4: 修改 `executeKnowledgeShareTask` 中的延迟逻辑，使用配置项
  - [x] SubTask 3.5: 当延迟为 0 时跳过 sleep 调用

# Task Dependencies
- Task 2 依赖 Task 1（接口定义需要先更新）
- Task 3 依赖 Task 1（接口定义需要先更新）
- Task 2 和 Task 3 可以并行执行
