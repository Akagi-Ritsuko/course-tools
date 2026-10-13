# 任务清单（tasks.md）

> 状态取值：`todo` / `doing` / `done`。
> 当前清单范围：仅 zsgl 模块。
> 任务来源：`src/mooc/zsgl/TODO.md`（原始问题清单）与 `.trae/documents/zsgl-debug-handoff.md`（2026-09-20 调试交接）整理合并；整理后以本文件为第一入口。

| 编号 | 任务 | 状态 | 优先级 | 来源 | 关联文档 |
|---|---|---|---|---|---|
| T-001 | 考试答案获取与导出：分批累积（mergeQuestionBatch）、串行破解链、集齐自动导出、交卷兜底导出；待实机回归（35 题分 4 批场景） | doing | P1 | TODO#1 + handoff §2.1 | 03-详细设计 §9 |
| T-002 | 崩溃日志系统（LogRecorder）：~~恢复导出"下载失败仍删键"致日志丢失~~ **已修复并实机验证**（2026-09-21）：单飞合并导出（export_lock 互斥，全世界孤儿键单文件下载）+ 归档替代删键（zsgl_log_arch 400KB 滚动）；实机下载首次成功落地 Downloads | done | P1 | handoff §2.2 + §四P2 | 04-数据库设计 §3 |
| T-003 | 学习地图任务完成后返回流程端到端验证：学习地图 → 任务 → 任务页写 finished 信号并 window.close()（course.ts notifyStudyMapCourseComplete）→ 回学习地图（storage → reload）→ 自动下一任务 | doing | P0 | TODO#5 | 03-详细设计 §8 |
| T-004 | P1 核心排查：视频起播时 CPU 100% 整浏览器冻死。**已完成（2026-09-21，双诱因+半自动方案落地）**：①响应体改写→软解（已注释修复）②合成点击→renderer 风暴（video 改半自动规避，scorm 保留自动）；v3 实测播放/倍速/静音正常、主进程无风暴；已知残留=renderer 128~142% 软解（疑似 play 中写 playbackRate 触发，v4 待验证）；完整报告见 .trae/documents/zsgl-video-storm-root-cause-report.md | done | P0 | handoff §四P1 | 03-详细设计 §5/§10 |
| T-005 | P2 修复项实机回归：切窗弹窗与暂停死循环消失（应出现"已拦截 window.onblur 赋值"日志）；getIsWatermark 报错随 watermarkFrame prepend 移除而消失 | todo | P2 | handoff §四P2 | 03-详细设计 §1.3/§3.1 |
| T-006 | SCORM 子类型支持：`document` 文档任务（自动标记已读） | todo | P1 | TODO#2 | 03-详细设计 §4.2 |
| T-007 | SCORM 子类型支持：`audio` 音频任务（自动播放） | todo | P1 | TODO#2 | 03-详细设计 §4.2 |
| T-008 | SCORM 子类型支持：`URL` 链接任务（实现方案见 TODO#2.1：新建 url.ts，自动打开 + 标记完成 + auto_open_url 配置） | todo | P1 | TODO#2.1 | 03-详细设计 §4.2 |
| T-009 | knowledge 任务收尾：学习地图中的 knowledge 类型支持；iframe 加载判断优化（跨域处理） | todo | P1 | TODO#2 | 03-详细设计 §7/§8 |
| T-010 | 每日积分模式实机测试与验证（功能已实现）；顺带审查 dailyPoints.ts 是否存在高频循环（关联 T-004 排查怀疑方向③） | doing | P2 | TODO#3 + handoff §四P1 | 03-详细设计 §10 |
| T-011 | 学习地图选修部分支持：调研选修课程数据结构、确定判断逻辑、实现过滤/包含（study_elective_courses 配置设想见 TODO#4） | todo | P2 | TODO#4 | 03-详细设计 §8.2 |
| T-012 | 焦点变化/页面最小化视频暂停：验证 setupEventPrevention + setupVisibilitySpoof + setupVideoAutoResume 组合的实际效果；必要时 Object.defineProperty 重写 document.hidden | todo | P2 | TODO#6 | 03-详细设计 §1.3/§5.3 |
| T-013 | 考试错题记录按钮调研：getNewExamDetails，showErrorType=1，ishidenerrquestion=N | todo | P3 | TODO#7 | 05-API文档 A4/A5 |
| T-014 | 视频长时间转圈问题（0630 记录；与 T-004 播放点击限流、T-005 回归相关） | todo | P3 | TODO#8 | 03-详细设计 §5 |
| T-015 | 工程化：webpack 加 fork-ts-checker 或 CI 跑 `tsc --noEmit`（先清理/白名单 ~60 个基线错误）；`src/mooc/zsgl/log/` 反编译产物与日志样本 gitignore 或移出仓库 | todo | P3 | handoff §四P3 | — |
| T-016 | 三节课自动挂机（sanjieke-auto-study）：zsgl"混合"课程「立即学习」跳转 lzlj.b.sanjieke.cn 三方页面的自动挂机（xgplayer 起播/倍速/防暂停）+ 课后题自动答题（questions 接口自带 answer）+ 完成判定与学习地图串联闭环；里程碑 M1 文档已落地，M2~M6 待开发；2026-09-22 迭代 2（M7）完成代码：视频完成改 setContentFinished 平台信号确认制 + ended 未确认重播（3 次熔断）+ 课后题 completedFlag/「继续挑战」精确推进 + 课时切换改 interval 配置；同日修复 content/tree 解析字段不匹配（nodeId + attribute.isFinish）+ quiz 后台抗节流（Worker 心跳）+ 课时按内容类型分发（非 video/audio 跳过不标记，剩余全为此类时视为完成，白名单留扩展），复测待做；同日迭代 3：新增图文课时 SanjiekeArticle（渐进滚动+finished 信号确认+超时兜底），实测待做 | doing | P1 | .trae/specs/sanjieke-auto-study | .trae/specs/sanjieke-auto-study/spec.md |
| T-017 | 三方课程完成推送通知（去轮询，ADR-001）：三节课毕业 → A 路 opener 直推 + B 路扩展中转（start/background 双向桥接，openerTabId 优先）→ zsgl course.ts 幂等直达闭环；移除失效轮询（重放请求缺 courseId 请求体与 headerMap 签名，服务端报后台处理错误）；页面保活：setupPageKeepAlive Web Lock 持锁防后台冻结（三方课程课程页 + 学习地图页），08-用户指导 §五 补浏览器"保持活动"设置指引（双保险）；代码完成，build/tsc 通过，实机验证待做 | doing | P1 | .trae/specs/sanjieke-complete-push | docs/adr/ADR-001、docs/zsgl/cn/03 §3.5、docs/zsgl/cn/08 §五 |
| T-018 | 经验沉淀文档：汇总 zsgl/sanjieke 历史问题（问题/定位/根因/解决/教训）与工程调试通用经验，含问题→代码→文档索引；来源=git 提交记录、.trae/documents 排查报告、changelog、TODO.md、specs | done | P2 | 用户要求 | docs/lessons-learned.md |
| T-019 | 学习地图 gatetask 拦截重入修复：Init 先拦截后点击时序 + 3s 超时置 resolved 后旧回调驻留 + hookHttpRequest 按 context 去重 → 点击"第 N 关"后正确 queryStudymapGateTask 请求被死回调吞掉（gateTaskData=undefined / zsgl_task_undefined，skip_elective=false 且目标关卡≠页面初始关卡时必现）；修复=hookStudymapGateTaskRequests 每次调用先 removeHttpRequestHook 注销本 context 旧钩子再注册（重新武装）+ 3s 超时兜底时同步注销；代码完成、build/tsc 通过，实机回归待做 | doing | P1 | 用户报障（2026-09-23 日志 zsgl.lzlj.com-1790132727931.log） | 03-详细设计 §1.1/§8.2 |
| T-020 | 学习地图遗留隐患（T-019 分析中发现，未修复）：findNextLevelAndStart 与关卡 click 监听双路径都会在 gateTaskData 就绪后 Start，靠 3s 超时兜底唤醒的一路径可能造成二次 Start / 重复点击任务卡（TimerManager 按 key 幂等，实际退化为单次点击 + 单个悬挂 Promise，影响有限） | todo | P3 | T-019 分析 | 03-详细设计 §8.3 |
| T-021 | 学习地图 resourceType=153 无媒体任务闭环 + 任务卡点击修复：① 关卡点击为 toggle，目标关卡已展开（Init 已拦截到任务数据）时跳过程序化 click 改直接 Start，findNextLevelAndStart 先清 stale gateTaskData；② Start 任务名空白归一化匹配 + 40 次轮询上限；③ 无媒体任务判据=resourceType===153（用户确认，coursewareType 判据作废），资源地址由 resourceId 构造（origin+/znWeb/knowledge-cloud/#/knowledgePage/{resourceId}），主世界 → start.ts 中继 → background chrome.tabs 开任务页（active:false，不受弹窗拦截/用户激活限制）+ 10s 后 chrome.tabs.remove 自动关页，学习地图 reload 进下一任务（course.ts 十秒闭环仅覆盖直接进课程页场景，保留并补注释）；代码完成、build/tsc 通过，实机回归待做（观察：后台开页自关闭环、服务端是否计入后台标签页访问记录） | doing | P1 | 用户报障（2026-09-23 日志 zsgl.lzlj.com-1790150855658.log） | 03-详细设计 §8.3 |
| T-022 | 考试答案自动勾选与工具浮窗开关（分支 feature/exam-autoselect-panel-toggle，自 zsglTools-master 拉出）：① 配置项 2 个（src/config.ts zsgl 块）：show_float_panel（显示工具浮窗，checkbox，默认 true）、exam_auto_select（考试自动勾选，checkbox，默认 false）；② 浮窗开关（src/internal/utils/log.ts）：PageLog.buildPanel 开头读 show_float_panel 门控（缺省 "true"，写法同 is_notify），false 不创建 tools-logger-panel 面板（Info 自动回落 console；LogRecorder/崩溃日志转存不受影响），面板 x 关闭按钮写回 show_float_panel="false" 持久化记忆；范围仅工具浮窗，每日积分 DailyPointsFloatingPanel 不受控；③ 考试自动勾选（src/mooc/zsgl/{exam,constants}.ts）：Observer 挂 document.body（SPA 重建 MuiPaper-root 免重挂，匹配限定 Paper 范围）+ 300ms 防抖正向触发、crackQuestions 链尾 autoSelectTick(true) 反向触发补勾（覆盖用户先翻题、答案后就绪场景）；归一化文本唯一命中匹配（完整题干+末段 p 双键，Paper 嵌套取最内层，零/多命中 Warn 跳过）+ 差集幂等勾选（S/T 点目标 radio 互斥；M 先取消非目标已选含试探回显再点目标；已满足不动）+ 勾后回读验证，失败降级 Info 面板提示正确答案文本；未破解题（无 isCorrect="Y"）绝不点击仅 Info 提示；仅 unit.click() 选项元素，绝不碰上一题/下一题/交卷按钮、不调提交接口，交卷监听/任务链/答案导出/破解策略零改动；代码完成、npm run build 通过、tsc 无新增基线外错误（剩余为 exam 系/log.ts 基线 implicit-any），实机回归待做（选项选择器/保存答案时机/回显行为三项待实测校准，constants.ts 已留校准注释）；实机回归第 1 轮校准（2026-10-13，用户日志实锤水印误选）：① 题面匹配增加水印容器排除（EXCLUDE_PAPER_PATTERN=/watermark/i——examWatermark 复刻题干文本且文本常短于真实题面，被"最短文本=最内层"规则误选致"未找到选项元素"）；② Paper 候选改为优先选取含选项元素者（文本升序内层优先，都无选项回退最短文本）；③ 选项未就绪延迟重试（RETRY_DELAY_MS=800/MAX_RETRY=2，耗尽输出 OPTION_SELECTORS 命中统计 Debug 供校准）；build 通过，回归继续；实机回归第 2 轮（日志 zsgl.lzlj.com-1791874573320.log + 反编译 deobfuscated.js）：零命中证明 examWatermark 实为考试内容卡片（题干+选项都在其中），第 1 轮水印排除系误判已撤销（EXCLUDE_PAPER_PATTERN 删除）；站点选项实证为自定义 div+React onClick（onSelectOption，选中态仅切 class，无 input/aria/MuiRadio）→ 新增 findOptionUnitsByText 按选项文本兜底定位（OPTION_TEXT_FALLBACK_MIN_LEN=2）+ applyAutoSelect 双路径分流（可回读差集幂等 / 不可回读一次性应用 autoSelectAppliedIds + className 弱验证）+ clickOptionUnit（点内部控件或单元自身，React 根委托）；build 通过，回归继续；实机回归第 3 轮（用户提供考试页选中 DOM）：选项结构实证=option 行 div（onClick+opacity）> checkbox 指示 div + "字母."+span.jss794>p 文本，且选中态 class 挂行级祖先——弱验证盲区修复：由单元自身 className 对比升级为 ancestorChainSignature 祖先链签名对比（单元→题面容器），applyAutoSelect 增加 paper 参数；build 通过，回归继续；实机回归第 4 轮（日志 zsgl.lzlj.com-1791876277451.log）：文本兜底触发但 pageCount=1——勘误 findOptionUnitsByText 单遍历去重缺陷（选项容器文档序先于选项行出现，挡住全部内部命中），改两遍式定位（先收集全部命中、再保留最小者），build 通过，回归继续；实机回归第 5 轮（日志 zsgl.lzlj.com-1791876901003.log）：**链路全程打通**，10+ 道文本选项题连续勾选完成（含链尾反向触发）；仅纯数字选项题失败（Q8228195 选项"1/2/3/4"全被 minLen=2 过滤、"7/15/30/60"中"7"被滤致数量不匹配）→ findOptionUnitsByText 匹配语义按长短分流：长文本包含匹配、短文本全等匹配（<p>15</p> 归一化恰等于 sectionText），minLen 只约束包含分支；build 通过，回归继续 | doing | P1 | 用户要求 | 03-详细设计 §9.7/§12、04-数据库设计 §2.1、07-部署手册 §4、08-用户指导 §四 |

## 备注

- 优先级综合 TODO.md"优先级排序"与 handoff §四（P0 < P1 < P2 < P3，数字越小越优先）。
- T-001/T-002/T-003 的"doing"表示代码已实现、待实机验证（handoff 标注）。
- 已在近期改动中关闭的事项不再列任务：切窗检测双保险（handoff §2.3，回归项归 T-005）、暂停风暴熔断与播放点击限流（handoff §2.4/§2.5）、水印触发源移除（handoff §2.6）。

## 文档体系建设（本 goal 内的协作文档任务）

| 编号 | 任务 | 状态 |
|---|---|---|
| T-901 | 初始化协作文档体系（ai-collab/changelog/tasks），整理任务清单并补录近期变更 | done |
| T-902 | 创建 docs/zsgl/README.md 文档索引与代码地图，更新 ai-collab 阅读顺序指向 | done |
| T-903 | docs/zsgl/cn/ 各文档与代码一致性核对修订（03/04/05/07） | done |
