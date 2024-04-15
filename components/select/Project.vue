<script setup lang="ts">
const items = ref<SelectProject[]>([])

const model = defineModel<string>()

const fetchData = async () => {
  try {
    const data = await $fetch(`/api/projects`)

    items.value = data
  } catch (error: any) {
    console.error(error)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <USelect
    v-model="model"
    placeholder="Search..."
    :options="items"
    value-attribute="id"
    option-attribute="name" />
</template>
