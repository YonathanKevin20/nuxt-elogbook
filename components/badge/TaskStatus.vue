<script setup lang="ts">
type BadgeColor = 'red' | 'yellow' | 'green'

const props = defineProps<{
  value: string
}>()

const label = computed(() => props.value.toUpperCase().replace(/_/g, ' '))

const items = [
  { value: 'to_do', color: 'red' as BadgeColor },
  { value: 'in_progress', color: 'yellow' as BadgeColor },
  { value: 'done', color: 'green' as BadgeColor }
]
</script>

<template>
  <UBadge
    v-for="item in items"
    v-show="value === item.value"
    :label="label"
    :color="item.color"
    variant="solid"
    :ui="{ rounded: 'rounded-full' }" />
</template>
