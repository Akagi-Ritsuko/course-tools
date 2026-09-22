# zsgl 视频风暴（CPU 100%）排查报告

> 日期：2026-09-20 ~ 2026-09-21
> 关联：docs/tasks.md T-004；.trae/documents/zsgl-debug-handoff.md §四 P1
> 证据目录：.trae/log-extract/（不入库）

## 一、问题背景

用户报告：zsgl 平台（zsgl.lzlj.com，hash SPA + React + DRM m3u8 视频）课程页视频起播或切换视频时，**整个浏览器冻死（CPU 100%）**，只能任务管理器强杀；强杀重开后同一视频可正常播放，但切下一个视频问题复现。用户常开 3+ 个标签页。

## 二、排查流程与定位方法

### 2.1 阶段一：可观测性建设（先让它能被诊断）

崩溃后拿不到现场是排查的最大障碍，因此第一步是完善工具内置的日志系统（LogRecorder，src/internal/utils/log.ts）：

- 内存环形缓冲（2000 行）→ 每 5s 落地 localStorage → 崩溃（pagehide 未触发）后由下一个 zsgl 页面加载 3s 后自动导出 `工具日志_上次崩溃_*.log`
- 双世界分区（主世界 PageLog / 内容脚本 ConsoleLog）、按标签页隔离（tabId 存 sessionStorage）、心跳 30s 判死防抢占
- 每次落地追加 `[mem]` JS 堆采样行（区分内存泄漏 vs CPU 型问题）

**排查中发现的缺陷与修复**：两世界同时导出会触发 Edge"多个自动下载"拦截，且旧逻辑下载失败仍无条件删除 localStorage 键 → 崩溃日志永久丢失。修复为**单飞合并导出**（export_lock 互斥 + 全世界孤儿键单文件下载）+ **归档替代删键**（zsgl_log_arch 400KB 滚动）。修复后崩溃日志首次成功落地。

### 2.2 阶段二：复现与旁路取证

- **复现**：单标签打开/刷新课程页（N008085/86/84/123 均可），**数十秒内必现风暴**，强杀重启后刷新立即再崩——多标签非必要条件。
- **日志提取的波折**：自动导出曾因下载拦截失败；改用**LevelDB 旁路**直接从 `%LOCALAPPDATA%\Microsoft\Edge\User Data\Default\Local Storage\leveldb\` 提取（键为 ASCII/UTF-8，值为 UTF-16LE，需双编码搜索）。
- **关键日志事实**：风暴期间渲染进程 **JS 事件循环全程存活且空闲**（mem 采样行每 5s 不断、行为日志静默、堆稳定 52~54MB）→ 排除扩展 JS 死循环与内存泄漏。

### 2.3 阶段三：进程级 CPU 采样（定位燃烧点）

后台 PowerShell 每 3s 采样 `Get-Process`/`Win32_Process`（含 `--type=` 解析区分进程类型），只记录 >5% 的进程：

- 第一次采样暴露**正则缺陷**：新版 Chromium 命令行为 `--type=renderer`（无 `-process` 后缀），导致渲染进程被误标为 browser——修正后图景才正确。
- 采样结论：高 CPU 在**课程页渲染进程（~200%）+ 主进程连带（~180%）**，GPU 进程仅 ~25%。
- **杀进程实验**：风暴中仅 kill 课程页 renderer → 主进程余波后缓解 → 证明 renderer 是主要燃烧点。

### 2.4 阶段四：隔离实验阶梯（单变量控制）

| 实验 | 配置 | 结果 |
|---|---|---|
| B | `--disable-extensions`，站点自动播放 4min | 干净（无进程 >40%）→ 站点单独无辜 |
| E0 | 扩展注入 + auto=false（钩子在、不起播）3.5min | 干净 → 注入层无辜 |
| M1 | auto=true，Start 只合成点击任务卡，零播放器干预 | **风暴**（renderer 93→132% >5.5min）|
| M1b | 扩展开 + auto=false + **用户真实点击**播放 | 风暴（renderer 100~137%，GPU ~10%）|
| M1c | 无扩展 + 用户真实点击播放 | 干净（renderer 8~26%，GPU 40~45% 硬解）|
| M1d | 扩展开（**响应体改写已注释**）+ 真实点击播放 | 干净（renderer 5~14%，GPU 硬解恢复）|
| FINAL | 不改写 + auto=true 完整挂机（合成点击+干预） | 风暴复现 → 暴露第二诱因 |
| M3 | 不改写 + 完整挂机但去掉 keepAlive 音频 | 风暴 → keepAlive 排除 |
| v2 | 最小旁观（仅 ended 检测，无 keepAlive/拦截） | **能播放** → 破坏源锁定在 Start 执行的副作用 |
| v3 | v2 + play 事件里写 playbackRate/volume | 可用（主进程正常、体验正常）但 **renderer 128~142%（软解仍在）** |

### 2.5 定位方法小结

1. **先建观测**（日志系统）→ 2. **复现固定**（单变量环境）→ 3. **进程级采样**定位燃烧进程（注意 `--type=renderer` 正则陷阱）→ 4. **A/B 隔离阶梯**（注入层 → 起播动作 → 播放器干预 → 逐项剥离）→ 5. **真实点击 vs 合成点击对照**分离诱因 → 6. **LevelDB 旁路**取证。

## 三、根本原因

两个**相互独立**的诱因，任一存在即触发异常：

### 诱因①：响应体改写 → DRM 播放器软解

`course.ts` 的 `hookAndModifyHttpResponse(QUERY_COURSE_DETAIL, ...)` 将 `queryCourseDetail.do` 响应体中 `isOpenSwitchScreen/isOpenScreenShot` 改写为 0（原切窗防御）。改写后的响应使站点播放器初始化走了**软件解码**路径：

- 改写 + 播放 = renderer 100~137%、GPU ~10%（M1b）
- 不改写 + 同样真实点击播放 = renderer 5~14%、GPU 40~52% 硬解（M1d）

具体机理（为何改写导致解码协商变化）需 chrome://tracing 深挖，疑似与响应 JSON 重建后站点播放器配置分支有关。

### 诱因②：合成点击任务卡 → 渲染进程媒体管线风暴

`video.ts` Start 中的 `taskDiv.click()`（isTrusted=false 合成点击）使站点打开播放器/重建 DRM 容器时，渲染进程**非 JS 线程**进入 200% 风暴（JS 事件循环全程空闲存活）。与播放器干预动作（倍速/静音/currentTime）无关（M1 已剔除），真实鼠标点击不触发（M1c/M1d）。

### 与用户体感的对应

- 软解（诱因①）= 视频正常播放但烧一个核——**主进程正常时用户无感**
- 风暴（诱因②）= renderer+主进程双双 ~200% → UI/IPC 线程饿死 → "整机冻死"；风暴不恢复时=强杀场景
- 多标签叠加 = 多个软解 renderer 叠加，加剧恶化

## 四、修改内容

### 4.1 响应体改写注释（修复诱因①）— src/mooc/zsgl/course.ts

```ts
hookAndModifyHttpResponse(QUERY_COURSE_DETAIL, (response) => {
  // M1d: 不改写 isOpenSwitchScreen/isOpenScreenShot,原样放行
  return response;
}, this);
```

切窗防御不再依赖响应改写，由 `setupSwitchScreenNeutralizer()`（将 window.onblur/onfocus/onresize 的 setter 置 no-op，实测站点即用属性赋值方式装检测）继续兜底。

### 4.2 video 类型任务改半自动模式（规避诱因②）— src/mooc/zsgl/video.ts

Start() 变更（修改前 → 修改后）：

| 修改前（全自动） | 修改后（半自动） |
|---|---|
| `taskDiv.click()` 合成点击任务卡 | **移除**（诱因②） |
| initPlayer：muted 切换、currentTime=0×2、clickPlayButton 强制起播 | **移除** |
| watchPlaybackRate/auto-resume 5s 轮询/暂停风暴熔断 | **移除**（由 play/ratechange 监听替代） |
| startKeepAlive 循环静音音频 | **移除**（待最小可用集验证后评估恢复） |
| setupEventPrevention 15 类事件拦截 ×2 | **移除**（切窗防御由 neutralizer 兜底） |
| — | **play 事件**：应用用户配置的静音/倍速 |
| — | **ratechange 监听**：对抗平台倍速重置 |
| — | 提示用户手动点击任务卡（通知条） |

保留不变：ended 监听（完成检测与推进）、`readyState>=1` 起播门控（防抢跑）、scorm 类型任务的原自动点击逻辑（scorm.ts）。

### 4.3 起播死锁兜底 — video.ts / scorm.ts waitForVideoSourceAndPlay

部分 DRM 播放器需先 play() 才拉流加载元数据，与"等元数据才播放"互等死锁。修复：轮询 8s 后若 blob 源已挂载则主动尝试起播。

### 4.4 日志系统 — src/internal/utils/log.ts

恢复导出改单飞合并（export_lock 15s 互斥，全世界孤儿键单文件下载）+ 归档替代删键（zsgl_log_arch 400KB 滚动），杜绝"下载被拦 → 删键 → 日志永久丢失"。

## 五、修改前后对比

| 维度 | 修改前 | 修改后 |
|---|---|---|
| 起播方式 | 合成点击任务卡 + 强制起播 + currentTime 重置 | 用户手动点卡片（半自动）|
| 解码路径 | 软解（renderer 100~212%，GPU 闲置） | 硬解（renderer 5~26%，GPU 40~52%）|
| 主进程 | 风暴期 ~180-192%（UI 冻死） | ~15-19%（正常）|
| 用户体感 | 整机冻死、需强杀 | 播放流畅、倍速静音生效 |
| 挂机自动化 | 全自动（有致命风暴） | 半自动：手动开播放器，完成检测/推进自动化 |
| 崩溃日志 | 下载失败即永久丢失 | 单飞合并导出 + 归档保底 |
| 切窗防御 | 响应改写 + 属性中和双保险 | 仅属性中和（neutralizer）|

**代价与取舍**：video 任务不再全自动点卡片（站点不自动续播的视频需手动点一次）；keepAlive/事件拦截/暂停自动恢复/currentTime 重置等能力暂时移除，待最小可用集逐项验证后评估恢复；scorm 任务不受影响。

## 六、验证结果

- 半自动 v3 实测：播放正常、静音/倍速生效、主进程 15~19% 无风暴
- 已知残留：**renderer 128~142%（软解）仍存在**——对比 M1d（纯旁观 26% 硬解），差异为 v3 在 play 事件写入 playbackRate/volume，**疑似设置倍速即触发软解回退**，待 v4 验证（去掉写入确认）；若实锤则"倍速与硬解不可兼得"，需产品取舍

## 七、遗留事项

1. v4 实验：play 事件中移除 playbackRate/volume 写入，确认硬解是否恢复（当前 renderer 130% 的最后一块拼图）
2. 诱因②的 chrome://tracing 深挖（media/compositor 线程级）
3. 半自动体验优化：任务切换时的引导提示、scorm 任务的风暴风险评估（scorm 仍保留合成点击）
4. `src/mooc/zsgl/log/` 反编译产物与日志样本清理（handoff §四 P3）
5. 篡改猴与本扩展共存时的行为未做专项回归（实验期间已隔离）

## 八、关键文件索引

| 文件 | 变更 |
|---|---|
| src/mooc/zsgl/video.ts | Start 改半自动（play/ratechange 应用倍速静音，移除合成点击与干预）、readyState 门控、起播兜底 |
| src/mooc/zsgl/scorm.ts | readyState 门控、起播兜底（自动点击逻辑保留） |
| src/mooc/zsgl/course.ts | 响应体改写注释（M1d 开关） |
| src/internal/utils/log.ts | 单飞合并导出 + 归档 |
| .trae/log-extract/ | 全部采样 CSV 与提取日志（本地，不入库） |
