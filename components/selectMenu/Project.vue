<script setup lang="ts">
const model = defineModel<string>()

const { data, status, refresh } = await useLazyFetch('/api/projects', {
  default: () => []
})
</script>

<template>
  <div>
    <LoadingState v-if="status === 'pending'" />
    <USelectMenu
      v-else
      v-model="model"
      placeholder="Search..."
      value-attribute="name"
      :options="data"
      option-attribute="name" />
  </div>
</template>
