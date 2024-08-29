<script setup lang="ts">
const options = Array.from({ length: new Date().getFullYear() - 2023 }, (_, i) => ({
  label: ''+(2024 + i),
  value: ''+(2024 + i)
}))

const model = defineModel<string>({ required: true })

const emit = defineEmits<{
  change: [string]
}>()
</script>

<template>
  <div class="col-span-1 justify-self-end">
    <USelect
      v-model="model"
      @change="emit('change', model)"
      placeholder="Search..."
      :options="options"
      class="w-fit" />
  </div>
</template>
