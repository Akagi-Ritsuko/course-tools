# API 接口文档

**项目名称**：course-tools zsgl 模块
**作者**：李荣起
**日期**：2026-09-15
**版本**：1.26.915.699
**生成范围**：全部 7 套
**文档语言**：中文

## 变更日志

| 版本 | 日期 | 作者 | 变更内容 |
|------|------|------|----------|
| 1.26.915.699 | 2026-09-15 | 李荣起 | 初始版本 |

---

本文档分两部分：**A. 平台 HTTP 接口**（zsgl 模块依赖/消费的服务端接口）与 **B. 扩展内部接口**（模块对外提供/依赖的消息与生命周期契约）。

# A. 平台 HTTP 接口

通用约定：

- 基础域名：`https://zsgl.lzlj.com`；每日积分/考试 API 基础路径 `/learn/app/clientapi`。
- 通用参数：`os=99`（appDevicePlatform，PC 端标识）、`sid`（会话 ID，取自 localStorage/Cookie `sessionInfo`）。
- 拦截类接口（A1-A5）由平台页面自身发起，模块通过 XHR Hook 只读响应，不修改请求。
- 主动类接口（A6-A11）由模块 fetch 发起，考试类需携带 `headerMap` 签名头。
- 统一响应包：`{"code": string|number, "message": string, "body": any, "file": any, "user": any}`；`code === "0"/0` 为成功，`"-4"` 为会话过期。

## A1 查询课程详情（拦截）

| 项 | 说明 |
|----|------|
| 接口 | `queryCourseDetail.do`（平台页面发起） |
| 方式 | XHR Hook 读取（hookHttpRequest） |
| 触发时机 | 进入 `#/home/courseDetail/{courseId}` 页面加载时 |
| 调用方 | ZsglCourse.hookCourseDetailRequests |

**响应关键字段**：

```jsonc
{
  "body": {
    "courseId": "COURSE123",
    "courseFileArr": [
      {
        "fileName": "第一章 视频导学",   // 任务名，DOM 定位锚点
        "cwType": "video",              // video|scorm|knowledge|document|audio|URL
        "hasLearned": "0",              // "0" 未学，"1" 已学
        "playTime": 621,                // 应学时长（秒），knowledge 类型使用
        "learnedDuration": 120          // 已学时长（秒）
      }
    ]
  }
}
```

**异常场景**：响应非 JSON → Hook 解析失败告警，任务清单为空 → `courseTaskComplete` 触发（视为完成/跳过）。

## A2 查询学习地图关卡（拦截）

| 项 | 说明 |
|----|------|
| 接口 | `queryStudymapGate.do` |
| 方式 | XHR Hook |
| 调用方 | ZsglStudyMap.hookStudymapGateRequests |

**响应**：`body` 为关卡数组：

```jsonc
[
  {
    "gateName": "第一关",
    "status": 0,                 // 3 表示已完成（skip_elective 过滤依据）
    "finishTaskNum": 2,          // 已完成子任务数
    "taskNum": 5,                // 子任务总数
    "studymapGateId": "G001"     // 关卡 ID，与 A3 请求参数比对
  }
]
```

## A3 查询关卡任务（拦截）

| 项 | 说明 |
|----|------|
| 接口 | `queryStudymapGateTask.do?studymapGateId={gateId}` |
| 方式 | XHR Hook（校验请求参数 studymapGateId 与当前关卡一致） |
| 调用方 | ZsglStudyMap.hookStudymapGateTaskRequests |

**响应**：`body.taskList` 数组：

```jsonc
[
  {
    "taskName": "1.1 课程导学",
    "resourceType": 0,    // 2 表示考试（不自动执行）
    "resourceId": "R001", // 用作 localStorage 键尾缀
    "status": 0           // 1 表示已完成
  }
]
```

## A4 查询考试题目详情（拦截 + 解密）

| 项 | 说明 |
|----|------|
| 接口 | `queryQuestionDetail.do` |
| 方式 | XHR Hook + AES-CBC 解密（密钥/IV：constants.AES_CONFIG，PKCS7） |
| 解密后结构 | `JSON.parse(decrypted).body` 为**JSON 字符串**，需再 `JSON.parse` |
| 调用方 | ZsglExam.hookQuestionDetailRequests |

**解密后 body 结构**（字符串，二次解析后）：

```jsonc
[
  {
    "questionId": "Q1",
    "questionText": "<p>以下说法正确的是？</p>",
    "questionType": "S",            // S 单选 | M 多选 | T 判断（非法值默认 S）
    "sectionRespList": [
      { "sectionId": "A", "sectionText": "选项A", "isCorrect": "Y" }  // Y 正确
    ]
  }
]
```

**异常场景**：解密失败（密钥/IV 失配、密文变更）→ 记录错误并返回 null，题目列表为空，页面进入"无答案自动破解"分支的前提判定依赖此数据。

## A5 查询新考试试卷（拦截 + 解密）

| 项 | 说明 |
|----|------|
| 接口 | `queryNewExamPaper.do` |
| 方式 | XHR Hook + AES 解密 |
| 调用方 | ZsglExam.hookQueryNewExamPaper |

**解密后 body**：

```jsonc
{
  "examId": "E001",
  "attemptId": "T001",
  "testNo": "N001",
  "questionIdList": ["Q1", "Q2"]
}
```

四字段齐备才算获取成功；作为 A9/A10 答题接口的必填参数。

## A6 课程列表（主动请求）

| 项 | 说明 |
|----|------|
| 接口 | `GET /learn/app/clientapi/course/courselist.do` |
| Query | `curPage`（页码，1 起）、`numPerPage=30`、`sortType=2`、`ver=3.8.2`、`sid`、`os=99` |
| 调用方 | ZsglDailyPoints.fetchCourseListWithPage |

**响应**：`body.courseArr: [{courseId, courseName, isCompleted, ...}]`（`isCompleted` 为 `0|"0"` 表示未完成），`body.totalPage` 总页数。

**异常场景**：`response.body.courseArr` 缺失 → 记录错误并终止本轮课程刷取。

## A7 知识阅读（主动请求）

| 项 | 说明 |
|----|------|
| 接口 | `GET /learn/app/clientapi/knowledgecloud/page/details.do` |
| Query | `pageId`（知识页 ID）、`sid`、`os=99` |
| 调用方 | ZsglDailyPoints.fetchKnowledgeRead（贡献积分任务，成功一次按 +0.6 估算） |

## A8 知识分享（主动请求）

| 项 | 说明 |
|----|------|
| 接口 | `GET /learn/app/clientapi/knowledge/cloud/page/like/isShareOut.do` |
| Query | `pageId`、`shareOutType=""`、`sid`、`os=99` |
| 调用方 | ZsglDailyPoints.fetchKnowledgeShare（互动积分任务，成功一次按 +0.6 估算） |

## A9 提交题目答案（主动请求，需签名）

| 项 | 说明 |
|----|------|
| 接口 | `POST /learn/app/clientapi/exam/new/submitQuestionAnswer.do` |
| Content-Type | `application/json;charset=UTF-8` |
| 请求头 | `sid`、`headerMap`（签名，见 A.12）、`appDevicePlatform: 99` |
| 调用方 | SingleChoiceAnswerStrategy / MultipleChoiceAnswerStrategy |

**请求体**（支持数组批量）：

```jsonc
[
  {
    "attemptId": "T001",
    "examId": "E001",
    "testNo": "N001",
    "answerList": ["A"],          // 单选：一个选项 ID；多选：选项数组
    "questionId": "Q1",
    "questionNodesAnswer": [],
    "images": []
  }
]
```

**响应**：统一响应包，`code !== "0"` 时中断批量流程。

## A10 查询答题结果（主动请求，需签名）

| 项 | 说明 |
|----|------|
| 接口 | `GET /learn/app/clientapi/exam/new/queryQuestionAnswer.do` |
| Query | `examId`、`attemptId`、`sid`、`os=99` |
| 响应 body | `[{questionId, isCorrect: "Y"|"N", ...}]` |

**用途**：与 A9 配合实现排除法——提交后查询判分结果，`isCorrect:"Y"` 锁定答案，否则排除该选项。

## A11 积分详情（主动请求）

| 项 | 说明 |
|----|------|
| 接口 | `POST /learn/app/clientapi/personal/statistics/queryUserPointPercent.do` |
| Query | `os=99`、`sid` |
| Body | `{"startTime":"2026-09-01","endTime":"2026-09-30"}`（当月起止日，`yyyy-MM-dd`） |
| 响应 body | `[{ruleId, ruleName, rate, userPoint}]` |

**ruleId 语义映射**（updatePointsStateFromApi）：

| ruleId | 归属 |
|--------|------|
| `knowledge_read_point` | 贡献积分（直接覆盖） |
| `knowledge_shared` + `knowledge_sharing` | 互动积分（后者累加） |
| `46EA49C2D06E49BD9C59F21B94687D59`、`24E2D4D119E74B76AC349FA12A0B646C` | 学习积分（累加） |

## A.12 签名规范 headerMap

所有主动考试请求需携带 `headerMap` 请求头（JSON 字符串）：

```jsonc
{
  "appId": "com.mlearning.paznluzhoulaojiao",
  "nonce": "<md5(timestamp+random36)>",
  "sign": "<md5(signKey + appDevicePlatform + nonce + timestamp + sortedParams)>",
  "timestamp": 1769900000000,
  "appDevicePlatform": "99"
}
```

签名细节（exam-utils.ts）：

1. `signKey`：测试环境（host 含 `api-stg/test/stg/localhost/zsgltest/127.0.0.1/.w-stg1.zhi-niao.com/custom-stg1.zhi-niao.com`）使用 `com.mlearning.paznluzhoulaojiao`；正式环境使用 `ERZF2pSLHBxyZE6t`。
2. 参数拼接：URL query 与请求体合并后按 key 字典序排序，逐项 `key + valueStr`（数组逐元素 JSON 串；null/undefined 记空串）。
3. 请求头另附 `sid`（内存 → cookie `sessionInfo`），`code === "-4"` 时清除两处并需重新登录。

# B. 扩展内部接口

## B1 Chrome 扩展消息（"zsgl-tools" 通道）

`NewChromeServerMessage("zsgl-tools")`（前后台消息总线）：

| type | 方向 | 载荷 | 行为 |
|------|------|------|------|
| `zsgl_task_{resourceId}` | 课程页 → 后台 → 地图页 | 任务完成信息 | ZsglStudyMap 收到后 `window.location.reload()` 进入下一关 |

## B2 window.postMessage 协议（每日积分面板 ↔ ZsglDailyPoints）

| type | 方向 | 载荷 | 行为 |
|------|------|------|------|
| `CONFIRM_START_TASK` | 面板 → 任务 | `{learningLimit, contributionLimit, interactionLimit, taskDelay(秒), knowledgeLink}` | 更新目标/延迟/知识页链接后启动任务 |
| `REFRESH_POINTS` | 面板 → 任务 | 无 | 重取积分详情并回推 POINTS_UPDATED |
| `STOP_DAILY_POINTS` | 面板 → 任务 | 无 | stopTask()（清定时器/监听/中止请求） |
| `POINTS_UPDATED` | 任务 → 面板 | `{learning, contribution, interaction}` | 刷新面板进度 |
| `TASK_STOPPED` | 任务 → 面板 | 无 | 面板复位 |

## B3 localStorage 信号契约（跨页）

| 信号键 | 生产者 → 消费者 | 值 |
|--------|------------------|-----|
| `zsgl_task_{id}` | studyMap.Start → 课程页 studyMap 监听 | `{status:"started", expire}`；完成态 `{status:"finished", expire}` |
| `zsgl_daily_task_{id}` | dailyPoints → 课程页 → dailyPoints | 同上 |
| `zsgl_video_complete_{courseId}_{jobIndex}` | video/scorm → dailyPoints | `{status:"finished", courseId, taskId, timestamp}` |
| `zsgl_close_course_{courseId}` | dailyPoints → 课程页 | `{status:"close", courseId, timestamp}` |

消费规则：`storage` 事件优先，轮询（3s/5s）兜底；处理成功即删除键，防止重复消费。

## B4 任务生命周期接口（宿主内核契约）

zsgl 各任务类对内核暴露的标准接口（`Task` / `MoocTaskSet`）：

| 方法 | 语义 | zsgl 实现要点 |
|------|------|---------------|
| `Init()` | 页面就绪后初始化（注册 Hook、DOM 探测） | 多数实现为轮询探测，失败 reject |
| `Start()` | 启动自动化 | video/scorm/knowledge 含点击模拟；studyMap 写 started 信号 |
| `Next(): Task` | 任务集返回下一任务 | 越界时发布完成事件（courseTaskComplete / examTaskComplete） |
| `Submit()` | 任务提交 | 默认空实现（Launcher 在 taskComplete 后按 interval 延迟调用） |
| `Stop()` | 停止并释放资源 | 统一 `timerManager.clearAll()` + 移除监听 |
| `Done()` | 是否已完成 | 基于 done 标志 / studyMapData 为空 / 积分全满 |
| `Type()` | 任务类型标识 | video/audio/knowledge/exam/studyMap/dailyPoints |

## B5 配置项接口

配置经 `Application.App.config`（`zsgl_` 命名空间）读写，键清单见《04-数据库设计》§2.1。运行时可写配置：`auto`（挂机开关，控制栏切换）、`skip_elective`、`daily_points_target` 等；只读配置：`video_mute`、`video_multiple`、`interval` 等（由扩展配置面板管理）。
