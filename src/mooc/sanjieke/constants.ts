/*
 * @Description: 三节课（sanjieke）模块常量定义文件
 *
 * Copyright (c) 2026 by lzlj, All Rights Reserved.
 */

export const SANJIEKE_CONSTANTS = {
  /** 元素查找最大尝试次数 */
  MAX_ATTEMPT_COUNT: 10,
  /** 元素查找轮询间隔(ms) */
  CHECK_INTERVAL_MS: 500,
  /** 等待 xgplayer 懒创建 <video> 的超时时间(ms) */
  VIDEO_WAIT_TIMEOUT_MS: 30000,
  /** 播放按钮点击限流间隔(ms):多事件源叠加时防止密集点击导致播放器反复启停 */
  PLAY_CLICK_MIN_INTERVAL_MS: 2000,
  /** 自动恢复播放的最大重试次数,超过后停止重试 */
  MAX_PLAY_RETRY: 10,
  /** 自动恢复播放定时器间隔(ms) */
  VIDEO_PLAY_RESUME_INTERVAL_MS: 5000,
  /** 暂停风暴熔断:窗口时间内暂停次数达到该值后停止自动恢复(切窗死循环保护) */
  PAUSE_STORM_MAX_COUNT: 8,
  /** 暂停风暴熔断的统计窗口(ms) */
  PAUSE_STORM_WINDOW_MS: 60000,
  /** 等待 ai-quiz 课后题组件出现的超时时间(ms),超时视为本课时无课后题 */
  QUIZ_WAIT_TIMEOUT_MS: 25000,
  /** 选中选项到点击提交的间隔(ms) */
  QUIZ_OPTION_SELECT_DELAY_MS: 500,
  /** 提交后到检查下一题的间隔(ms) */
  QUIZ_SUBMIT_INTERVAL_MS: 2000,
  /** 课时视频结束后到跳转下一课时的缓冲时间(ms),给服务端回写完成状态留时间 */
  LESSON_TRANSITION_DELAY_MS: 5000,
  /** 课时完成标记的有效期(ms),防止树状态回写延迟导致重复播放 */
  LESSON_DONE_TTL_MS: 1000 * 60 * 60 * 24,
  /** 等待 content/tree 响应的超时时间(ms) */
  TREE_WAIT_TIMEOUT_MS: 30000,
  /** DOM 课时列表轮询间隔/上限(内容树钩子未就绪时的兜底数据源) */
  LESSON_DOM_CHECK_INTERVAL_MS: 2000,
  LESSON_DOM_CHECK_MAX_ATTEMPTS: 15,

  URL_PATTERNS: {
    /** 学习页路径前缀: /study/0/{courseId}/{lessonId} */
    STUDY_PATH: "/study/0/",
  },

  HTTP_ENDPOINTS: {
    /** 课时内容树 GET /study/0/{courseId}/content/tree */
    CONTENT_TREE: "/content/tree",
    /** 课程级课后题列表 GET /study/0/{courseId}/questions (实测通常返回 data.questions 空数组) */
    QUESTIONS: "/questions",
    /**
     * 真正的课后题来源(实测): AI 视频问答
     * GET /ai/0/{courseId}/video/question?videoId=&sectionId=&retryFlag=
     * 响应为单个题目对象: {code,msg,data:{id,type,question,options,answer,analysis,nextFlag,completedFlag}}
     * 注意: 该 URL 含 "video/question",会同时命中 questions_and_answers(在回调里过滤)
     */
    VIDEO_QUESTION: "video/question",
    /** 毕业状态 GET /study/cert/graduated?courseId= */
    CERT_GRADUATED: "cert/graduated",
  },

  SELECTORS: {
    /** xgplayer 挂载锚点(实例 id 形如 content-video-main-*) */
    VIDEO_CONTAINER: ".content-video-main",
    VIDEO: ".content-video-main video",
    PLAY_BUTTON: ".xgplayer-play",
    /** xgplayer 海报层(自定义元素 xg-poster):懒创建的点击入口,仅未起播时可见 */
    POSTER: "xg-poster, .xgplayer-poster",
    /**
     * xgplayer 大按钮起播覆盖层(实测:nostart 状态下存在)。
     * 用户实测:点 .xgplayer-play 仅起播媒体层,UI 停留 nostart(海报/加载层盖住画面,黑屏转圈);
     * 点 .xgplayer-start 才会走完整起播流程(解除 nostart、关闭覆盖层、正常渲染)
     */
    START_BUTTON: ".xgplayer-start",
    QUIZ_SUBMIT: ".quiz-submit-button",
    QUIZ_LIST: ".quiz-list",
    /** ai-quiz 课后题组件根节点(class 名包含 ai-quiz) */
    QUIZ_ROOT: "[class*='ai-quiz']",
    /** 课时列表:每课时一个 .chapter-container,内含 .node-item[node-id] */
    LESSON_NODE: ".menu-container .node-item[node-id]",
    LESSON_NODE_NAME: ".node-name-con",
    /** 课时完成标记:容器 class chapter-finish 或节点内 .status-con.section-finish */
    LESSON_FINISHED_STATUS: ".status-con.section-finish",
  },

  CSS_CLASSES: {
    /** 课时容器完成标记 class */
    LESSON_FINISHED: "chapter-finish",
  },

  STORAGE_PREFIX: {
    /** 课时完成标记: sanjieke_lesson_done_{courseId}_{lessonId} */
    LESSON_DONE: "sanjieke_lesson_done_",
    /** 课程完成标记: sanjieke_course_complete_{courseId} */
    COURSE_COMPLETE: "sanjieke_course_complete_",
  },

  /** 「立即学习」按钮文本(zsgl 课程详情页,打开三节课学习页) */
  LEARN_BUTTON_TEXT: "立即学习",

  ERROR_MESSAGES: {
    VIDEO_NOT_FOUND: "等待视频元素超时(xgplayer 未注入 <video>)",
    TREE_NOT_FOUND: "等待 content/tree 响应超时，无法枚举课时",
  },
} as const;
