<script setup lang="ts">
const model = defineModel<string>()

const { data, status, refresh } = await useLazyFetch('/api/projects', {
  default: () => [],
  transform: (projects) => projects.map(project => ({ id: ''+project.id, name: project.name }))
})
</script>

<template>
  <div>
    <LoadingState v-if="status === 'pending'" />
    <USelectMenu
      v-else
      v-model="model"
      placeholder="Search..."
      value-attribute="id"
      :options="data"
      option-attribute="name" />
  </div>
</template>
