# Tasks

- [ ] Task 1: 增强 HTTP 拦截器，拦截 queryNewExamPaper 接口
  - [ ] SubTask 1.1: 在 exam.ts 中添加 queryNewExamPaper 拦截逻辑
  - [ ] SubTask 1.2: 提取并存储 attemptId、testNo、questionIdList
  - [ ] SubTask 1.3: 添加实例变量保存拦截数据

- [ ] Task 2: 实现请求构造工具函数
  - [ ] SubTask 2.1: 创建 sid 获取函数
    - 从 Cookie 或内存获取 sid
    - 参考 queryQuestionAnswer.md 的实现逻辑
  - [ ] SubTask 2.2: 创建 headerMap 生成函数
    - 生成 appId, nonce, sign, timestamp, appDevicePlatform
    - 实现签名算法
  - [ ] SubTask 2.3: 创建通用 HTTP 请求发送函数
    - 支持配置 URL、method、params、headers、body
    - 处理响应和错误

- [ ] Task 3: 实现 submitQuestionAnswer 请求构造
  - [ ] SubTask 3.1: 构造请求 URL 和查询参数
    - URL: `/learn/app/clientapi/exam/new/submitQuestionAnswer.do`
    - 添加 `os=99` 和 `sid` 参数
  - [ ] SubTask 3.2: 构造请求 Headers
    - Content-Type: application/json;charset=UTF-8
    - appDevicePlatform: 99
    - headerMap JSON 字符串
    - sid header
  - [ ] SubTask 3.3: 构造请求 Body
    - 数组格式，每道题一个对象
    - 包含 attemptId, examId, testNo, answerList, questionId, questionNodesAnswer, images
  - [ ] SubTask 3.4: 实现批量提交函数
    - 支持一次提交多道题的答案
    - 处理响应结果

- [ ] Task 4: 实现 queryQuestionAnswer 请求构造
  - [ ] SubTask 4.1: 构造请求 URL 和查询参数
    - URL: `/learn/app/clientapi/exam/new/queryQuestionAnswer.do`
    - 添加 examId, attemptId, sid, os 参数
  - [ ] SubTask 4.2: 构造请求 Headers
    - appDevicePlatform: 99
    - headerMap JSON 字符串
  - [ ] SubTask 4.3: 实现查询结果函数
    - 发送 GET 请求
    - 解析响应获取每道题的 isCorrect 状态

- [ ] Task 5: 实现单选题批量答题策略
  - [ ] SubTask 5.1: 创建单选题答题状态管理
    - 记录每题已测试的选项
    - 记录每题已确定的答案
  - [ ] SubTask 5.2: 实现批量排除法逻辑
    - 第一轮：所有题目填第一个选项
    - 第二轮：未确定题目填第二个选项
    - 第三轮：未确定题目填第三个选项
    - 第四轮：未确定题目填第四个选项
  - [ ] SubTask 5.3: 实现批量提交和查询循环
    - 每轮批量提交答案
    - 查询结果判断正确性
    - 更新题目状态

- [ ] Task 6: 实现多选题批量答题策略
  - [ ] SubTask 6.1: 创建多选题答题状态管理
    - 记录已确定的正确选项
    - 记录已确定的错误选项
  - [ ] SubTask 6.2: 实现逐选项测试逻辑
    - 第一阶段：逐个测试每个选项（A/B/C/D）
    - 每轮批量提交并查询结果
  - [ ] SubTask 6.3: 实现组合验证逻辑
    - 第二阶段：组合已确定的正确选项
    - 批量验证组合是否完整正确

- [ ] Task 7: 改造 exam.ts 主流程
  - [ ] SubTask 7.1: 在 hookQuestionDetailRequests 中添加判断逻辑
    - 检查解密数据是否有 isCorrect 字段
    - 如果有，继续现有流程
    - 如果没有，启动自动答题流程
  - [ ] SubTask 7.2: 集成自动答题函数
    - 判断题目类型（单选/多选）
    - 分别调用对应答题策略
    - 完成后更新 questionList
  - [ ] SubTask 7.3: 添加自动答题进度日志
    - 记录每轮答题进度
    - 记录找到的答案数量
    - 记录总用时

- [ ] Task 8: 实现题目数据适配逻辑
  - [ ] SubTask 8.1: 从 questionDetail 解密数据提取题目信息
    - 提取 questionId, questionType, sectionRespList
  - [ ] SubTask 8.2: 处理题目类型判断
    - "S"：单选题
    - "M"：多选题
    - "T"：判断题（类似单选）
  - [ ] SubTask 8.3: 处理选项数据
    - 提取 sectionId 用于提交答案
    - 提取 sectionText 用于显示

- [ ] Task 9: 测试和验证
  - [ ] SubTask 9.1: 测试单选题自动答题
    - 模拟 20 题单选题
    - 验证最多 4 轮找到所有答案
    - 验证接口调用次数 ≤ 8 次
  - [ ] SubTask 9.2: 测试多选题自动答题
    - 模拟 10 题多选题
    - 验证逐选项测试逻辑
    - 验证组合验证逻辑
  - [ ] SubTask 9.3: 测试混合题型
    - 模拟单选 + 多选混合场景
    - 验证批量处理效果
    - 验证总用时和接口调用次数

# Task Dependencies
- Task 2 依赖于 Task 1（需要 attemptId）
- Task 3 和 Task 4 依赖于 Task 2（需要请求构造工具）
- Task 5 和 Task 6 依赖于 Task 3 和 Task 4（需要提交和查询函数）
- Task 7 依赖于 Task 5、Task 6 和 Task 8（需要答题策略和数据适配）
- Task 9 依赖于所有前置任务完成

# Parallel Work
- Task 1、Task 8 可以并行执行
- Task 2 可以在 Task 1 完成后立即开始
- Task 3 和 Task 4 可以并行执行（都依赖 Task 2）
- Task 5 和 Task 6 可以并行执行（都依赖 Task 3、Task 4）
- Task 7 需要等待 Task 5、Task 6、Task 8 都完成
- Task 9 最后执行验证