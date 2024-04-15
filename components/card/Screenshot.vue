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
  <div class="border border-slate-400 rounded-lg bg-sky-100 p-2 space-y-2">
    <UCheckbox v-model="model" :value="screenshot.path" />
    <img
      v-if="screenshot.image"
      @click="selectItem(screenshot.path)"
      class="object-scale-down h-40 rounded-lg mx-auto cursor-pointer hover:scale-110 transition duration-500" :src="screenshot.image" :alt="altText" />
    <p class="h-6 text-sm">{{ screenshot.description }}</p>
    <div class="space-x-2">
      <UButton
        @click="openModalEditScreenshotDescription(screenshot.path, screenshot.description)"
        icon="i-heroicons-pencil-20-solid"
        color="sky"
        size="2xs" />
      <UButton
        @click="emit('deleteItem', screenshot.path)"
        icon="i-heroicons-trash-20-solid"
        color="red"
        size="2xs" />
    </div>
  </div>
</template>
