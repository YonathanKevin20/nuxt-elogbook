<script setup lang="ts">
const props = defineProps<{
  screenshot: {
    path: string
    image: string | null
    description: string | null
  }
}>()

const altText = computed(() => props.screenshot.description || 'No description')

// IMAGE LOAD
const { isLoaded, onLoad } = useImageLoad()

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
</script>

<template>
  <div class="border-2 border-slate-400 rounded-lg bg-sky-100 p-2 space-y-2">
    <div
      v-if="screenshot.image"
      class="relative grid place-items-center">
      <div v-show="!isLoaded" class="absolute grid place-items-center">
        <LoadingState />
      </div>
      <img
        @load="onLoad"
        class="object-scale-down h-40 rounded-lg mx-auto cursor-pointer hover:scale-110 transition duration-500"
        crossorigin="anonymous"
        :src="screenshot.image"
        :alt="altText" />
    </div>
    <p class="min-h-12 text-sm border-b-2 border-slate-400 pb-2">{{ screenshot.description }}</p>
    <div class="space-x-2">
      <UButton
        @click="downloadImage(screenshot.path)"
        icon="i-heroicons-arrow-down-tray-20-solid"
        size="2xs"
        title="Download" />
    </div>
  </div>
</template>
