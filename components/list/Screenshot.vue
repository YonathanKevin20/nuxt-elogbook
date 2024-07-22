<script setup lang="ts">
import { ModalDeleteScreenshot } from '#components'

const props = defineProps<{
  taskId: number
}>()

// FETCH DATA
const { data, status, refresh } = await useLazyFetch(`/api/screenshots-self/${props.taskId}`, {
  key: `screenshots-self-${props.taskId}`,
  default: () => [],
})
const isDataEmpty = computed(() => !data.value.length)

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
    <div class="grid justify-items-end">
      <UButton
        @click="openModalDeleteScreenshot()"
        label="Delete Selected"
        color="red" />
    </div>
    <LoadingState v-if="status === 'pending'" />
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
      <p v-if="isDataEmpty">No screenshots</p>
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
