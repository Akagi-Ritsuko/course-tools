# Checklist

## Manifest 与依赖
- [x] 两份 manifest（cxmooc-tools / zsgl-tools）均为合法 MV3：`manifest_version: 3`、`background.service_worker`、`action`、`host_permissions` 含 zsgl/sanjieke/cx.icodef 三域、`tabs` 权限、WAR 对象数组新格式、无 `content_security_policy` 字段、`match_origin_as_fallback`（JSON 解析通过 + 旧字段 grep 零匹配）
- [ ] Chrome 加载已解压扩展无 manifest 报错，SW 状态正常（需在用户 Chrome 环境手动加载验证）
- [x] `@types/chrome` 已升级（0.0.103 → 0.3.0）且 `npm run build` 通过（webpack compiled successfully）

## background SW 兼容
- [x] 所有 `chrome.runtime.onMessage` 监听器在 SW 入口顶层同步注册，无 `await` 前置（GM 桥接 onConnect/onInstalled/onAlarm/onClicked/onMessage 均位于 `appReady = init()` 之前，处理器内 `appReady.then` 惰性初始化）
- [x] 全仓 `src/` 内无 `chrome.extension`、`chrome.browserAction`、`tabs.executeScript` 残留引用（grep 零匹配，log 目录为站点转储已排除）
- [x] 每小时版本检查走 `chrome.alarms`（SW 内无长期存活的 `setInterval`）
- [x] contextMenus 带 id 创建 + onClicked 监听，`removeAll` 保证 SW 重启后菜单不重复
- [x] 热更新远程代码拉取/注入相关代码（dealScript/dealSymbol/this.source 等）已删除，版本检查仅 badge 提示
- [x] `injectedScript()` 死代码路径已整体删除

## 功能链路
- [ ] zsgl 页面打开后 mooc.js 注入主世界正常（injected-js 节点存在，功能日志输出）（需真实站点环境验证）
- [ ] sanjieke 页面注入正常，自动挂机/答题流程可运行（需真实站点环境验证）
- [x] 无媒体任务：关页不依赖 SW `setTimeout`（代码层验证：studyMap URL 携带 `cxPlainTaskClose` 参数且位于 hash 之前，任务页 start.ts 计时后发 `ZSGL_PLAIN_TASK_CLOSE_SELF`，background 按 sender.tab.id 关页；产物 start.js/background.js 均含新逻辑）
- [ ] 学习地图页在任务页关闭后刷新并推进下一任务（需真实站点环境验证）
- [x] sanjieke 毕业通知：关页延迟 1500ms，start.ts 具备 ack 校验与最多 2 次重试（sendRelayWithAck）
- [ ] SW 冷启动场景：手动停止 SW 后触发毕业通知，zsgl 课程页仍收到中转（幂等不重复闭环）（需真实站点环境验证）
- [ ] 每日积分 popup 链路正常（popup→tabs.sendMessage→start.ts→页面）（需真实站点环境验证）

## 工作区
- [x] 迁移改动全部在 `feature/mv3-migration` 分支上（当前分支已确认；改动未提交，待用户指示）

## 待手动验证项说明
以下 6 项依赖真实 Chrome + zsgl/sanjieke 企业站点环境（登录态、SW 冷启动操作），无法在本环境自动化完成，需按 spec 场景手动执行：
1. Chrome 加载 `build/cxmooc-tools/`（加载已解压扩展程序）
2. zsgl/sanjieke 页面注入与挂机
3. 无媒体任务端到端闭环（开页→10 秒自关→学习地图刷新）
4. 毕业通知中转 + `chrome://serviceworker-internals` 手动 Stop SW 后复测
5. 每日积分 popup 链路
