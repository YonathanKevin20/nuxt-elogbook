<script setup lang="ts">
const model = defineModel<string>()

const { data, pending, refresh } = await useLazyFetch('/api/projects', {
  default: () => [],
})
</script>

<template>
  <div>
    <LoadingState v-if="pending" />
    <USelect
      v-else
      v-model="model"
      placeholder="Search..."
      :options="data"
      value-attribute="id"
      option-attribute="name" />
  </div>
</template>
