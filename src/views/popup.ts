import {NewBackendConfig, ChromeConfigItems} from "../internal/utils/config";
import {Application, Backend, Launcher} from "../internal/application";
import {SystemConfig} from "../config";
import {boolToString, protocolPrompt, toBool} from "../internal/utils/utils";
import {createApp, ref, computed, onMounted} from 'vue';
import '../styles/globals.css';

import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import DailyPointsConfig from "./components/DailyPointsConfig.vue";

class popup implements Launcher {
    protected vm: ReturnType<typeof createApp>;

    constructor() {
    }

    public start() {
        this.vm = createApp({
          components: {
            TabsRoot,
            TabsList,
            TabsTrigger,
            TabsContent,
            Button,
            Input,
            Label,
            Card,
            CardContent,
            CardHeader,
            CardTitle,
            CardDescription,
            DailyPointsConfig,
          },
          setup() {
            const selectKey = ref("zsgl");
            const configs = ref(SystemConfig.config);

            const toVal = (type: string, val: string): boolean | string => {
              switch (type) {
                case "checkbox": {
                  return toBool(val);
                }
                default: {
                  return val;
                }
              }
            };

            const loadConfigs = async () => {
              for (let key in configs.value) {
                for (let index in configs.value[key].items) {
                  let item = configs.value[key].items[index];
                  let val = Application.App.config.GetNamespaceConfig(
                    key,
                    item.key,
                    undefined,
                  );
                  if (val == undefined) {
                    val = Application.App.config.GetConfig(
                      item.key,
                      item.value,
                    );
                  }
                  item.value = toVal(item.type, val);
                }
              }
            };

            const changeTab = (key: string) => {
              selectKey.value = key;
            };

            const change = async (
              namespace: string,
              key: string,
              type: string,
              val: string | boolean,
              index: number,
              prompt: string,
            ) => {
              if (prompt !== undefined) {
                if (!protocolPrompt(prompt, key)) {
                  let val = Application.App.config.GetNamespaceConfig(
                    namespace,
                    key,
                    undefined,
                  );
                  if (val == undefined) {
                    val = Application.App.config.GetConfig(
                      key,
                      configs.value[namespace].items[index].value,
                    );
                  }
                  configs.value[namespace].items[index].value = toVal(
                    type,
                    val,
                  );
                  return false;
                }
              }
              if (namespace == "common") {
                namespace = "";
              }
              switch (type) {
                case "checkbox": {
                  await Application.App.config.SetNamespaceConfig(
                    namespace,
                    key,
                    boolToString(<boolean>val),
                  );
                  break;
                }
                default: {
                  await Application.App.config.SetNamespaceConfig(
                    namespace,
                    key,
                    <string>val,
                  );
                }
              }
            };

            const handleStartDailyPoints = (config: any) => {
              console.log("[每日积分] popup: 点击开始按钮", config);

              const targetUrl =
                config.knowledgeLink ||
                "https://zsgl.lzlj.com/znWeb/znPortal/#/home/homePage";
              console.log("[每日积分] popup: 目标URL", targetUrl);

              chrome.tabs.query(
                { active: true, currentWindow: true },
                (tabs) => {
                  const currentTab = tabs[0];
                  if (!currentTab?.id) {
                    console.error("[每日积分] popup: 没有找到当前标签页");
                    return;
                  }

                  console.log("[每日积分] popup: 当前标签页", currentTab);

                  chrome.tabs.onUpdated.addListener(function listener(
                    tabId,
                    info,
                  ) {
                    if (tabId === currentTab.id && info.status === "complete") {
                      console.log("[每日积分] popup: 标签页跳转完成");
                      chrome.tabs.onUpdated.removeListener(listener);

                      const sendMessageWithRetry = (
                        tabId: number,
                        message: any,
                        retries: number = 5,
                        delay: number = 2000,
                      ) => {
                        console.log(
                          `[每日积分] popup: 尝试发送消息 (剩余重试次数: ${retries})`,
                        );

                        chrome.tabs.sendMessage(tabId, message, (response) => {
                          if (chrome.runtime.lastError) {
                            console.warn(
                              "[每日积分] popup: 发送消息失败",
                              chrome.runtime.lastError.message,
                            );

                            if (retries > 0) {
                              console.log(
                                `[每日积分] popup: ${delay}ms 后重试...`,
                              );
                              setTimeout(() => {
                                sendMessageWithRetry(
                                  tabId,
                                  message,
                                  retries - 1,
                                  delay,
                                );
                              }, delay);
                            } else {
                              console.error(
                                "[每日积分] popup: 重试次数用尽，消息发送失败",
                              );
                            }
                          } else {
                            console.log("[每日积分] popup: 收到响应", response);
                          }
                        });
                      };

                      setTimeout(() => {
                        sendMessageWithRetry(currentTab.id!, {
                          type: "START_DAILY_POINTS",
                          data: config,
                        });
                      }, 2000);
                    }
                  });

                  chrome.tabs.update(currentTab.id, { url: targetUrl });
                  console.log("[每日积分] popup: 开始跳转到目标页面");
                },
              );
            };

            onMounted(() => {
              loadConfigs();
            });

            return {
              selectKey,
              configs,
              changeTab,
              change,
              handleStartDailyPoints,
            };
          },
          template: `
            <div class="w-[480px] h-[520px] bg-background overflow-hidden">
              <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                <h1 class="text-white text-lg font-medium">
                  <span class="text-blue-200">网课</span>小工具
                </h1>
              </div>
              
              <div class="p-4">
                <TabsRoot :default-value="selectKey" class="w-full">
                  <TabsList class="w-full flex bg-muted p-1 rounded-lg">
                    <TabsTrigger 
                      v-for="(config, key) in configs" 
                      :key="key"
                      :value="key"
                      class="flex-1 px-3 py-2 text-sm rounded-md transition-colors data-[state=active]:bg-background data-[state=active]:text-foreground"
                    >
                      {{ config.name }}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="daily-points"
                      class="flex-1 px-3 py-2 text-sm rounded-md transition-colors data-[state=active]:bg-background data-[state=active]:text-foreground"
                    >
                      每日积分
                    </TabsTrigger>
                  </TabsList>
                  
                  <div class="mt-4">
                    <TabsContent 
                      v-for="(config, key) in configs" 
                      :key="key"
                      :value="key"
                    >
                      <Card class="w-full">
                        <CardHeader class="pb-3">
                          <CardTitle class="text-base">{{ config.name }}配置</CardTitle>
                          <CardDescription class="text-xs">配置{{ config.name }}平台相关参数</CardDescription>
                        </CardHeader>
                        <CardContent class="space-y-3">
                          <div 
                            v-for="(item, index) in config.items" 
                            :key="item.key"
                            class="flex items-center gap-2"
                          >
                            <template v-if="item.type === 'text'">
                              <Label :for="item.key" class="min-w-24 text-sm" :title="item.description">
                                {{ item.title }}:
                              </Label>
                              <Input
                                :id="item.key"
                                v-model="item.value"
                                type="text"
                                class="flex-1 h-8 text-sm"
                                :title="item.description"
                                @input="change(key, item.key, 'text', item.value, index, item.prompt)"
                              />
                              <Label v-if="item.unit" class="text-sm text-muted-foreground">
                                {{ item.unit }}
                              </Label>
                            </template>
                            <template v-else-if="item.type === 'checkbox'">
                              <input
                                type="checkbox"
                                :id="item.key"
                                v-model="item.value"
                                class="w-4 h-4 rounded border-gray-300"
                                @change="change(key, item.key, 'checkbox', item.value, index, item.prompt)"
                              />
                              <Label :for="item.key" class="text-sm cursor-pointer" :title="item.description">
                                {{ item.title }}
                              </Label>
                            </template>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="daily-points">
                      <DailyPointsConfig @start="handleStartDailyPoints" />
                    </TabsContent>
                  </div>
                </TabsRoot>
                
                <p class="mt-4 text-xs text-muted-foreground text-center">
                  Tips: 鼠标放置选项上,可以查看详细内容哦
                </p>
              </div>
            </div>
          `,
        });
        
        this.vm.mount("#app");
    }
}

window.onload = async () => {
    let config = new ChromeConfigItems(await NewBackendConfig());
    let component = new Map<string, any>().set("config", config);
    let app = new Application(Backend, new popup(), component);
    app.run();
}
