/*
 * @Author: guotao
 * @Date: 2025-09-26 17:51:14
 * @LastEditors: guotao
 * @LastEditTime: 2025-10-10 16:52:18
 * @FilePath: \course-tools\src\mooc\zsgl\platform.ts
 * @Description: 
 * 
 * Copyright (c) 2025 by lzlj, All Rights Reserved. 
 */
import { Mooc, MoocFactory } from '@App/internal/app/mooc';
import { Application } from '@App/internal/application';
import { ZsglCourse } from './course';
// import { ZsglVideo } from './video';

import { ZsglStudyMap } from './studyMap';
import { ZsglExam } from './exam';
export class ZsglPlatform implements MoocFactory{
    public CreateMooc(): Mooc {
        // 通过URL特征进行平台识别
        if (this.isZsglCoursePage()) {
            console.log('当前平台：zsgl');
            Application.App.config.SetNamespace('zsgl')
            return new ZsglCourse();
        }
        if (window.location.hash.includes('/home/studyDetail')) {
            console.log('当前平台：zsgl-studyDetail');
            return new ZsglStudyMap();
      }
          if (window.location.hash.includes("/home/examDetail")) {
            console.log("当前平台：zsgl-examDetail");
            return new ZsglExam();
          }
    }
    private isZsglCoursePage(): boolean {
        // console.log("zsgl platform check url:",document.URL);
        // return document.URL.indexOf('/courseDetail')>0;
            return window.location.hash.includes('/home/courseDetail/');
    }
}