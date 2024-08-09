<script setup lang="ts">
const options = [
  { label: 'TO DO', value: 'to_do', color: 'red' },
  { label: 'IN PROGRESS', value: 'in_progress', color: 'yellow' },
  { label: 'DONE', value: 'done', color: 'green' }
]

const model = defineModel<string>()
const selected = computed(() => options.find(option => option.value === model.value) || options[0])

const emit = defineEmits<{
  change: [string]
}>()
</script>

<template>
  <USelectMenu
    v-model="model"
    @change="emit('change', $event)"
    value-attribute="value"
    :options="options"
    option-attribute="label">
    <template #label>
      <span
        :class="`bg-${selected.color}-400 inline-block h-2 w-2 flex-shrink-0 rounded-full`"
        aria-hidden="true" />
      <span>{{ selected.label }}</span>
    </template>

    <template #option="{ option }">
      <span
        :class="`bg-${option.color}-400 inline-block h-2 w-2 flex-shrink-0 rounded-full`"
        aria-hidden="true" />
      <span>{{ option.label }}</span>
    </template>
  </USelectMenu>
</template>
