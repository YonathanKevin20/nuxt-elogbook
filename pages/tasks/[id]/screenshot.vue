<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import type { ScreenshotCreate } from '~/schemas/ScreenshotCreateSchema'
import { ScreenshotCreateSchema } from '~/schemas/ScreenshotCreateSchema'

useHead({
  title: 'Screenshot'
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
  const extension  = file?.name.split('.').pop()

  if (!file) return

  blobImage.value = URL.createObjectURL(file)
  image.value = file
  imageName.value = Date.now() + '.' + extension
}

type ResponseT = {
  message: string
}
const toast = useToast()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const pending = ref(false)
const onSubmit = async (event: FormSubmitEvent<ScreenshotCreate>) => {
  if (!image.value) return

  pending.value = true

  try {
    const { data: dataFile, error } = await supabase.storage.from('task-screenshots').upload(user.value?.id + '/' + imageName.value, image.value)
    if (error) {
      throw createError({
        statusCode: 400,
        message: error.message
      })
    }

    state.path = dataFile.path
    const data = await $fetch<ResponseT>('/api/screenshots', {
      method: 'POST',
      body: event.data
    })

    toast.add({ title: data.message })
    resetState()
    refreshNuxtData(`screenshots-${state.task_id}`)
  } catch (error: any) {
    toast.add({ title: error.message })
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <main>
    <h1 class="text-2xl font-bold">Screenshot</h1>

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

    <ListScreenshot :task-id="state.task_id" />
  </main>
</template>
