# 修复 zsgl 视频/SCORM 切窗弹窗、暂停死循环，并新增崩溃可恢复的日志捕获

## Summary

三个问题的根因与对策：

1. **切窗弹窗、任务终止**（问题1）：站点播放页在 `queryCourseDetail.do` 响应 `isOpenSwitchScreen: 1` 时，通过 **`window.onblur/onfocus/onresize` 属性赋值**安装切屏检测（deobfuscated.js L1832-1874），达到 `maxTimes` 后直接终止学习任务（L2367-2396）。现有 `setupEventPrevention` 只能阻止事件监听、`setupVisibilitySpoof` 只伪装 `document.hidden`，**都拦不住属性赋值式监听**。
   → 对策：① 用 `hookAndModifyHttpResponse` 把 `queryCourseDetail.do` 响应中的 `isOpenSwitchScreen`/`isOpenScreenShot` 改为 0；② 兜底用 `Object.defineProperty` 把 `window.onblur/onfocus/onresize` 的 setter 置为 no-op，让站点永远装不上检测。
2. **切窗/最小化后控制台循环打印、无法继续播放**（问题2）：站点每秒轮询 `queryStatus.do` 并反复 pause，我们的自动恢复反复点击播放，形成 1s 死循环；且每次 `play` 成功会 `resetPlayRetry()`，现有 `MAX_PLAY_RETRY` 熔断永不触发。
   → 对策：问题1修复后站点不再切窗暂停；另加"暂停风暴"熔断（60s 内 ≥8 次 pause → 停止自动恢复并输出明确日志），作为其它原因（如时长限制弹窗）导致暂停时的兜底。
3. **最高优先级——视频加载转圈、内存暴涨、浏览器崩溃后拿不到日志**（问题3）：
   → 对策：新增 **LogRecorder** 日志捕获：内存环形缓冲 + 定时落地 localStorage + 崩溃后下次启动自动导出；捕获 `window.onerror`/`unhandledrejection`。内存暴涨的站点侧根因（hls.js/DRM 重试）需先拿到日志再定位，本次先加防御性熔断。

## Current State Analysis

### 问题1/2 证据
- [1.json](file:///d:/workSpace/program/course-tools/src/mooc/zsgl/utils/1.json#L125-L130)：`queryCourseDetail.do` 响应体含 `isOpenSwitchScreen: 1`、`isOpenScreenShot: 1`
- deobfuscated.js L1832：`if (!P || P.isFlipScreen === u.iK.Open)` → L1838/1842/1874 安装 `window.onblur/onfocus/onresize`（属性赋值）；L2367-2396：超限后 `Wb(d)` 终止并清空处理器
- 日志 zsgl.lzlj.com-1789886185730.log L750-762：`Video paused → 点击播放 → Video playing → queryStatus` 每秒循环
- [video.ts](file:///d:/workSpace/program/course-tools/src/mooc/zsgl/video.ts) L303-310：`pause` 监听器 100ms 后 resume；L341-360：5s 间隔自动恢复；L348 每次播放成功 `resetPlayRetry()` → 熔断失效
- [utils.ts](file:///d:/workSpace/program/course-tools/src/mooc/zsgl/utils/utils.ts#L337) `setupVisibilitySpoof` 只伪装 document.hidden/hasFocus；L273 `setupEventPrevention` 只 stop 事件
- [course.ts](file:///d:/workSpace/program/course-tools/src/mooc/zsgl/course.ts#L65) 已调用 setupVisibilitySpoof；L55 `window.onresize = null` 只清一次，站点 useEffect 之后又会赋值

### 问题3 证据
- [log.ts](file:///d:/workSpace/program/course-tools/src/internal/utils/log.ts)：`ConsoleLog`/`PageLog` 仅输出 console，无持久化；`ConsoleLog.Debug` 受 `Application.debug`（NODE_ENV）门控
- [mooc.ts](file:///d:/workSpace/program/course-tools/src/mooc.ts#L19-L24)：注入脚本 `top==self` 用 `PageLog`，iframe 用 `ConsoleLog`；[start.ts](file:///d:/workSpace/program/course-tools/src/start.ts#L92) 内容脚本用 `ConsoleLog` —— 两个世界各自打印，且共享同源 localStorage，落地时需按世界区分 key 防止互相覆盖
- 无 `window.onerror`/`unhandledrejection` 捕获（日志中站点 `removeChild` TypeError 只出现在 console，无人记录）
- 自动恢复熔断条件 `playRetryCount > 10`（[constants.ts](file:///d:/workSpace/program/course-tools/src/mooc/zsgl/constants.ts#L13-L16)：间隔 5s）在"暂停→播放成功→暂停"循环下永不触发

## Proposed Changes

### P0-1 日志捕获 LogRecorder（问题3，最高优先级）

**文件：[src/internal/utils/log.ts](file:///d:/workSpace/program/course-tools/src/internal/utils/log.ts)**

新增模块级 `LogRecorder` 类：
- `constructor(storageKey: string | null)`：`null` 表示不落地（如 background、iframe 世界）
- `record(level: string, args: any[])`：格式化为 `[level HH:MM:SS] text`（对象安全 JSON 序列化，try/catch 兜底 `String()`），push 进环形缓冲，**上限 2000 行**（超出丢最旧）
- `startFlush()`：`setInterval` 每 5s 将 `lines.join("\n")` 写入 `localStorage[storageKey]`（try/catch 吞 quota 异常）；仅 `top == self` 的实例启动
- `pagehide`/`beforeunload` 监听（幂等注册一次，模块级）：落地一次并把缓冲转存 `storageKey + "_last"`、清空 buffer —— 正常退出（含页面跳转）后 buffer 应为空
- 启动时：若 `storageKey` 非空（说明上次异常退出=崩溃/冻结），且 `location.host` 含 `zsgl` → **自动下载** `工具日志_上次崩溃_<时间戳>.log`（内容 = buffer + `_last`）并清空；非 zsgl 站点不自动下载，仅保留待手动导出
- 模块级 `installGlobalErrorCapture()`：`window.addEventListener("error")` 与 `"unhandledrejection"` → `recorder.record("error", ...)` 并原样 `console.error` 透传（不阻断，不 stopPropagation）
- 导出函数 `exportToolLogs()`：汇总本世界 buffer+last（`window.__toolLogExport` 暴露，幂等，两个世界各装各的）

改造两个 Logger 类，**每个方法（含 Debug）先 record 再打印**：
- `ConsoleLog`：构造函数增加 `storageKey?: string | null` 参数，Debug 打印仍受 `Application.debug` 门控但 **record 不门控**（崩溃诊断需要 debug 级）；Warn/Error/Fatal record
- `PageLog`：同样增加参数并 record（其 Debug 无条件打印，一并 record）

**文件：[src/mooc.ts](file:///d:/workSpace/program/course-tools/src/mooc.ts#L19-L24)**：`top==self` 时 `new PageLog("zsgl_log_main")`，否则 `new ConsoleLog(null)`（iframe 不落地）

**文件：[src/start.ts](file:///d:/workSpace/program/course-tools/src/start.ts#L92)**：`new ConsoleLog("zsgl_log_cs")`（内容脚本世界与注入世界共享 localStorage，key 不同避免互相覆盖）

### P0-2 崩溃场景防御性熔断（问题3 + 问题2 兜底）

**文件：[src/mooc/zsgl/video.ts](file:///d:/workSpace/program/course-tools/src/mooc/zsgl/video.ts) 与 [src/mooc/zsgl/scorm.ts](file:///d:/workSpace/program/course-tools/src/mooc/zsgl/scorm.ts)**（两文件各自实现，与现有代码重复风格一致）

- `pause` 监听器（setupVideoAutoResume 内）：
  - 顶部加 `if (this.playAborted) return;` —— 已熔断后不再点击播放
  - 记录 pause 时间戳数组，剪除 60s 窗口外条目；**窗口内 ≥8 次 → `abortAutoResume()`** 并 `log.Error("[自动恢复] 60秒内暂停超过8次（切窗/限制弹窗），已停止自动恢复，请通过 __toolLogExport() 导出日志")`
- 新增常量（[constants.ts](file:///d:/workSpace/program/course-tools/src/mooc/zsgl/constants.ts)）：
  - `PAUSE_STORM_MAX_COUNT: 8`、`PAUSE_STORM_WINDOW_MS: 60000`
  - `LOG_BUFFER_MAX_LINES: 2000`、`LOG_FLUSH_INTERVAL_MS: 5000`

### P1-1 禁用切屏检测（问题1）

**文件：[src/mooc/zsgl/course.ts](file:///d:/workSpace/program/course-tools/src/mooc/zsgl/course.ts)** Init 中 `setupVisibilitySpoof()` 之后：

```ts
// ① 改写课程详情响应：关闭切屏/截图检测开关（站点据此安装 window.onblur 检测）
if (!this.switchScreenHooked) {
  this.switchScreenHooked = true;
  hookAndModifyHttpResponse(
    ZSGL_CONSTANTS.HTTP_ENDPOINTS.QUERY_COURSE_DETAIL,
    (response) => {
      if (response?.body) {
        response.body.isOpenSwitchScreen = 0;
        response.body.isOpenScreenShot = 0;
      }
      return response;
    },
    this,
  );
}
// ② 兜底：拦截站点对 window.onblur/onfocus/onresize 的属性赋值
setupSwitchScreenNeutralizer();
```
（`import { hookAndModifyHttpResponse, setupSwitchScreenNeutralizer } from "./utils/utils"`；新增字段 `private switchScreenHooked: boolean = false`）

### P1-2 新增切屏赋值拦截（问题1/2 兜底）

**文件：[src/mooc/zsgl/utils/utils.ts](file:///d:/workSpace/program/course-tools/src/mooc/zsgl/utils/utils.ts)**

模块级 once-guard + 导出函数：
```ts
let switchScreenNeutralized = false;
export function setupSwitchScreenNeutralizer(): void {
  if (switchScreenNeutralized) return;
  switchScreenNeutralized = true;
  try {
    for (const prop of ["onblur", "onfocus", "onresize"] as const) {
      Object.defineProperty(window, prop, {
        configurable: true,
        get: () => null,
        set: () => Application.App.log.Debug(`[切屏防御] 已拦截 window.${prop} 赋值`),
      });
    }
    Application.App.log.Info("[切屏防御] 已启用：站点切窗检测(onblur/onfocus/onresize)已失效");
  } catch (e) {
    Application.App.log.Warn("[切屏防御] 安装失败:", e);
  }
}
```
说明：站点仅以属性赋值方式使用这三个处理器（deobfuscated.js 全文仅 L1838/1842/1874/2383-2385 处），拦截赋值不影响其它功能；`course.ts` L55 的 `window.onresize = null` 赋值变为无害 no-op。

## Assumptions & Decisions
- **自动下载上次崩溃日志**仅在 zsgl 站点域名触发（host 含 `zsgl`），避免其它平台页面频繁弹下载；导出也可随时 `window.__toolLogExport()` 手动触发
- 环形缓冲 2000 行 / 每 5s 落地一次：兼顾容量（localStorage ~5MB 配额）与崩溃丢失窗口（最多丢 5s 日志）
- 暂停风暴阈值 8 次/60s：正常播放（含广告、卡顿）不会触及；切窗死循环（1 次/s）约 8s 触发熔断
- 不做弹窗自动点击关闭：切屏检测源头已被切断，无需处理弹窗本体；时长限制弹窗（timeLimitDialogBox）属服务端限制，保留现状
- 站点 hls.js/DRM 反复加载导致的内存增长属站点代码问题，本次不直接修，先靠日志定位；防御性熔断可减少我方逐秒 `play()` 调用对站点播放器的刺激
- 两个脚本世界（注入世界 PageLog / 内容脚本 ConsoleLog）各自独立 record + 各自 key 落地，iframe 世界不落地

## Verification
1. `npm run build` 编译通过
2. 逻辑走查：
   - 切屏检测：`queryCourseDetail.do` 响应被改写（控制台可查"响应已被修改"日志）→ 站点组件 `isFlipScreen !== Open` 不安装 onblur；即使安装也被 setter 拦截（日志出现"已拦截 window.onblur 赋值"）
   - 切窗/最小化：视频继续播放，无 pause 循环；若仍出现 ≥8 次/60s 暂停 → 熔断并输出明确 Error
   - 日志捕获：F12 执行 `window.__toolLogExport()` 下载文件；任务管理器结束标签页（模拟崩溃）→ 重新打开课程页 → 自动下载 `工具日志_上次崩溃_*.log`，内容包含崩溃前 ~5s 内的日志；`window.onerror`/`unhandledrejection`（如站点 removeChild TypeError）被写入缓冲
3. 实机回归：进入视频任务 → 切换窗口/最小化 → 不弹窗、不暂停、控制台无循环打印；人为制造 unhandled rejection 验证捕获；下次崩溃后验证日志自动导出
