<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import type { ScreenshotCreate } from '~/schemas/ScreenshotCreateSchema'
import { ScreenshotCreateSchema } from '~/schemas/ScreenshotCreateSchema'

useHead({
  title: 'Screenshots'
})
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const state = reactive({
  task_id: +route.params.id,
  path: '',
  description: ''
})
const image = ref<File>()
const imageName = ref('')

const resetState = () => {
  state.path = ''
  state.description = ''

  if (inputFileField.value) {
    inputFileField.value.value = ''
  }
  blobImage.value = null
  image.value = undefined
  imageName.value = ''
}

const inputFileField = ref<HTMLInputElement | null>(null)
const blobImage = ref<string | null>(null)
const handleFile = async (event: Event) => {
  const target = <HTMLInputElement>event.target
  const file = target.files?.item(0)

  if (!file) return

  const extension  = file.name.split('.').pop()

  blobImage.value = URL.createObjectURL(file)
  image.value = file
  imageName.value = Date.now() + '.' + extension
}

const toast = useToast()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { data: task } = useNuxtData(`self-tasks-${state.task_id}`)
const pending = ref(false)
const path = computed(() => {
  const userId = user.value?.id
  if (!userId) return ''

  const implementedAt = task.value?.implemented_at
  if (!implementedAt) return ''

  const [year, month] = implementedAt.split('-')

  return `${userId}/${year}/${month}/${imageName.value}`
})
const onSubmit = async (event: FormSubmitEvent<ScreenshotCreate>) => {
  if (!image.value) return

  pending.value = true

  try {
    const { data: dataFile, error } = await supabase.storage.from('task-screenshots').upload(path.value, image.value)
    if (error) {
      throw createError({
        statusCode: 400,
        statusMessage: error.message
      })
    }

    state.path = dataFile.path
    const data = await $fetch('/api/screenshots', {
      method: 'POST',
      body: event.data
    })

    toast.add({ title: data.message })
    resetState()
    refreshNuxtData(`self-screenshots-${state.task_id}`)
  } catch (error: any) {
    toast.add({ title: error.message })
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <main>
    <h1 class="text-2xl font-bold">Screenshots</h1>

    <CardSelfTaskDetail :id="state.task_id" />

    <UForm :schema="ScreenshotCreateSchema" :state="state" class="space-y-4 max-w-lg my-4" @submit="onSubmit">
      <UFormGroup label="Image" name="path">
        <UButton @click="inputFileField?.click()" variant="outline" color="sky">
          <span>Choose Image</span>
          <input ref="inputFileField" @change="handleFile" type="file" accept="image/*" class="hidden" />
        </UButton>
        <div v-if="blobImage" class="grid place-items-center p-2 border border-slate-400 rounded-lg mt-2">
          <img class="object-scale-down h-40 rounded-lg mx-auto" :src="blobImage">
        </div>
      </UFormGroup>
      <UFormGroup label="Description" name="description">
        <UTextarea v-model.trim="state.description" />
      </UFormGroup>
      <UButton type="submit" label="Submit" :loading="pending" />
    </UForm>

    <ListSelfScreenshot :task-id="state.task_id" />
  </main>
</template>
