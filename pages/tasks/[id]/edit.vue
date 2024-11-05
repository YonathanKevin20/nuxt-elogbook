<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import type { TaskEdit } from '~/schemas/TaskEditSchema'
import { TaskEditSchema } from '~/schemas/TaskEditSchema'

useHead({
  title: 'Edit Task'
})
definePageMeta({
  middleware: 'auth'
})

const dayjs = useDayjs()
const dateNow = dayjs().format('YYYY-MM-DD')

const state = reactive({
  project_name: '',
  implemented_at: dateNow,
  description: '',
  status: '',
})

const route = useRoute()
const id = route.params.id
const initState = async () => {
  try {
    const data = await $fetch(`/api/self-tasks/${id}`)

    if (data) {
      state.project_name = ''+data.project_name
      state.implemented_at = data.implemented_at
      state.description = data.description
      state.status = data.status
    }
  } catch (error: any) {
    console.error(error)
  }
}

onMounted(() => {
  initState()
})

const toast = useToast()

const pending = ref(false)
const onSubmit = async (event: FormSubmitEvent<TaskEdit>) => {
  pending.value = true

  try {
    const data = await $fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      body: event.data
    })

    toast.add({ title: data.message })
    await navigateTo('/tasks')
  } catch (error: any) {
    toast.add({ title: error.data.message })
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <main>
    <h1 class="text-2xl font-bold">Edit Task</h1>

    <UForm :schema="TaskEditSchema" :state="state" class="space-y-4 max-w-lg my-4" @submit="onSubmit">
      <UFormGroup label="Project" name="project_name">
        <SelectMenuProject v-model="state.project_name" />
      </UFormGroup>
      <UFormGroup label="Date" name="implemented_at">
        <DatePicker v-model="state.implemented_at" />
      </UFormGroup>
      <UFormGroup label="Description" name="description">
        <UTextarea v-model="state.description" />
      </UFormGroup>
      <UFormGroup label="Status" name="status">
        <SelectMenuTaskStatus v-model="state.status" />
      </UFormGroup>
      <UButton type="submit" label="Submit" :loading="pending" />
    </UForm>
  </main>
</template>
