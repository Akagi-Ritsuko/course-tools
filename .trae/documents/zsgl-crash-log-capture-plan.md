# zsgl 视频崩溃（CPU 100%）实机复现与崩溃日志回收计划

> 关联：docs/tasks.md T-004；.trae/documents/zsgl-debug-handoff.md §四 P1
> 用户已确认：AI 全程电脑控制操作；单标签隔离复现；产出=日志分析+代码定位

## 一、目标

用电脑控制在 Edge 单标签环境复现 zsgl 视频起播/切视频时整机冻死问题，强杀后回收 LogRecorder 自动导出的崩溃日志，分析冻结前最后几秒行为，结合代码定位嫌疑方向，并按 ai-collab 纪律更新文档。

用户补充的关键行为线索（重要，用于界定复现场景）：
- 首次打开视频会崩溃，或播放完成切换下一个视频时崩溃
- 强杀重启后，同一视频大概率正常；再切下一个视频又会崩

## 二、现状分析（代码事实，已核实）

1. **日志系统**（src/internal/utils/log.ts）：
   - 环形缓冲 2000 行，每 5s 落地 localStorage → 冻结时最多丢最后 5s 日志
   - 强杀时 pagehide 不触发 → 缓冲成孤儿；下一个 zsgl 页面加载 3s 后自动下载 `工具日志_上次崩溃_<时间戳>.log` 到 Edge 默认下载目录（仅 `host` 含 "zsgl" 的页面触发；main 与 cs 世界各自导出一份）
   - 手动导出备用：DevTools 控制台 `__toolLogExport()`
   - 日志含 `[mem]` 内存采样行 + 全量 debug 行为日志（cs 世界生产模式仅 mem 行）
2. **视频任务**（src/mooc/zsgl/video.ts）：`ended` 时清 autoResume 定时器 + stopKeepAlive + callEvent("complete")；Init 每次 querySelector 取视频元素；clickPlayButton 有 2000ms 限流
3. **待证疑点**：若站点切换任务时**复用同一 `<video>` 元素**，第二个 ZsglVideo 实例会在同一元素上再挂一套 pause/play/ratechange 监听器（`autoResumeListenersAdded` 是实例级守卫）→ 双实例竞争点播放，可能激发 DRM 播放器反复启停（与"切下一个视频才崩、重启后同视频正常"的现象吻合）
4. **构建警告**（handoff §三）：`build/zsgl-tools` 已过期勿用；必须 `npm run build` 且构建后在 edge://extensions 点"重新加载"，否则跑旧代码

## 三、执行步骤

### 阶段 0：准备
1. [终端] `npm run build`，确认 `build/cxmooc-tools/src` 产物更新
2. [电脑控制] `list_apps` 获取 Edge pid；`get_app_state` 观察当前窗口/标签页
3. [电脑控制] 关闭其它标签页，仅保留目标课程页（单标签隔离，已获批准）
4. [电脑控制] edge://extensions → 找到加载自 `build/cxmooc-tools` 的扩展 → 点"重新加载"（若扩展指向其它目录，停止并询问用户）
5. [电脑控制] 扩展弹窗确认"日志转存"勾选状态（代码默认开；若弹窗经 UIA 操作不便则跳过，依赖默认值）
6. [终端] 记录 `%USERPROFILE%\Downloads` 现有 `工具日志_*.log` 清单，避免新旧混淆

### 阶段 1：复现（单标签）
7. [电脑控制] 打开/刷新 `https://zsgl.lzlj.com/znWeb/znPortal/#/home/courseDetail/N008085`，等待挂机自动播第一个视频（场景 A：首视频起播崩溃）
8. [电脑控制] 以有界等待（PowerShell Start-Sleep 间隔）轮询 `get_app_state` 探测冻结：超时/无响应 = 冻结确认，记录时间戳与所处场景
9. 场景 A 10 分钟未复现 → 让视频播放完成观察切换下一视频瞬间（场景 B：切换崩溃）；仍未复现则刷新页面重试一轮，如实记录"未复现"

### 阶段 2：强杀与重启
10. [电脑控制] 冻结确认后切任务管理器（Ctrl+Shift+Esc）→ Microsoft Edge → 结束任务（用户已预授权）
11. [电脑控制] 重新启动 Edge，先打开课程页 URL（恢复导出仅在 zsgl 域名触发），等待 ≥8s（3s 恢复检查 + 下载耗时）
12. [电脑控制] 从下载列表/下载目录确认 `工具日志_上次崩溃_*.log` 已生成（预期 2 份：main + cs）

### 阶段 3：回收与分析
13. [终端] `Copy-Item` 把新日志从 Downloads 复制到 `src/mooc/zsgl/log/`（保持原文件名）
14. [Read] 日志分析（重点：main 世界缓冲最后一屏）：
    - 播放尝试/点击播放频率（是否双实例交替点播）
    - pause/play 事件序列（暂停风暴？站点主动暂停？）
    - 请求洪流（queryStatus/queryCourseDetail 钩子循环）
    - Uncaught / UnhandledRejection 堆栈
    - `[mem]` 行突变（JS 堆 vs 采样中断）
15. [代码对照] 结合 src/mooc/zsgl/video.ts、course.ts、src/internal/app/mooc.ts（Launcher 的 complete→Submit→Next 链路）核对：切换任务时旧实例 `Stop()` 是否被调用、视频元素是否复用、站点播放器是否重建
16. 产出结论：嫌疑方向排序 + 下一步修复建议（**不实施修复**，另行启动）

### 阶段 4：文档记录与提交
17. 更新 docs/tasks.md T-004（证据与结论备注）；docs/changelog.md 留痕；在 .trae/documents/zsgl-debug-handoff.md §四 P1 追加"2026-09-20 复现记录"小节
18. [终端] git add 相关文件 + 本地 commit（**严禁 push**）

## 四、风险与边界

- 强杀 Edge 丢失该浏览器所有标签页状态（已确认单标签隔离，损失可控）
- 冻结时整机无响应，computer-use 操作可能变慢：全部探测用有界等待，确认冻结后立即转任务管理器
- 若复现失败：不强杀、不伪造日志，记录实际现象（哪个场景、播放了多久）
- 下载目录假设为 Edge 默认 `%USERPROFILE%\Downloads`；若被重定向，从 edge://settings/downloads 读取实际路径

## 五、验证方式

- `src/mooc/zsgl/log/` 下存在本次崩溃日志，且包含冻结前最后时间戳的行为行
- docs/tasks.md T-004 已补证据；changelog 已留痕；本地 commit 完成（git log 可查，未 push）

## 六、假设与决策记录

- 执行分工/隔离/产出范围：用户已选定（AI 全程、单标签、分析+定位）
- 扩展加载目录 = `build/cxmooc-tools`（handoff §三），执行时在 edge://extensions 核实
- 修复实施不在本计划范围内
