<script setup lang="ts">
const props = defineProps<{
  userId: string
  id: number
}>()

// FETCH DATA
const { data, status } = await useLazyFetch(`/api/users/${props.userId}/tasks/${props.id}`, {
  key: `users-${props.userId}-tasks-${props.id}`
})
</script>

<template>
  <div class="grid grid-cols-1 mt-2 p-2 border border-slate-400 rounded-lg">
    <LoadingState v-if="status === 'pending'" />
    <div v-else-if="status === 'success'">
      <p v-if="!data">No tasks found</p>
      <template v-else>
        <p class="font-bold">{{ dateFormatted(data.implemented_at ?? '') }}</p>
        <p>{{ data.description }}</p>
      </template>
    </div>
  </div>
</template>
