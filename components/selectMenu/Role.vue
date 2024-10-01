<script setup lang="ts">
const options = [
  { label: 'ADMIN', value: 'admin'},
  { label: 'STAFF', value: 'staff'}
]

const model = defineModel<string>()

const emit = defineEmits<{
  change: [string]
}>()
</script>

<template>
  <USelectMenu
    v-model="model"
    @change="emit('change', $event)"
    placeholder="Search..."
    value-attribute="value"
    :options="options"
    option-attribute="label" />
</template>
