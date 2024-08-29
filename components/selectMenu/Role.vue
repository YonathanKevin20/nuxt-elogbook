<script setup lang="ts">
const options = [
  { label: 'ADMIN', value: 'admin'},
  { label: 'STAFF', value: 'staff'}
]

const model = defineModel<string>()
</script>

<template>
  <USelectMenu
    v-model="model"
    placeholder="Search..."
    value-attribute="value"
    :options="options"
    option-attribute="label" />
</template>
