/*
 * @Author: guotao
 * @Date: 2025-09-26 17:51:14
 * @LastEditors: guotao
 * @LastEditTime: 2025-03-09
 * @FilePath: \course-tools1\src\mooc\zsgl\platform.ts
 * @Description: zsgl 平台工厂
 *
 * Copyright (c) 2025 by lzlj, All Rights Reserved.
 */
import { Mooc, MoocFactory } from '@App/internal/app/mooc';
import { Application } from '@App/internal/application';
import { ZsglCourse } from './course';
import { ZsglStudyMap } from './studyMap';
import { ZsglExam } from './exam';
import { ZSGL_CONSTANTS } from './constants';

/**
 * ZsglPlatform 平台工厂类
 * 根据页面URL特征来返回对应的mooc任务
 */
export class ZsglPlatform implements MoocFactory {
    /**
     * 创建Mooc实例
     * 通过URL特征进行平台识别
     */
    public CreateMooc(): Mooc {
        // 课程详情页
        if (this.isZsglCoursePage()) {
            Application.App.log.Info('当前平台：zsgl');
            Application.App.config.SetNamespace('zsgl');
            return new ZsglCourse();
        }

        // 学习地图页
        if (window.location.hash.includes(ZSGL_CONSTANTS.URL_PATTERNS.HOME_STUDY_DETAIL)) {
            Application.App.log.Info('当前平台：zsgl-studyDetail');
            return new ZsglStudyMap();
        }

        // 考试详情页
        if (window.location.hash.includes(ZSGL_CONSTANTS.URL_PATTERNS.HOME_EXAM_DETAIL)) {
            Application.App.log.Info('当前平台：zsgl-examDetail');
            return new ZsglExam();
        }

        return null;
    }

    /**
     * 检查是否为zsgl课程页面
     */
    private isZsglCoursePage(): boolean {
        return window.location.hash.includes(ZSGL_CONSTANTS.URL_PATTERNS.HOME_COURSE_DETAIL);
    }
}
