<!--
 * @Author: guotao
 * @Date: 2026-03-11 22:36:34
 * @LastEditors: guotao
 * @LastEditTime: 2026-03-12 21:48:39
 * @FilePath: \course-tools1\src\views\components\DailyPointsConfig.vue
 * @Description: 
 * 
 * Copyright (c) 2026 by lzlj, All Rights Reserved. 
-->
<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

interface DailyPointsConfig {
  knowledgeLink: string
  learningLimit: number
  contributionLimit: number
  interactionLimit: number
  taskDelay: number
}

const emit = defineEmits<{
  start: [config: DailyPointsConfig]
}>()

const knowledgeLink = ref('')
const learningLimit = ref(100)
const contributionLimit = ref(300)
const interactionLimit = ref(100)
const taskDelay = ref(8)

const handleStart = () => {
  emit('start', {
    knowledgeLink: knowledgeLink.value,
    learningLimit: learningLimit.value,
    contributionLimit: contributionLimit.value,
    interactionLimit: interactionLimit.value,
    taskDelay: taskDelay.value
  })
}
</script>

<template>
  <Card class="w-full">
    <CardHeader class="pb-3">
      <CardTitle class="text-base">每日积分配置</CardTitle>
      <CardDescription class="text-xs">配置每日积分自动获取参数</CardDescription>
    </CardHeader>
    <CardContent class="space-y-3">
      <div class="flex items-center gap-2">
        <Label for="knowledge-link" class="min-w-24 text-sm">知识链接:</Label>
        <Input
          id="knowledge-link"
          v-model="knowledgeLink"
          type="text"
          class="flex-1 h-8 text-sm"
          placeholder="请输入知识页面链接"
        />
      </div>
      
      <div class="flex items-center gap-2">
        <Label for="learning-limit" class="min-w-24 text-sm">学习积分上限:</Label>
        <Input
          id="learning-limit"
          v-model.number="learningLimit"
          type="number"
          class="flex-1 h-8 text-sm"
          min="0"
          max="100"
          placeholder="默认 100"
        />
        <Label class="text-sm text-muted-foreground">分</Label>
      </div>
      
      <div class="flex items-center gap-2">
        <Label for="contribution-limit" class="min-w-24 text-sm">贡献积分上限:</Label>
        <Input
          id="contribution-limit"
          v-model.number="contributionLimit"
          type="number"
          class="flex-1 h-8 text-sm"
          min="0"
          max="300"
          placeholder="默认 300"
        />
        <Label class="text-sm text-muted-foreground">分</Label>
      </div>
      
      <div class="flex items-center gap-2">
        <Label for="interaction-limit" class="min-w-24 text-sm">互动积分上限:</Label>
        <Input
          id="interaction-limit"
          v-model.number="interactionLimit"
          type="number"
          class="flex-1 h-8 text-sm"
          min="0"
          max="100"
          placeholder="默认 100"
        />
        <Label class="text-sm text-muted-foreground">分</Label>
      </div>
      
      <div class="flex items-center gap-2">
        <Label for="task-delay" class="min-w-24 text-sm">任务延迟:</Label>
        <Input
          id="task-delay"
          v-model.number="taskDelay"
          type="number"
          class="flex-1 h-8 text-sm"
          min="0"
          placeholder="默认 8"
        />
        <Label class="text-sm text-muted-foreground">秒</Label>
      </div>
      <p class="text-xs text-gray-500 -mt-2 ml-28">实际延迟 = 配置值 ± 5秒，最小为 0，为 0 则不等待</p>
      
      <Button 
        class="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 rounded-md transition-all duration-200 shadow-md hover:shadow-lg" 
        @click="handleStart"
      >
        开始
      </Button>
    </CardContent>
  </Card>
</template>
