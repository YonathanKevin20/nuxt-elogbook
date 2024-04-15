<script setup lang="ts">
const items = Array.from({ length: new Date().getFullYear() - 2023 }, (_, i) => ({
  label: ''+(2024 + i),
  value: ''+(2024 + i)
}))

const model = defineModel<string>()
</script>

<template>
  <div class="col-span-1 justify-self-end">
    <USelect
      v-model="model"
      placeholder="Search..."
      :options="items"
      class="w-fit" />
  </div>
</template>
