<script setup lang="ts">
const dayjs = useDayjs()
const items = Array.from({ length: 12 }, (_, i) => ({
  label: dayjs().month(i).format('MMMM'),
  value: ''+(i + 1)
}))

const model = defineModel<string>()
</script>

<template>
  <div class="col-span-1 md:col-span-3 space-x-2 mb-2 md:mb-0">
    <UButton
      v-for="item in items"
      :key="item.value"
      :label="item.label"
      :variant="model === item.value ? 'solid' : 'ghost'"
      @click="model = item.value" />
  </div>
</template>
