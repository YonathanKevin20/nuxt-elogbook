<script setup lang="ts">
import { ModalDeleteScreenshot } from '#components'

const props = defineProps<{
  userId: string
  taskId: number
}>()

// FETCH DATA
const { data, status, refresh } = await useLazyFetch(`/api/users/${props.userId}/screenshots/${props.taskId}`, {
  key: `users-${props.userId}-screenshots-${props.taskId}`,
  default: () => [],
})
const isEmpty = computed(() => !data.value.length)

const selectedScreenshots = ref<string[]>([])

const modal = useModal()
const openModalDeleteScreenshot = (path?: string) => {
  if (path) {
    selectedScreenshots.value = [path]
  }
  if (!selectedScreenshots.value.length) return

  modal.open(ModalDeleteScreenshot, {
    selectedScreenshots: selectedScreenshots.value,
    onSuccess: () => {
      selectedScreenshots.value = []
      refresh()
    }
  })
}
</script>

<template>
  <div class="my-4">
    <h2 class="text-xl font-bold">List of Screenshots</h2>
    <LoadingState v-if="status === 'pending'" />
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
      <p v-show="isEmpty">No screenshots</p>
      <CardScreenshot
        v-for="(item, index) in data"
        :key="index"
        :screenshot="item"
        v-model="selectedScreenshots"
        @delete-item="openModalDeleteScreenshot"
        @refresh="refresh" />
    </div>
  </div>
</template>
