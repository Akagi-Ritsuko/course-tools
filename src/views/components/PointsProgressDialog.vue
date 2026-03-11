<!--
 * @Author: guotao
 * @Date: 2026-03-11 21:41:17
 * @LastEditors: guotao
 * @LastEditTime: 2026-03-11 22:26:38
 * @FilePath: \course-tools\src\views\components\PointsProgressDialog.vue
 * @Description: 
 * 
 * Copyright (c) 2026 by lzlj, All Rights Reserved. 
-->
<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PointsStatus {
  current: number
  limit: number
}

interface Props {
  learning: PointsStatus
  contribution: PointsStatus
  interaction: PointsStatus
}

const props = defineProps<Props>()

const emit = defineEmits<{
  stop: []
}>()

const learningProgress = computed(() => {
  return Math.min((props.learning.current / props.learning.limit) * 100, 100)
})

const contributionProgress = computed(() => {
  return Math.min((props.contribution.current / props.contribution.limit) * 100, 100)
})

const interactionProgress = computed(() => {
  return Math.min((props.interaction.current / props.interaction.limit) * 100, 100)
})

const totalProgress = computed(() => {
  const totalCurrent = props.learning.current + props.contribution.current + props.interaction.current
  const totalLimit = props.learning.limit + props.contribution.limit + props.interaction.limit
  return Math.min((totalCurrent / totalLimit) * 100, 100)
})

const handleStop = () => {
  emit('stop')
}
</script>

<template>
  <Card class="w-80 shadow-lg">
    <CardHeader class="pb-2">
      <CardTitle class="text-lg">每日积分进度</CardTitle>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-muted-foreground">学习积分</span>
          <span class="font-medium">{{ learning.current }} / {{ learning.limit }}</span>
        </div>
        <Progress :model-value="learningProgress" class="h-2" />
      </div>
      
      <div class="space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-muted-foreground">贡献积分</span>
          <span class="font-medium">{{ contribution.current }} / {{ contribution.limit }}</span>
        </div>
        <Progress :model-value="contributionProgress" class="h-2" />
      </div>
      
      <div class="space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-muted-foreground">互动积分</span>
          <span class="font-medium">{{ interaction.current }} / {{ interaction.limit }}</span>
        </div>
        <Progress :model-value="interactionProgress" class="h-2" />
      </div>
      
      <div class="space-y-2 pt-2 border-t">
        <div class="flex justify-between text-sm">
          <span class="text-muted-foreground">总进度</span>
          <span class="font-medium">{{ totalProgress.toFixed(1) }}%</span>
        </div>
        <Progress :model-value="totalProgress" class="h-3" />
      </div>
      
      <Button variant="destructive" class="w-full" @click="handleStop">
        结束
      </Button>
    </CardContent>
  </Card>
</template>
