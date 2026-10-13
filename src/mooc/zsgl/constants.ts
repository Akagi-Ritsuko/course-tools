/*
 * @Author: guotao
 * @Date: 2025-03-09
 * @Description: zsgl 模块常量定义文件
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */

export const ZSGL_CONSTANTS = {
         MAX_ATTEMPT_COUNT: 10,
         CHECK_INTERVAL_MS: 500,
         VIDEO_SEARCH_INTERVAL_MS: 1000,
         VIDEO_PLAY_RESUME_INTERVAL_MS: 5000,
         PLAYER_INIT_DELAY_MS: 500,
         /** 自动恢复播放的最大重试次数,超过后停止重试(黑屏/无源保护) */
         MAX_PLAY_RETRY: 10,
         /** 播放按钮点击限流间隔(ms):loadedmetadata/canplay/轮询多事件源叠加时防止密集点击导致播放器反复启停 */
         PLAY_CLICK_MIN_INTERVAL_MS: 2000,
         /** 暂停风暴熔断:窗口时间内暂停次数达到该值后停止自动恢复(切窗死循环/限制弹窗保护) */
         PAUSE_STORM_MAX_COUNT: 8,
         /** 暂停风暴熔断的统计窗口(ms) */
         PAUSE_STORM_WINDOW_MS: 60000,
         /** scorm Start 等待开始按钮点击的超时时间 */
         START_TIMEOUT_MS: 30000,
         TASK_EXPIRE_MS: 1000 * 60 * 60 * 10,
         /** coursewareType===0(无媒体任务课程)页面停留时长:打开十秒即视为完成 */
         PLAIN_COURSE_CLOSE_DELAY_MS: 10 * 1000,
         /** resourceType=153(无媒体图文任务)资源页地址路径:origin + 此路径 + resourceId */
         PLAIN_TASK_RESOURCE_PATH: "/znWeb/knowledge-cloud/#/knowledgePage/",
         /** 页面保活 Web Lock 名称:持锁页面进入浏览器内存节省程序冻结豁免名单(shared 模式,多页面可同名共存) */
         KEEPALIVE_LOCK_NAME: "zsgl_keepalive",

         SELECTORS: {
           WATERMARK_FRAME: "#watermarkFrame",
           COURSE_VIDEO: "video#course-video_html5_api",
           MUI_BUTTON_LABEL: ".MuiButton-label",
           MUI_BUTTON_ROOT: ".MuiButton-root",
           MUI_LIST_ROOT: "ul.MuiList-root",
           MUI_PAPER_ROOT: ".MuiPaper-root",
           EXIT_SPAN: "span.exit",
           NCELLS: "div.ncells",
           CURRENTS: ".currents",
           ORANGE01: ".orange01",
           LOCK: ".lock",
           PREV_NEXT: ".prev_next.next",
         },

         CSS_CLASSES: {
           TOOLS_BAR: "zsgl-tools-bar1",
           CX_BTN: "cx-btn",
           ZSGL_AUTO_BTN: "zsgl-auto-btn",
         },

         STORAGE_PREFIX: "zsgl_task_",

         AES_CONFIG: {
           SECRET_KEY: "3c26d0badca24176",
           IV: "39934fc88c73430e",
         },

         HTTP_ENDPOINTS: {
           QUERY_COURSE_DETAIL: "queryCourseDetail.do",
           QUERY_QUESTION_DETAIL: "queryQuestionDetail.do",
           QUERY_STUDYMAP_GATE: "queryStudymapGate.do",
           QUERY_STUDYMAP_GATE_TASK: "queryStudymapGateTask.do",
           QUERY_NEW_EXAM_PAPER: "queryNewExamPaper.do",
         },

         URL_PATTERNS: {
           HOME_COURSE_DETAIL: "/home/courseDetail/",
           HOME_STUDY_DETAIL: "/home/studyDetail",
           HOME_EXAM_DETAIL: "/home/examDetail",
         },

         BUTTON_TEXT: {
           START_AUTO: "开始挂机",
           STOP_AUTO: "暂停挂机",
           LEARN_BUTTON: "立即学习",
           PASS_VIDEO: "秒过视频",
           DOWNLOAD_SUBTITLE: "下载字幕",
           DOWNLOAD_RESOURCE: "下载资源",
           RETURN: "返回",
           SUBMIT_EXAM: "交卷",
           NEXT_QUESTION: "下一题",
           PREV_QUESTION: "上一题",
         },

         /** 考试答案自动勾选（exam_auto_select）相关常量 */
         EXAM_AUTO_SELECT: {
           /** 配置开关键（config.ts zsgl 块 checkbox，默认 false） */
           CONFIG_KEY: "exam_auto_select",
           /** MutationObserver 防抖间隔(ms)：换题/选项渲染的瞬时抖动不触发匹配 */
           DEBOUNCE_MS: 300,
           /** 连续点击选项的间隔(ms)：给页面框架受控组件留出状态更新时间 */
           CLICK_STEP_MS: 100,
           /** 勾选后回读选中状态的验证延时(ms)：选中态(class/属性)更新是异步的 */
           VERIFY_DELAY_MS: 200,
           /** 选项候选选择器（选择器待实机校准）：原生 input 与 MUI 可视包装并列，收集时提升去重 */
           OPTION_SELECTORS: [
             'input[type="radio"]',
             'input[type="checkbox"]',
             '[role="radio"]',
             '[role="checkbox"]',
             ".MuiRadio-root",
             ".MuiCheckbox-root",
           ],
           /** 选项可视包装选择器：把原生 input 提升为选项单元，避免同一选项被 input 与包装各计一次 */
           OPTION_CONTAINER_SELECTOR:
             '.MuiRadio-root, .MuiCheckbox-root, [role="radio"], [role="checkbox"]',
           /** 选项文本优先容器：MUI FormControlLabel 同时包裹选项控件与文字，取不到再回退选项自身 */
           OPTION_TEXT_SELECTOR: ".MuiFormControlLabel-root",
           /** 选项文本兜底"包含匹配"的最小归一化长度；短于此值改用全等匹配（数字选项"7/15"、"对/错"等），防止包含匹配误命中 */
           OPTION_TEXT_FALLBACK_MIN_LEN: 2,
           /** 选项未就绪重试间隔(ms)：题面与选项可能分帧渲染 */
           RETRY_DELAY_MS: 800,
           /** 选项未就绪最大重试次数，超过后输出各选择器命中统计并放弃本轮 */
           MAX_RETRY: 2,
         },

         ERROR_MESSAGES: {
           INIT_FAILED: "初始化失败：超过最大尝试次数",
           VIDEO_NOT_FOUND: "视频查找失败：超过最大尝试次数",
           TASK_NOT_FOUND: "未找到任务元素",
           LOCKED: "被锁卡住了,请手动处理",
         },
       } as const;

export const SUPPORTED_COURSE_TYPES: readonly string[] = ['video', 'knowledge', 'scorm', 'document', 'audio', 'URL'] as const;
