import { Application } from "../application";
import { ZsglDailyPoints } from "../../mooc/zsgl/dailyPoints";

export interface PointsProgressData {
  knowledgeLink: string;
  learningLimit: number;
  contributionLimit: number;
  interactionLimit: number;
  taskDelay: number;
}

export class DailyPointsFloatingPanel {
         private container: HTMLDivElement | null = null;
         private isRunning = false;
         private isStopped = false;
         private progressData = {
           learning: { current: 0, target: 100 },
           contribution: { current: 0, target: 300 },
           interaction: { current: 0, target: 100 },
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
              new ZsglDailyPoints();
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

      .daily-points-panel .panel-header .header-buttons {
        display: flex;
        gap: 8px;
      }

      .daily-points-panel .panel-header .refresh-btn,
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
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .daily-points-panel .panel-header .refresh-btn:hover,
      .daily-points-panel .panel-header .close-btn:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .daily-points-panel .panel-header .refresh-btn svg {
        width: 14px;
        height: 14px;
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
        display: flex;
        gap: 12px;
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

      .daily-points-panel .status-badge.stopped {
        background: #fee2e2;
        color: #dc2626;
      }

      .confirmation-dialog {
        width: 400px;
      }

      .confirmation-dialog .panel-header {
        cursor: default !important;
      }

      .confirmation-content {
        line-height: 1.6;
      }

      .confirmation-title {
        font-weight: 600;
        margin-bottom: 12px;
        color: #1e293b;
      }

      .task-list {
        list-style: none;
        padding: 0;
        margin: 0 0 16px 0;
      }

      .task-list li {
        padding: 8px 0;
        display: flex;
        align-items: center;
        gap: 8px;
        color: #475569;
      }

      .task-icon {
        font-size: 16px;
      }

      .confirmation-notice {
        background: #fef3c7;
        border-radius: 6px;
        padding: 12px;
        margin-bottom: 16px;
      }

      .confirmation-notice p {
        margin: 0 0 8px 0;
        font-weight: 500;
        color: #92400e;
      }

      .confirmation-notice ul {
        margin: 0;
        padding-left: 20px;
        color: #a16207;
      }

      .confirmation-checkbox {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        color: #64748b;
      }

      .confirmation-checkbox input {
        width: 16px;
        height: 16px;
        cursor: pointer;
      }

      .cancel-btn {
        flex: 1;
        padding: 10px;
        background: #e2e8f0;
        color: #475569;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s;
      }

      .cancel-btn:hover {
        background: #cbd5e1;
      }

      .confirm-btn {
        flex: 1;
        padding: 10px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s;
      }

      .confirm-btn:disabled {
        background: #94a3b8;
        cursor: not-allowed;
      }

      .confirm-btn:not(:disabled):hover {
        background: #2563eb;
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
             console.log("[每日积分] panel: 收到页面消息1", message);

             if (message.type === "START_DAILY_POINTS") {
               console.log(
                 "[每日积分] panel: 处理START_DAILY_POINTS",
                 message.data,
               );
               this.start(message.data);
             } else if (message.type === "STOP_DAILY_POINTS") {
               console.log("[每日积分] panel: 处理STOP_DAILY_POINTS");
               this.stop();
             } else if (message.type === "UPDATE_PROGRESS") {
               console.log(
                 "[每日积分] panel: 处理UPDATE_PROGRESS",
                 message.data,
               );
               this.handlePointsUpdated(message.data);
             } else if (message.type === "POINTS_UPDATED") {
               console.log(
                 "[每日积分] panel: 处理POINTS_UPDATED",
                 message.data,
               );
               if (message.data) {
                 this.handlePointsUpdated(message.data);
               }
             } else if (message.type === "TASK_STOPPED") {
               console.log("[每日积分] panel: 处理TASK_STOPPED");
               this.handleTaskStopped();
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

          this.progressData.learning.target = data.learningLimit !== undefined ? data.learningLimit : 100;
          this.progressData.contribution.target = data.contributionLimit !== undefined ? data.contributionLimit : 300;
          this.progressData.interaction.target = data.interactionLimit !== undefined ? data.interactionLimit : 100;

          this.showConfirmationDialog(() => {
            this.isRunning = true;
            this.isStopped = false;
            console.log("[每日积分] panel: 创建进度悬浮窗");
            this.createPanel();

            window.postMessage(
              { type: "CONFIRM_START_TASK", data: data },
              "*",
            );

            Application.App.log?.Info("每日积分任务已开始");
          });
        }

         public stop() {
           console.log("[每日积分] panel: stop方法被调用");
           this.isRunning = false;
           this.isStopped = false;
           this.removePanel();
          //  window.postMessage({ type: "STOP_DAILY_POINTS" }, "*");
           Application.App.log?.Info("每日积分任务已停止");
         }

         private handleTaskStopped() {
           this.isStopped = true;
           this.updateStatusBadge();
         }

         private updateStatusBadge() {
           if (!this.container) return;
           const badge = this.container.querySelector(".status-badge");
           if (badge) {
             badge.textContent = "已停止";
             badge.classList.remove("running");
             badge.classList.add("stopped");
           }
         }

         private handlePointsUpdated(data: {
           learning?: { current: number; target?: number };
           contribution?: { current: number; target?: number };
           interaction?: { current: number; target?: number };
         }) {
           if (data.learning) {
             this.progressData.learning.current = data.learning.current;
             if (data.learning.target)
               this.progressData.learning.target = data.learning.target;
           }
           if (data.contribution) {
             this.progressData.contribution.current = data.contribution.current;
             if (data.contribution.target)
               this.progressData.contribution.target = data.contribution.target;
           }
           if (data.interaction) {
             this.progressData.interaction.current = data.interaction.current;
             if (data.interaction.target)
               this.progressData.interaction.target = data.interaction.target;
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

         public showConfirmationDialog(onConfirm: () => void): void {
           if (this.container) {
             this.container.remove();
             this.container = null;
           }

           this.container = document.createElement("div");
           this.container.className = "daily-points-panel confirmation-dialog";
           this.container.innerHTML = this.getConfirmationHTML();
           document.body.appendChild(this.container);

           this.centerDialog();

           const confirmBtn = this.container.querySelector(
             "#daily-points-confirm",
           ) as HTMLButtonElement;
           const cancelBtn = this.container.querySelector(
             "#daily-points-cancel",
           ) as HTMLElement;
           const checkbox = this.container.querySelector(
             "#agree-terms",
           ) as HTMLInputElement;

           checkbox?.addEventListener("change", () => {
             if (checkbox.checked) {
               confirmBtn.disabled = false;
             } else {
               confirmBtn.disabled = true;
             }
           });

           confirmBtn?.addEventListener("click", () => {
             this.removePanel();
             onConfirm();
           });

           cancelBtn?.addEventListener("click", () => {
             this.removePanel();
           });
         }

         private getConfirmationHTML(): string {
           return `
    <div class="panel-header" style="cursor: default;">
      <h3>每日积分任务说明</h3>
    </div>
    <div class="panel-content">
      <div class="confirmation-content">
        <p class="confirmation-title">即将开始执行以下任务：</p>
        <ul class="task-list">
          <li><span class="task-icon">📚</span> 学习积分：自动观看课程视频获取积分（上限100分）</li>
          <li><span class="task-icon">📖</span> 贡献积分：通过知识阅读获取积分（上限300分）</li>
          <li><span class="task-icon">💬</span> 互动积分：通过知识分享获取积分（上限100分）</li>
        </ul>
        <div class="confirmation-notice">
          <p>⚠️ 注意事项：</p>
          <ul>
            <li><strong>知识链接要求：</strong>需填写非个人空间主创或辅创的知识空间文章链接</li>
            <li><strong>风险提示：</strong>本功能通过调用知识分享和知识阅读API实现积分获取，属于利用系统漏洞，请在了解风险后谨慎使用</li>
            <li>任务执行期间请勿关闭页面</li>
            <li>可随时点击"结束任务"停止</li>
            <li>积分数据仅供参考，以实际为准</li>
          </ul>
        </div>
        <label class="confirmation-checkbox">
          <input type="checkbox" id="agree-terms" />
          <span>我已了解任务内容及风险，同意开始执行</span>
        </label>
      </div>
    </div>
    <div class="panel-footer">
      <button class="cancel-btn" id="daily-points-cancel">取消</button>
      <button class="confirm-btn" id="daily-points-confirm" disabled>开始任务</button>
    </div>
  `;
         }

         private centerDialog(): void {
           if (!this.container) return;

           const containerWidth = this.container.offsetWidth;
           const containerHeight = this.container.offsetHeight;
           const windowWidth = window.innerWidth;
           const windowHeight = window.innerHeight;

           this.container.style.left =
             (windowWidth - containerWidth) / 2 + "px";
           this.container.style.top =
             (windowHeight - containerHeight) / 2 + "px";
         }

         private getPanelHTML(): string {
           const learningPercent = this.getPercent(this.progressData.learning);
           const contributionPercent = this.getPercent(
             this.progressData.contribution,
           );
           const interactionPercent = this.getPercent(
             this.progressData.interaction,
           );
           const totalPercent = this.getTotalPercent();
           const statusClass = this.isStopped ? "stopped" : "running";
           const statusText = this.isStopped ? "已停止" : "运行中";

           return `
      <div class="panel-header" id="daily-points-header">
        <h3>每日积分进度 <span class="status-badge ${statusClass}">${statusText}</span></h3>
        <div class="header-buttons">
          <button class="refresh-btn" id="daily-points-refresh" title="刷新">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
            </svg>
          </button>
          <button class="close-btn" id="daily-points-close">×</button>
        </div>
      </div>
      <div class="panel-content">
        <div class="progress-item">
          <div class="progress-label">
            <span class="label">学习积分</span>
            <span class="value">${this.progressData.learning.current} / ${
              this.progressData.learning.target
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
              this.progressData.contribution.target
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
              this.progressData.interaction.target
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
           const contributionPercent = this.getPercent(
             this.progressData.contribution,
           );
           const interactionPercent = this.getPercent(
             this.progressData.interaction,
           );
           const totalPercent = this.getTotalPercent();

           const content = this.container.querySelector(".panel-content");
           if (content) {
             const items = content.querySelectorAll(".progress-item");

             items[0].querySelector(
              ".value",
            )!.textContent = `${this.progressData.learning.current} / ${this.progressData.learning.target}`;
            (items[0].querySelector(
              ".progress-fill",
            ) as HTMLElement)!.style.width = `${learningPercent}%`;

            items[1].querySelector(
              ".value",
            )!.textContent = `${this.progressData.contribution.current} / ${this.progressData.contribution.target}`;
            (items[1].querySelector(
              ".progress-fill",
            ) as HTMLElement)!.style.width = `${contributionPercent}%`;

            items[2].querySelector(
              ".value",
            )!.textContent = `${this.progressData.interaction.current} / ${this.progressData.interaction.target}`;
            (items[2].querySelector(
              ".progress-fill",
            ) as HTMLElement)!.style.width = `${interactionPercent}%`;

             const totalItem = items[3];
             totalItem.querySelector(
               ".value",
             )!.textContent = `${totalPercent.toFixed(1)}%`;
             (totalItem.querySelector(
               ".progress-fill",
             ) as HTMLElement)!.style.width = `${totalPercent}%`;
           }
         }

         private getPercent(data: { current: number; target: number }): number {
          return Math.min((data.current / data.target) * 100, 100);
        }

        private getTotalPercent(): number {
          const totalCurrent =
            this.progressData.learning.current +
            this.progressData.contribution.current +
            this.progressData.interaction.current;
          const totalTarget =
            this.progressData.learning.target +
            this.progressData.contribution.target +
            this.progressData.interaction.target;
          return Math.min((totalCurrent / totalTarget) * 100, 100);
        }

         private initDraggable() {
           if (!this.container) return;

           const header = this.container.querySelector(
             "#daily-points-header",
           ) as HTMLElement;
           const closeBtn = this.container.querySelector(
             "#daily-points-close",
           ) as HTMLElement;
           const refreshBtn = this.container.querySelector(
             "#daily-points-refresh",
           ) as HTMLElement;
           const stopBtn = this.container.querySelector(
             "#daily-points-stop",
           ) as HTMLElement;

           closeBtn?.addEventListener("click", () => {
             this.stop();
             window.postMessage({ type: "STOP_DAILY_POINTS" }, "*");
           });
           refreshBtn?.addEventListener("click", () => {
             window.postMessage({ type: "REFRESH_POINTS" }, "*");
           });
           stopBtn?.addEventListener("click", () => {
             window.postMessage({ type: "STOP_DAILY_POINTS" }, "*");
           });

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
