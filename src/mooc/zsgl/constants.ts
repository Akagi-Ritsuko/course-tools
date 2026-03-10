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
    PLAYER_INIT_DELAY_MS: 5000,
    TASK_EXPIRE_MS: 1000 * 60 * 60 * 10,
    
    SELECTORS: {
        WATERMARK_FRAME: '#watermarkFrame',
        COURSE_VIDEO: 'video#course-video_html5_api',
        MUI_BUTTON_LABEL: '.MuiButton-label',
        MUI_BUTTON_ROOT: '.MuiButton-root',
        MUI_LIST_ROOT: 'ul.MuiList-root',
        MUI_PAPER_ROOT: '.MuiPaper-root',
        EXIT_SPAN: 'span.exit',
        NCELLS: 'div.ncells',
        CURRENTS: '.currents',
        ORANGE01: '.orange01',
        LOCK: '.lock',
        PREV_NEXT: '.prev_next.next',
    },
    
    CSS_CLASSES: {
        TOOLS_BAR: 'zsgl-tools-bar1',
        CX_BTN: 'cx-btn',
        ZSGL_AUTO_BTN: 'zsgl-auto-btn',
    },
    
    STORAGE_PREFIX: 'zsgl_task_',
    
    AES_CONFIG: {
        SECRET_KEY: '3c26d0badca24176',
        IV: '39934fc88c73430e',
    },
    
    HTTP_ENDPOINTS: {
        QUERY_COURSE_DETAIL: 'queryCourseDetail.do',
        QUERY_QUESTION_DETAIL: 'queryQuestionDetail.do',
        QUERY_STUDYMAP_GATE: 'queryStudymapGate.do',
        QUERY_STUDYMAP_GATE_TASK: 'queryStudymapGateTask.do',
    },
    
    URL_PATTERNS: {
        HOME_COURSE_DETAIL: '/home/courseDetail/',
        HOME_STUDY_DETAIL: '/home/studyDetail',
        HOME_EXAM_DETAIL: '/home/examDetail',
    },
    
    BUTTON_TEXT: {
        START_AUTO: '开始挂机',
        STOP_AUTO: '暂停挂机',
        PASS_VIDEO: '秒过视频',
        DOWNLOAD_SUBTITLE: '下载字幕',
        DOWNLOAD_RESOURCE: '下载资源',
        RETURN: '返回',
        SUBMIT_EXAM: '交卷',
        NEXT_QUESTION: '下一题',
        PREV_QUESTION: '上一题',
    },
    
    ERROR_MESSAGES: {
        INIT_FAILED: '初始化失败：超过最大尝试次数',
        VIDEO_NOT_FOUND: '视频查找失败：超过最大尝试次数',
        TASK_NOT_FOUND: '未找到任务元素',
        LOCKED: '被锁卡住了,请手动处理',
    },
} as const;

export const SUPPORTED_COURSE_TYPES: readonly string[] = ['video', 'knowledge', 'scorm', 'document', 'audio', 'URL'] as const;
