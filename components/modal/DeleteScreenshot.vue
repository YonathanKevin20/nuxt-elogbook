<script setup lang="ts">
const props = defineProps<{
  selectedScreenshots: string[]
}>()
const modal = useModal()
const toast = useToast()

const supabase = useSupabaseClient()
const pending = ref(false)
const deleteItem = async () => {
  if (!props.selectedScreenshots.length) return

  pending.value = true

  try {
    const { error } = await supabase.storage.from('task-screenshots').remove(props.selectedScreenshots)
    if (error) {
      console.error('Error deleting screenshot:', error.message)
      throw createError({
        statusCode: 400,
        statusMessage: error.message
      })
    }

    const data = await $fetch('/api/screenshots', {
      method: 'DELETE',
      body: {
        paths: props.selectedScreenshots
      }
    })

    toast.add({ title: data.message })
    emit('success')
    modal.close()
  } catch (error: any) {
    toast.add({ title: error.data.message })
  } finally {
    pending.value = false
  }
}

const emit = defineEmits<{
  success: []
}>()
</script>

<template>
  <UModal>
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold">Delete Screenshot</h2>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="modal.close()" />
        </div>
      </template>

      <p>Are you sure you want to delete these screenshots?</p>

      <template #footer>
        <div class="flex justify-end space-x-4">
          <UButton
            label="Delete"
            variant="solid"
            color="red"
            :loading="pending"
            @click="deleteItem()" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>
