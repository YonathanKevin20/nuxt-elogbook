<script setup lang="ts">
import { ModalEditScreenshotDescription } from '#components'

const props = defineProps<{
  screenshot: {
    path: string
    image: string | null
    description: string | null
  }
}>()

const model = defineModel<string[]>()

const altText = computed(() => props.screenshot.description || 'No description')

const selectItem = (path: string) => {
  if (!model.value) model.value = [path]

  model.value = model.value.includes(path)
    ? model.value.filter((p) => p !== path)
    : [...model.value, path]
}

const supabase = useSupabaseClient()
const downloadImage = async (path: string) => {
  const { data, error } = await supabase.storage.from('task-screenshots').download(path)
  if (error) {
    console.error('Error downloading image:', error.message)
    throw createError({
      statusCode: 400,
      statusMessage: error.message
    })
  }

  const url = URL.createObjectURL(data)
  const a = document.createElement('a')
  a.href = url
  a.download = path
  a.click()
  URL.revokeObjectURL(url)
}

const modal = useModal()
const openModalEditScreenshotDescription = (path: string, description: string | null) => {
  modal.open(ModalEditScreenshotDescription, {
    path,
    description,
    onSuccess: () => emit('refresh')
  })
}

const emit = defineEmits<{
  deleteItem: [path: string]
  refresh: []
}>()
</script>

<template>
  <div class="border-2 border-slate-400 rounded-lg bg-sky-100 p-2 space-y-2">
    <UCheckbox v-model="model" :value="screenshot.path" />
    <img
      v-if="screenshot.image"
      @click="selectItem(screenshot.path)"
      class="object-scale-down h-40 rounded-lg mx-auto cursor-pointer hover:scale-110 transition duration-500" :src="screenshot.image" :alt="altText" />
    <p class="min-h-12 text-sm border-b-2 border-slate-400 pb-2">{{ screenshot.description }}</p>
    <div class="space-x-2">
      <UButton
        @click="downloadImage(screenshot.path)"
        icon="i-heroicons-arrow-down-tray-20-solid"
        size="2xs"
        title="Download" />
      <UButton
        @click="openModalEditScreenshotDescription(screenshot.path, screenshot.description)"
        icon="i-heroicons-pencil-20-solid"
        color="sky"
        size="2xs"
        title="Edit" />
      <UButton
        @click="emit('deleteItem', screenshot.path)"
        icon="i-heroicons-trash-20-solid"
        color="red"
        size="2xs"
        title="Delete" />
    </div>
  </div>
</template>
