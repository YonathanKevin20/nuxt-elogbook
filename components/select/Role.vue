<script setup lang="ts">
const items = [
  { label: 'ADMIN', value: 'admin'},
  { label: 'STAFF', value: 'staff'}
]

const model = defineModel<string>()
</script>

<template>
  <USelect
    v-model="model"
    placeholder="Search..."
    :options="items" />
</template>
