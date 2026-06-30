# queryQuestionAnswer.do 接口逻辑梳理

## 1. 接口基本信息

### 1.1 接口定义位置
- 文件：`main.6777c334.deobfuscated.js`
- 模块ID：7935
- 行号：21469-21473

### 1.2 接口定义
```javascript
queryQuestionAnswer: function(e, t) {
    return s.Z.get("".concat(c.TQ, "/exam/new/queryQuestionAnswer.do"), {
        examId: e,
        attemptId: t
    })
}
```

### 1.3 接口完整路径
- 基础路径：`c.TQ = "/learn/app/clientapi"` (模块 63468，行号 3505)
- 完整URL：`/learn/app/clientapi/exam/new/queryQuestionAnswer.do`

### 1.4 请求方法
- GET请求

---

## 2. 接口参数

### 2.1 必需参数
| 参数名 | 类型 | 说明 |
|--------|------|------|
| examId | String/Number | 考试ID |
| attemptId | String/Number | 考试尝试ID（答题记录ID） |

### 2.2 自动添加的参数
| 参数名 | 来源 | 说明 |
|--------|------|------|
| sid | _.Z.getSid() | 会话ID，用于身份验证 |
| appDevicePlatform | u.dM.STR_OS = "99" | 设备平台标识 |

---

## 3. 参数获取流程

### 3.1 examId 获取流程
examId 需要从以下可能的途径获取：
1. **考试列表接口**：
   - `getMyNewExamList()` - 获取我的考试列表
   - `getPublicNewExamList()` - 获取公共考试列表
   
2. **考试详情接口**：
   - `getNewExamDetails(testId)` - 获取考试详情
   
3. **考试报名接口**：
   - `submitExamEnroll(examId)` - 提交考试报名
   
4. **从URL或其他上下文获取**：
   - 可能从路由参数中获取
   - 可能从页面状态中获取

### 3.2 attemptId 获取流程
attemptId 通常在以下场景中生成和获取：

1. **开始考试时生成**：
   - 通过 `submitNewExamPaper()` 提交考试时可能会返回 attemptId
   
2. **从考试时间查询接口获取**：
   - `getExamTime(examId, attemptId)` - 查询考试剩余时间时需要
   
3. **查询错题列表时获取**：
   - `queryErrorQuestionListByAttemptId(examId, attemptId)` - 需要attemptId
   
4. **人脸识别相关接口**：
   - `faceRecognition(attemptId, examId, faceImage)` - 人脸识别需要attemptId
   - `faceCollectBackUp(attemptId, examId, faceImage, sort)` - 人脸采集备份需要

**可能的来源**：
- 考试开始后服务端返回的答题记录ID
- 保存在页面状态或localStorage中
- 从路由参数或URL中获取

### 3.3 sid 获取流程

#### getSid() 方法实现 (模块 18041，行号 27270-27277)
```javascript
getSid: function() {
    if (!this.sid) {
        var e = (B().get("sessionInfo") || {}).sid;
        return void 0 === e ? "" : e
    }
    return this.sid
}
```

#### sid 的来源：
1. **登录时设置**：
   - 调用 `updateLoginInfo(enterpriseId, enterpriseName, sid, userId, appId)` 方法
   
2. **存储位置**：
   - Cookie: `sessionInfo` 对象中的 `sid` 字段
   - sessionStorage: `__zn__sid`
   - 内存: `_.Z.sid` 属性
   
3. **获取流程**：
   ```
   优先从内存获取 (_.Z.sid)
   ↓
   如果不存在，从Cookie获取 (sessionInfo.sid)
   ↓
   如果都不存在，返回空字符串
   ```

### 3.4 appDevicePlatform 获取流程
- 来源：模块 63468 的 `dM.STR_OS` 属性 (行号 3494)
- 值：`"99"` (表示Web平台)
- 定义位置：
```javascript
var a = {
    CHANNEL: "web",
    V: "2",
    VER: "3.8.2",
    STR_VER: "3.8.2",
    STR_OS: "99",  // <-- appDevicePlatform值来源
    SOURCE_TYPE: 7,
    STR_OS_DATA: "33",
    VER_DATA: "4.1.8",
    API_PREFIX: "/learn/app",
    TERMINAL_CHANNEL: 3,
    trainClassInfoVer: "7.2.2"
};
```

---

## 4. HTTP请求封装逻辑

### 4.1 s.Z.get 方法实现 (模块 71254，行号 24576-24588)
```javascript
get: function(e, t) {
    var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
        r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};
    return new Promise((function(l, c) {
        var _ = (0, i.Z)((0, i.Z)({
            sid: a.Z.getSid(),
            appDevicePlatform: s.dM.STR_OS
        }, n.headers), r);
        u(o.Z.get("".concat(m(e)).concat(e), {
            params: t,
            headers: _
        }), l, c, n)
    }))
}
```

### 4.2 请求处理逻辑
1. **自动添加headers**：
   - `sid`: 会话ID
   - `appDevicePlatform`: 设备平台标识
   
2. **路径处理**：
   - 如果URL不以"http"、"//"或"/learn/app/"开头，会自动添加"/learn/app/"前缀
   
3. **响应处理**：
   - 检查 `code === 0` 表示成功
   - `code === -4` 表示会话过期
   - 其他错误会显示错误消息

---

## 5. 相关接口群

### 5.1 考试相关接口 (模块 7935)
```javascript
// 获取考试列表
getMyNewExamList(testType, pageNo)
getPublicNewExamList(testType, pageNo)

// 获取考试详情
getNewExamBreakInfo(testId)
getNewExamDetails(testId)

// 获取考试试卷
getExamPaper(examId)
queryNewExamPaper(examId)

// 提交考试
submitExamPaper()
submitNewExamPaper(params)
submitExamEnroll(examId)

// 查询成绩和答案
queryNewHighestScore(examId)
queryNewHistoryScore(examId)
queryQuestionAnswer(examId, attemptId)  // <-- 本接口
queryQuestionDetail(examId, questionIds, questionNodeIds)

// 查询考试时间
getExamTime(examId, attemptId)

// 错题相关
queryErrorQuestionListByAttemptId(examId, attemptId)
queryErrorQuestionListByExamId(examId)

// 人脸识别相关
faceRecognition(attemptId, examId, faceImage)
faceCollectBackUp(attemptId, examId, faceImage, sort)

// 提交答题
submitQuestionAnswer(params)
submitQuestionAnswerNext(params)

// 查询证书
queryExamCertificate(examId)
```

---

## 6. 调用示例

### 6.1 推荐调用流程
```javascript
// 1. 首先获取考试列表，拿到 examId
const examList = await API.getMyNewExamList(testType, pageNo);

// 2. 开始考试，可能会返回 attemptId
const examPaper = await API.queryNewExamPaper(examId);

// 3. 查询答题答案
const answer = await API.queryQuestionAnswer(examId, attemptId);
```

### 6.2 完整请求示例
```javascript
// 请求URL
GET /learn/app/clientapi/exam/new/queryQuestionAnswer.do

// 请求参数
{
    examId: "123456",
    attemptId: "789012",
    sid: "xxxxx",              // 自动添加
    appDevicePlatform: "99"    // 自动添加
}

// Headers
{
    sid: "xxxxx",
    appDevicePlatform: "99"
}
```

---

## 7. 注意事项

1. **attemptId 必须有效**：
   - attemptId 是答题记录ID，需要先通过开始考试等接口获取
   
2. **sid 必须有效**：
   - 如果会话过期（code=-4），需要重新登录
   
3. **接口用途**：
   - 用于查询某次考试答题的答案详情
   - 通常在考试结束后或查看历史记录时调用
   
4. **权限验证**：
   - 通过 sid 验证用户身份
   - 只能查询自己参加过的考试答案

   ``` curl
   curl 'https://zsgl.lzlj.com/learn-login/getSafeImgCaptcha.do?userName=18781593889&r=0.37335231771915056' \
  -H 'Accept: image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8' \
  -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -b 'linktokenprod=crm_5db356c7-a1d0-46fa-9498-ab4c5a5f4b4b; acw_tc=707c9f7117828001912106809e478ad583a24dd129d92fda5719a1530244a6' \
  -H 'Pragma: no-cache' \
  -H 'Referer: https://zsgl.lzlj.com/znWeb/znPortal/' \
  -H 'Sec-Fetch-Dest: image' \
  -H 'Sec-Fetch-Mode: no-cors' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0' \
  -H 'sec-ch-ua: "Microsoft Edge";v="149", "Chromium";v="149", "Not)A;Brand";v="24"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Windows"'
   ``` 