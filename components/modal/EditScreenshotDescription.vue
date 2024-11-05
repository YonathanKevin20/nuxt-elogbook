<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import type { ScreenshotEdit } from '~/schemas/ScreenshotEditSchema'
import { ScreenshotEditSchema } from '~/schemas/ScreenshotEditSchema'

const props = defineProps<{
  path: string
  description: string | null
}>()
const modal = useModal()
const toast = useToast()

const state = reactive({
  description: props.description || '',
})

const pending = ref(false)
const onSubmit = async (event: FormSubmitEvent<ScreenshotEdit>) => {
  pending.value = true

  try {
    const data = await $fetch(`/api/screenshots`, {
      method: 'PUT',
      body: {
        path: props.path,
        description: event.data.description || null
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
          <h2 class="text-lg font-bold">Edit Description</h2>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="modal.close()" />
        </div>
      </template>

      <UFormGroup label="Description" name="description">
        <UTextarea v-model="state.description" />
      </UFormGroup>

      <template #footer>
        <div class="flex justify-end space-x-4">
          <UForm :schema="ScreenshotEditSchema" :state="state" @submit="onSubmit">
            <UButton type="submit" label="Submit" :loading="pending" />
          </UForm>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
