<script setup lang="ts">
interface StatusItem {
  value: string
  color: BadgeColor
}
type BadgeColor = 'red' | 'yellow' | 'green'

const props = defineProps<{
  value: 'to_do' | 'in_progress' | 'done'
}>()

const label = computed(() => props.value.toUpperCase().replace(/_/g, ' '))

const STATUS_ITEMS: StatusItem[] = [
  { value: 'to_do', color: 'red' },
  { value: 'in_progress', color: 'yellow' },
  { value: 'done', color: 'green' }
]

const currentItem = computed(() => STATUS_ITEMS.find(item => item.value === props.value))
</script>

<template>
  <UBadge
    v-if="currentItem"
    :label="label"
    :color="currentItem.color"
    variant="solid"
    :ui="{ rounded: 'rounded-full' }" />
</template>
