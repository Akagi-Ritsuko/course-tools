/*
 * @Description: 三节课任务基类,提供托管监听器与定时器清理能力
 *
 * Copyright (c) 2026 by lzlj, All Rights Reserved.
 */
import { Task, TaskEvent } from "@App/internal/app/task";
import { Application } from "@App/internal/application";
import { TimerManager } from "../zsgl/utils/utils";

/**
 * SanjiekeTaskBase 抽象任务基类
 * 与 zsgl 的 ZsglTask 类似但独立实现,避免触碰 zsgl 稳定逻辑
 */
export abstract class SanjiekeTaskBase extends Task {
  /** 托管监听器的清理函数列表,Stop 时统一移除 */
  protected cleanupFns: Array<() => void> = [];
  /** 定时器管理器 */
  protected timerManager: TimerManager = new TimerManager();

  protected callEvent(event: TaskEvent, ...args: any): void {
    if (event === "taskComplete") {
      this.done = true;
    }
    super.callEvent(event, ...args);
  }

  /**
   * 添加托管事件监听器,注册信息会记录到 cleanupFns,Stop 时统一移除
   */
  protected addManagedListener(
    target: EventTarget,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void {
    target.addEventListener(type, listener, options);
    this.cleanupFns.push(() => {
      target.removeEventListener(type, listener, options);
    });
  }

  /** 执行并清空所有托管监听器的清理函数 */
  protected runCleanup(): void {
    this.cleanupFns.forEach((fn) => {
      try {
        fn();
      } catch (e) {
        Application.App.log.Warn("[sanjieke] 清理监听器失败", e);
      }
    });
    this.cleanupFns = [];
  }

  public Stop(): Promise<void> {
    this.timerManager.clearAll();
    this.runCleanup();
    return Promise.resolve();
  }
}
