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
import DailyPointsConfig from './components/DailyPointsConfig.vue';
import PointsProgressDialog from './components/PointsProgressDialog.vue';

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
            DailyPointsConfig,
            PointsProgressDialog,
          },
          setup() {
            const selectKey = ref("zsgl");
            const configs = ref(SystemConfig.config);
            const showProgressDialog = ref(false);
            const pointsData = ref({
              learning: { current: 0, limit: 100 },
              contribution: { current: 0, limit: 300 },
              interaction: { current: 0, limit: 100 },
            });

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
                    undefined
                  );
                  if (val == undefined) {
                    val = Application.App.config.GetConfig(item.key, item.value);
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
              prompt: string
            ) => {
              if (prompt !== undefined) {
                if (!protocolPrompt(prompt, key)) {
                  let val = Application.App.config.GetNamespaceConfig(
                    namespace,
                    key,
                    undefined
                  );
                  if (val == undefined) {
                    val = Application.App.config.GetConfig(
                      key,
                      configs.value[namespace].items[index].value
                    );
                  }
                  configs.value[namespace].items[index].value = toVal(
                    type,
                    val
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
                    boolToString(<boolean>val)
                  );
                  break;
                }
                default: {
                  await Application.App.config.SetNamespaceConfig(
                    namespace,
                    key,
                    <string>val
                  );
                }
              }
            };

            const handleStartDailyPoints = (config: any) => {
              console.log('开始每日积分任务', config);
              showProgressDialog.value = true;
            };

            const handleStopDailyPoints = () => {
              console.log('停止每日积分任务');
              showProgressDialog.value = false;
            };

            onMounted(() => {
              loadConfigs();
            });

            return {
              selectKey,
              configs,
              showProgressDialog,
              pointsData,
              changeTab,
              change,
              handleStartDailyPoints,
              handleStopDailyPoints,
            };
          },
          template: `
            <div class="min-h-screen bg-background">
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
                      class="space-y-3"
                    >
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
              
              <div v-if="showProgressDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <PointsProgressDialog
                  :learning="pointsData.learning"
                  :contribution="pointsData.contribution"
                  :interaction="pointsData.interaction"
                  @stop="handleStopDailyPoints"
                />
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
