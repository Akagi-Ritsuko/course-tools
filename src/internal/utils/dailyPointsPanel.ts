import { Application } from "../application";

export interface PointsProgressData {
  knowledgeLink: string;
  contributionLimit: number;
  interactionLimit: number;
}

export class DailyPointsFloatingPanel {
  private container: HTMLDivElement | null = null;
  private isRunning = false;
  private progressData = {
    learning: { current: 0, limit: 100 },
    contribution: { current: 0, limit: 300 },
    interaction: { current: 0, limit: 100 },
  };

  constructor() {
    console.log("[每日积分] panel: 构造函数被调用");
    this.init();
  }

  private init() {
    console.log("[每日积分] panel: init方法被调用");
    window.addEventListener("load", () => {
      console.log("[每日积分] panel: window.onload 触发");
      this.injectStyles();
      this.listenForMessages();
    });
  }

  private injectStyles() {
    const css = `
      .daily-points-panel {
        width: 320px;
        position: fixed;
        z-index: 100001;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        overflow: hidden;
        transition: opacity 0.2s ease;
      }

      .daily-points-panel:hover {
        background: rgba(255, 255, 255, 1);
      }

      .daily-points-panel .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        cursor: move;
        user-select: none;
      }

      .daily-points-panel .panel-header h3 {
        margin: 0;
        color: white;
        font-size: 14px;
        font-weight: 600;
      }

      .daily-points-panel .panel-header .close-btn {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        line-height: 1;
        transition: background 0.2s;
      }

      .daily-points-panel .panel-header .close-btn:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .daily-points-panel .panel-content {
        padding: 16px;
      }

      .daily-points-panel .progress-item {
        margin-bottom: 16px;
      }

      .daily-points-panel .progress-item:last-child {
        margin-bottom: 0;
      }

      .daily-points-panel .progress-label {
        display: flex;
        justify-content: space-between;
        margin-bottom: 6px;
        font-size: 13px;
      }

      .daily-points-panel .progress-label .label {
        color: #64748b;
      }

      .daily-points-panel .progress-label .value {
        color: #1e293b;
        font-weight: 500;
      }

      .daily-points-panel .progress-bar {
        height: 8px;
        background: #e2e8f0;
        border-radius: 4px;
        overflow: hidden;
      }

      .daily-points-panel .progress-fill {
        height: 100%;
        border-radius: 4px;
        transition: width 0.3s ease;
      }

      .daily-points-panel .progress-fill.learning {
        background: linear-gradient(90deg, #3b82f6, #60a5fa);
      }

      .daily-points-panel .progress-fill.contribution {
        background: linear-gradient(90deg, #10b981, #34d399);
      }

      .daily-points-panel .progress-fill.interaction {
        background: linear-gradient(90deg, #f59e0b, #fbbf24);
      }

      .daily-points-panel .total-progress {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #e2e8f0;
      }

      .daily-points-panel .total-progress .progress-bar {
        height: 10px;
      }

      .daily-points-panel .total-progress .progress-fill {
        background: linear-gradient(90deg, #8b5cf6, #a78bfa);
      }

      .daily-points-panel .panel-footer {
        padding: 12px 16px;
        border-top: 1px solid #e2e8f0;
      }

      .daily-points-panel .stop-btn {
        width: 100%;
        padding: 10px;
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s;
      }

      .daily-points-panel .stop-btn:hover {
        background: #dc2626;
      }

      .daily-points-panel .status-badge {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 500;
        margin-left: 8px;
      }

      .daily-points-panel .status-badge.running {
        background: #dcfce7;
        color: #16a34a;
      }
    `;

    const style = document.createElement("style");
    style.innerHTML = css;
    document.head.appendChild(style);
  }

  private listenForMessages() {
    console.log("[每日积分] panel: 初始化消息监听");
    window.addEventListener("message", (event) => {
      if (event.source !== window) return;

      const message = event.data;
      console.log("[每日积分] panel: 收到页面消息", message);

      if (message.type === "START_DAILY_POINTS") {
        console.log("[每日积分] panel: 处理START_DAILY_POINTS", message.data);
        this.start(message.data);
      } else if (message.type === "STOP_DAILY_POINTS") {
        console.log("[每日积分] panel: 处理STOP_DAILY_POINTS");
        this.stop();
      } else if (message.type === "UPDATE_PROGRESS") {
        console.log("[每日积分] panel: 处理UPDATE_PROGRESS", message.data);
        this.updateProgress(message.data);
      }
    });
  }

  public start(data: PointsProgressData) {
    console.log(
      "[每日积分] panel: start方法被调用",
      data,
      "isRunning:",
      this.isRunning,
    );
    if (this.isRunning) {
      console.log("[每日积分] panel: 任务已在运行中，跳过");
      return;
    }

    this.isRunning = true;
    this.progressData.contribution.limit = data.contributionLimit || 300;
    this.progressData.interaction.limit = data.interactionLimit || 100;

    console.log("[每日积分] panel: 创建悬浮窗");
    this.createPanel();
    Application.App.log?.Info("每日积分任务已开始");
  }

  public stop() {
    console.log("[每日积分] panel: stop方法被调用");
    this.isRunning = false;
    this.removePanel();
    Application.App.log?.Info("每日积分任务已停止");
  }

  public updateProgress(data: {
    learning?: { current: number; limit?: number };
    contribution?: { current: number; limit?: number };
    interaction?: { current: number; limit?: number };
  }) {
    if (data.learning) {
      this.progressData.learning.current = data.learning.current;
      if (data.learning.limit)
        this.progressData.learning.limit = data.learning.limit;
    }
    if (data.contribution) {
      this.progressData.contribution.current = data.contribution.current;
      if (data.contribution.limit)
        this.progressData.contribution.limit = data.contribution.limit;
    }
    if (data.interaction) {
      this.progressData.interaction.current = data.interaction.current;
      if (data.interaction.limit)
        this.progressData.interaction.limit = data.interaction.limit;
    }
    this.updatePanelContent();
  }

  private createPanel() {
    if (this.container) return;

    this.container = document.createElement("div");
    this.container.className = "daily-points-panel";
    this.container.innerHTML = this.getPanelHTML();
    document.body.appendChild(this.container);

    this.initDraggable();
    this.loadPosition();
  }

  private removePanel() {
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }

  private getPanelHTML(): string {
    const learningPercent = this.getPercent(this.progressData.learning);
    const contributionPercent = this.getPercent(this.progressData.contribution);
    const interactionPercent = this.getPercent(this.progressData.interaction);
    const totalPercent = this.getTotalPercent();

    return `
      <div class="panel-header" id="daily-points-header">
        <h3>每日积分进度 <span class="status-badge running">运行中</span></h3>
        <button class="close-btn" id="daily-points-close">×</button>
      </div>
      <div class="panel-content">
        <div class="progress-item">
          <div class="progress-label">
            <span class="label">学习积分</span>
            <span class="value">${this.progressData.learning.current} / ${
      this.progressData.learning.limit
    }</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill learning" style="width: ${learningPercent}%"></div>
          </div>
        </div>
        
        <div class="progress-item">
          <div class="progress-label">
            <span class="label">贡献积分</span>
            <span class="value">${this.progressData.contribution.current} / ${
      this.progressData.contribution.limit
    }</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill contribution" style="width: ${contributionPercent}%"></div>
          </div>
        </div>
        
        <div class="progress-item">
          <div class="progress-label">
            <span class="label">互动积分</span>
            <span class="value">${this.progressData.interaction.current} / ${
      this.progressData.interaction.limit
    }</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill interaction" style="width: ${interactionPercent}%"></div>
          </div>
        </div>
        
        <div class="progress-item total-progress">
          <div class="progress-label">
            <span class="label">总进度</span>
            <span class="value">${totalPercent.toFixed(1)}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${totalPercent}%"></div>
          </div>
        </div>
      </div>
      <div class="panel-footer">
        <button class="stop-btn" id="daily-points-stop">结束任务</button>
      </div>
    `;
  }

  private updatePanelContent() {
    if (!this.container) return;

    const learningPercent = this.getPercent(this.progressData.learning);
    const contributionPercent = this.getPercent(this.progressData.contribution);
    const interactionPercent = this.getPercent(this.progressData.interaction);
    const totalPercent = this.getTotalPercent();

    const content = this.container.querySelector(".panel-content");
    if (content) {
      const items = content.querySelectorAll(".progress-item");

      items[0].querySelector(
        ".value",
      )!.textContent = `${this.progressData.learning.current} / ${this.progressData.learning.limit}`;
      (items[0].querySelector(
        ".progress-fill",
      ) as HTMLElement)!.style.width = `${learningPercent}%`;

      items[1].querySelector(
        ".value",
      )!.textContent = `${this.progressData.contribution.current} / ${this.progressData.contribution.limit}`;
      (items[1].querySelector(
        ".progress-fill",
      ) as HTMLElement)!.style.width = `${contributionPercent}%`;

      items[2].querySelector(
        ".value",
      )!.textContent = `${this.progressData.interaction.current} / ${this.progressData.interaction.limit}`;
      (items[2].querySelector(
        ".progress-fill",
      ) as HTMLElement)!.style.width = `${interactionPercent}%`;

      const totalItem = items[3];
      totalItem.querySelector(".value")!.textContent = `${totalPercent.toFixed(
        1,
      )}%`;
      (totalItem.querySelector(
        ".progress-fill",
      ) as HTMLElement)!.style.width = `${totalPercent}%`;
    }
  }

  private getPercent(data: { current: number; limit: number }): number {
    return Math.min((data.current / data.limit) * 100, 100);
  }

  private getTotalPercent(): number {
    const totalCurrent =
      this.progressData.learning.current +
      this.progressData.contribution.current +
      this.progressData.interaction.current;
    const totalLimit =
      this.progressData.learning.limit +
      this.progressData.contribution.limit +
      this.progressData.interaction.limit;
    return Math.min((totalCurrent / totalLimit) * 100, 100);
  }

  private initDraggable() {
    if (!this.container) return;

    const header = this.container.querySelector(
      "#daily-points-header",
    ) as HTMLElement;
    const closeBtn = this.container.querySelector(
      "#daily-points-close",
    ) as HTMLElement;
    const stopBtn = this.container.querySelector(
      "#daily-points-stop",
    ) as HTMLElement;

    closeBtn?.addEventListener("click", () => this.stop());
    stopBtn?.addEventListener("click", () => this.stop());

    if (header) {
      header.onmousedown = (downEvent: MouseEvent) => {
        const relaX = downEvent.clientX - this.container!.offsetLeft;
        const relaY = downEvent.clientY - this.container!.offsetTop;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const containerWidth = this.container!.offsetWidth;
        const containerHeight = this.container!.offsetHeight;

        document.onmousemove = (moveEvent: MouseEvent) => {
          let targetX = moveEvent.clientX - relaX;
          let targetY = moveEvent.clientY - relaY;

          if (targetX <= 0) targetX = 0;
          if (targetY <= 0) targetY = 0;
          if (targetX >= windowWidth - containerWidth)
            targetX = windowWidth - containerWidth;
          if (targetY >= windowHeight - containerHeight)
            targetY = windowHeight - containerHeight;

          this.container!.style.left = targetX + "px";
          this.container!.style.top = targetY + "px";
        };

        document.onmouseup = () => {
          document.onmouseup = null;
          document.onmousemove = null;
          this.savePosition();
        };
      };
    }
  }

  private loadPosition() {
    if (!this.container) return;

    const x = parseInt(
      Application.App.config?.GetConfig("daily_points_x", "60") || "60",
    );
    const y = parseInt(
      Application.App.config?.GetConfig("daily_points_y", "40") || "40",
    );

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const containerWidth = this.container.offsetWidth;
    const containerHeight = this.container.offsetHeight;

    let finalX = x;
    let finalY = y;

    if (finalX < 0) finalX = 0;
    if (finalX >= windowWidth - containerWidth)
      finalX = windowWidth - containerWidth;
    if (finalY < 0) finalY = 0;
    if (finalY >= windowHeight - containerHeight)
      finalY = windowHeight - containerHeight;

    this.container.style.left = finalX + "px";
    this.container.style.top = finalY + "px";
  }

  private savePosition() {
    if (!this.container) return;
    Application.App.config?.SetConfig(
      "daily_points_x",
      this.container.style.left.replace("px", ""),
    );
    Application.App.config?.SetConfig(
      "daily_points_y",
      this.container.style.top.replace("px", ""),
    );
  }
}
