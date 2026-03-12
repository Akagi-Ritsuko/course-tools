<script setup lang="ts">
import { computed } from 'vue'
import { TabsContent, type TabsContentProps } from 'radix-vue'
import { cn } from '@/lib/utils'

interface Props extends TabsContentProps {
  class?: string
}

const props = defineProps<Props>()

const classes = computed(() =>
  cn(
    'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    props.class
  )
)
</script>

<template>
  <TabsContent v-bind="props" :class="classes">
    <slot />
  </TabsContent>
</template>
