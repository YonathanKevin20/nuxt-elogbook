export const useImageLoad = () => {
  const isLoaded = ref(false)
  const onLoad = () => isLoaded.value = true
  const onReset = () => isLoaded.value = false

  return {
    isLoaded,
    onLoad,
    onReset
  }
}
