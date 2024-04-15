<script setup lang="ts">
const items = [
  { label: 'TO DO', value: 'to do'},
  { label: 'IN PROGRESS', value: 'in progress'},
  { label: 'DONE', value: 'done'}
]

const model = defineModel<string>()
</script>

<template>
  <USelect
    v-model="model"
    placeholder="Search..."
    :options="items" />
</template>
