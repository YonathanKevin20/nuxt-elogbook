<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import type { ProjectCreate } from '~/schemas/ProjectCreateSchema'
import { ProjectCreateSchema } from '~/schemas/ProjectCreateSchema'

useHead({
  title: 'Create Project'
})
definePageMeta({
  middleware: ['auth', 'admin']
})

const state = reactive({
  name: '',
})

const toast = useToast()

const pending = ref(false)
const onSubmit = async (event: FormSubmitEvent<ProjectCreate>) => {
  pending.value = true

  try {
    const data = await $fetch('/api/projects', {
      method: 'POST',
      body: event.data
    })

    toast.add({ title: data.message })
    await navigateTo('/projects')
  } catch (error: any) {
    toast.add({ title: error.message })
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <main>
    <h1 class="text-2xl font-bold">Create Project</h1>

    <UForm :schema="ProjectCreateSchema" :state="state" class="space-y-4 max-w-lg my-4" @submit="onSubmit">
      <UFormGroup label="Name" name="name">
        <UInput v-model="state.name" />
      </UFormGroup>
      <UButton type="submit" label="Submit" :loading="pending" />
    </UForm>
  </main>
</template>
