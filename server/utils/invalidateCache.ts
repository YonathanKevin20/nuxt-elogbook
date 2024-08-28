export const invalidateCache = async (storage: string, key: string) => {
  const cacheStorage = useStorage(storage)
  await cacheStorage.removeItem(key)
}
