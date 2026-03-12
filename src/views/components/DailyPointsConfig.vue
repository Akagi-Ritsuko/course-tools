<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const emit = defineEmits<{
  start: []
}>()

const knowledgeLink = ref('')
const contributionLimit = ref(300)
const interactionLimit = ref(100)

const handleStart = () => {
  emit('start', {
    knowledgeLink: knowledgeLink.value,
    contributionLimit: contributionLimit.value,
    interactionLimit: interactionLimit.value
  })
}
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>每日积分配置</CardTitle>
      <CardDescription>配置每日积分自动获取参数</CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <div class="space-y-2">
        <Label for="knowledge-link">知识链接</Label>
        <Input
          id="knowledge-link"
          v-model="knowledgeLink"
          type="text"
          placeholder="请输入知识页面链接"
        />
      </div>
      
      <div class="space-y-2">
        <Label for="contribution-limit">贡献积分获取上限</Label>
        <Input
          id="contribution-limit"
          v-model.number="contributionLimit"
          type="number"
          min="0"
          max="300"
          placeholder="默认 300"
        />
      </div>
      
      <div class="space-y-2">
        <Label for="interaction-limit">互动积分获取上限</Label>
        <Input
          id="interaction-limit"
          v-model.number="interactionLimit"
          type="number"
          min="0"
          max="100"
          placeholder="默认 100"
        />
      </div>
      
      <Button class="w-full" @click="handleStart">
        开始
      </Button>
    </CardContent>
  </Card>
</template>
