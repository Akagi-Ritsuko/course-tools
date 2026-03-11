# Checklist

- [x] types.ts 中 TaskInfo 接口添加了 playTime 属性（秒）
- [x] types.ts 中 TaskInfo 接口添加了 learnedDuration 属性（毫秒）
- [x] knowledge.ts 文件创建成功
- [x] ZsglKnowledge 类正确继承 ZsglTask
- [x] Init() 方法正确查找任务元素
- [x] Start() 方法正确执行任务流程
- [x] waitForStartButton() 方法正确等待并点击"立即学习"按钮
- [x] waitForIframeLoad() 方法正确等待 iframe 加载
- [x] calculateRemainingTime() 方法正确计算剩余学习时长
- [x] waitAndExit() 方法正确等待剩余时长后退出
- [x] Type() 方法返回 "knowledge"
- [x] Stop() 方法正确清理定时器
- [x] factory.ts 正确导入 ZsglKnowledge
- [x] factory.ts 正确注册 knowledge case
- [x] TODO.md 已更新当前进度
- [x] TODO.md 已添加待做：学习地图中的 knowledge 类型支持
- [x] TODO.md 已添加待做：iframe 加载判断优化
- [x] 代码编译无错误
