<script setup lang="ts">
const props = defineProps<{
  id: number
}>()

// FETCH DATA
const { data, status, refresh } = await useLazyFetch(`/api/tasks-self/${props.id}`, {
  key: `tasks-self-${props.id}`,
  default: () => {
    return {
      description: '',
      implemented_at: '',
    }
  },
})
</script>

<template>
  <div class="grid grid-cols-1 mt-2 p-2 border border-slate-400 rounded-lg">
    <LoadingState v-if="status === 'pending'" />
    <div v-else>
      <p class="font-bold">{{ dateFormatted(data.implemented_at) }}</p>
      <p v-if="!data.description">No description</p>
      <p v-else>{{ data.description }}</p>
    </div>
  </div>
</template>
