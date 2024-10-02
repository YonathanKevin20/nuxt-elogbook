<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import type { ProjectEdit } from '~/schemas/ProjectEditSchema'
import { ProjectEditSchema } from '~/schemas/ProjectEditSchema'

useHead({
  title: 'Edit Project'
})
definePageMeta({
  middleware: 'auth'
})

const state = reactive({
  name: '',
})

const route = useRoute()
const id = route.params.id
const initState = async () => {
  try {
    const data = await $fetch(`/api/projects/${id}`)

    if (data) {
      state.name = data.name
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
const onSubmit = async (event: FormSubmitEvent<ProjectEdit>) => {
  pending.value = true

  try {
    const data = await $fetch(`/api/projects/${id}`, {
      method: 'PUT',
      body: event.data
    })

    toast.add({ title: data.message })
    await navigateTo('/projects')
  } catch (error: any) {
    toast.add({ title: error.data.message })
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <main>
    <h1 class="text-2xl font-bold">Edit Project</h1>

    <UForm :schema="ProjectEditSchema" :state="state" class="space-y-4 max-w-lg my-4" @submit="onSubmit">
      <UFormGroup label="Name" name="name">
        <UInput v-model="state.name" />
      </UFormGroup>
      <UButton type="submit" label="Submit" :loading="pending" />
    </UForm>
  </main>
</template>
