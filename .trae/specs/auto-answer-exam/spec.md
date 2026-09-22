# 自动答题功能 Spec

## Why
当前系统在解密题目数据时，如果题目数据中没有 `isCorrect` 字段（即不知道正确答案），无法自动完成答题。用户需要手动答题或使用外部工具查看答案。为了提高效率，需要实现一个基于批量提交策略的自动答题功能，通过暴力破解算法快速找到所有题目的正确答案。

## What Changes
- **改造 exam.ts 文件**：在解密数据中无 `isCorrect` 字段时，启动自动答题逻辑
- **新增请求构造工具函数**：实现 submitQuestionAnswer 和 queryQuestionAnswer 的请求构造和发送
- **新增批量答题策略函数**：基于批量排除法实现单选题和多选题的自动答题
- **拦截 queryNewExamPaper 接口**：获取 attemptId 用于答题请求
- **完善题目数据拦截**：从 questionDetail 解密数据中提取题目详情

## Impact
- Affected specs: `exam.ts` 考试模块
- Affected code:
  - `d:\workSpace\program\course-tools\src\mooc\zsgl\exam.ts`
  - 新增请求工具模块（可能在 `utils/utils.ts` 或新建文件）

## ADDED Requirements

### Requirement: 自动答题判断逻辑
系统 SHALL 在解密题目数据时判断是否存在 `isCorrect` 字段：
- 如果存在 `isCorrect` 字段，继续使用现有逻辑显示答案
- 如果不存在 `isCorrect` 字段，启动自动答题流程

#### Scenario: 题目有正确答案标记
- **WHEN** 解密后的题目数据中每个题目都有 `isCorrect` 字段
- **THEN** 系统继续使用现有逻辑，直接显示正确答案

#### Scenario: 题目无正确答案标记
- **WHEN** 解密后的题目数据中没有 `isCorrect` 字段
- **THEN** 系统启动自动答题流程，通过批量提交策略找到正确答案

### Requirement: 请求构造工具函数
系统 SHALL 提供通用的 HTTP 请求构造和发送函数：

#### Sub-Requirement: submitQuestionAnswer 请求构造
系统 SHALL 构造 submitQuestionAnswer.do 接口请求：
- 请求 URL：`/learn/app/clientapi/exam/new/submitQuestionAnswer.do`
- 请求方法：POST
- 请求参数：
  - `os`：固定值 "99"（Web平台）
  - `sid`：从 Cookie 或内存获取
- 请求 Headers：
  - `Content-Type: application/json;charset=UTF-8`
  - `appDevicePlatform: 99`
  - `headerMap`：包含 appId, nonce, sign, timestamp, appDevicePlatform
- 请求 Body：
  - 数组格式，每个元素包含：
    - `attemptId`：从 queryNewExamPaper 拦截获取
    - `examId`：考试ID
    - `testNo`：测试编号
    - `answerList`：答案选项ID数组
    - `questionId`：题目ID
    - `questionNodesAnswer`：题目节点答案数组
    - `images`：图片数组

#### Sub-Requirement: queryQuestionAnswer 请求构造
系统 SHALL 构造 queryQuestionAnswer.do 接口请求：
- 请求 URL：`/learn/app/clientapi/exam/new/queryQuestionAnswer.do`
- 请求方法：GET
- 请求参数：
  - `examId`：考试ID
  - `attemptId`：答题记录ID
  - `sid`：会话ID
  - `os`：固定值 "99"
- 请求 Headers：
  - `appDevicePlatform: 99`
  - `headerMap`：包含 appId, nonce, sign, timestamp, appDevicePlatform

#### Sub-Requirement: 参数获取逻辑
系统 SHALL 从以下来源获取必要参数：
- **sid 获取**：
  1. 优先从内存 `_.Z.sid` 获取
  2. 如果不存在，从 Cookie `sessionInfo.sid` 获取
  3. 如果都不存在，返回空字符串
- **attemptId 获取**：
  1. 拦截 `queryNewExamPaper.do` 接口响应
  2. 从响应 body 中提取 `attemptId` 字段
- **题目详情获取**：
  1. 拦截 `queryQuestionDetail.do` 接口响应
  2. 解密响应数据（AES CBC 模式，Pkcs7 填充）
  3. 从解密后的 JSON 中提取题目列表

### Requirement: 批量答题策略
系统 SHALL 实现基于批量提交的答题策略：

#### Sub-Requirement: 单选题答题策略
系统 SHALL 使用批量排除法处理单选题：
- **第一轮**：为所有题目填第一个选项，批量提交，查询结果
- **第二轮**：为未确定答案的题目填第二个选项，批量提交，查询结果
- **第三轮**：为未确定答案的题目填第三个选项，批量提交，查询结果
- **第四轮**：为未确定答案的题目填第四个选项，批量提交，查询结果
- 最多 4 轮即可找到所有单选题答案

#### Sub-Requirement: 多选题答题策略
系统 SHALL 使用逐选项测试法处理多选题：
- **第一阶段**：
  - 第一轮：所有题目测试选项A，批量提交
  - 第二轮：所有题目测试选项B，批量提交
  - 第三轮：所有题目测试选项C，批量提交
  - 第四轮：所有题目测试选项D，批量提交
- **第二阶段**：
  - 对已确定部分正确选项的题目进行组合验证
  - 批量提交组合答案，验证是否完全正确

#### Sub-Requirement: 批量处理优化
系统 SHALL 支持批量处理多道题目：
- 每次最多批量提交 100 道题的答案
- 减少 HTTP 请求次数，提高答题效率
- 目标：100 题最多 8-16 次接口调用

### Requirement: 题目数据结构适配
系统 SHALL 从解密后的 questionDetail 数据中提取以下信息：
- `questionId`：题目ID（用于提交答案）
- `questionType`：题目类型（"S" 单选，"M" 多选，"T" 判断题）
- `sectionRespList`：选项列表，每个选项包含：
  - `sectionId`：选项ID（用于提交答案）
  - `sectionText`：选项文本（用于显示）
  - `isCorrect`：是否正确（可能不存在）

#### Scenario: 数据提取成功
- **WHEN** 解密 questionDetail 成功且数据结构完整
- **THEN** 系统提取题目ID、类型、选项列表等信息用于答题

#### Scenario: 数据结构异常
- **WHEN** 解密后的数据缺少必要字段（如 questionId 或 sectionRespList）
- **THEN** 系统记录错误日志，跳过该题目

### Requirement: 拦截器增强
系统 SHALL 增强现有的 HTTP 拦截器：

#### Sub-Requirement: queryNewExamPaper 拦截
系统 SHALL 拦截 queryNewExamPaper.do 接口：
- 拦截时机：考试开始时
- 提取数据：`attemptId`, `testNo`, `questionIdList`
- 存储位置：保存到实例变量供后续使用

#### Sub-Requirement: questionDetail 拦截增强
系统 SHALL 增强 questionDetail 拦截：
- 现有逻辑：解密并存储题目列表
- 新增逻辑：判断是否有 `isCorrect` 字段，触发自动答题流程

## MODIFIED Requirements

### Requirement: exam.ts 主流程改造
**原需求**：解密题目数据后直接显示答案
**新需求**：解密题目数据后判断是否有 `isCorrect` 字段，根据情况选择显示答案或自动答题

#### Scenario: 自动答题流程启动
- **WHEN** 解密题目数据发现缺少 `isCorrect` 字段
- **THEN** 系统调用自动答题函数，通过批量策略找到所有答案
- **AND** 完成后显示找到的正确答案

## REMOVED Requirements
无移除的需求