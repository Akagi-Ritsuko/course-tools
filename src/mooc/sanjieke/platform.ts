/*
 * @Description: 三节课（sanjieke）平台工厂
 * 按域名 lzlj.b.sanjieke.cn + 路径 /study/0/{courseId}/{lessonId} 识别学习页,
 * 配置命名空间 sanjieke(与 zsgl 配置隔离),返回 SanjiekeStudy 任务集
 *
 * Copyright (c) 2026 by lzlj, All Rights Reserved.
 */
import { Mooc, MoocFactory } from '@App/internal/app/mooc';
import { Application } from '@App/internal/application';
import { SanjiekeStudy } from './study';
import { SANJIEKE_CONSTANTS } from './constants';

/**
 * SanjiekePlatform 平台工厂类
 * 根据页面URL特征来返回对应的mooc任务
 */
export class SanjiekePlatform implements MoocFactory {
  /**
   * 创建Mooc实例
   * 通过域名 + 路径特征进行平台识别
   */
  public CreateMooc(): Mooc {
    if (!this.isSanjiekeStudyPage()) {
      return null;
    }
    Application.App.config.SetNamespace("sanjieke");
    Application.App.log.Info("当前平台：sanjieke");
    return new SanjiekeStudy();
  }

  /**
   * 检查是否为三节课学习页
   * 页面格式: https://lzlj.b.sanjieke.cn/study/0/{courseId}/{lessonId}
   */
  private isSanjiekeStudyPage(): boolean {
    return (
      window.location.hostname === "lzlj.b.sanjieke.cn" &&
      window.location.pathname.startsWith(
        SANJIEKE_CONSTANTS.URL_PATTERNS.STUDY_PATH,
      )
    );
  }
}
