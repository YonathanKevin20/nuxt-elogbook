<script setup lang="ts">
import { ModalDeleteProject } from '#components'

useHead({
  title: 'Projects'
})
definePageMeta({
  middleware: ['auth', 'admin']
})

const columns = [{
  key: 'id',
  label: '#'
}, {
  key: 'name',
  label: 'NAME',
  sortable: true
}, {
  key: 'actions',
  label: 'ACTIONS',
  class: 'w-24'
}]
const actionItems = (row: { id: number, name: string }) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => navigateTo(`/projects/${row.id}/edit`)
  }],
  [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    click: () => openModalDeleteProject(row.id, row.name)
  }]
]

const { data, status, refresh } = await useLazyFetch('/api/projects', {
  default: () => []
})

const q = ref('')
const filteredRows = computed(() => {
  if (!q.value) {
    return data.value
  }

  return data.value.filter((item) => {
    return Object.values(item).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase())
    })
  })
})

const modal = useModal()
const openModalDeleteProject = (id: number, name: string) => {
  modal.open(ModalDeleteProject, {
    id,
    name,
    onSuccess: () => refresh()
  })
}
</script>

<template>
  <main>
    <h1 class="text-2xl font-bold">Projects</h1>

    <div class="flex items-center justify-between space-x-2 my-4">
      <UButton
        to="/projects/create"
        label="Create"
        variant="solid"
        color="sky" />
      <UInput v-model="q" class="w-1/2 xl:w-1/5" placeholder="Search project..." />
    </div>

    <UTable
      :loading="status === 'pending'"
      :columns="columns"
      :rows="filteredRows"
      class="min-h-full border-2 rounded-lg">
      <template #id-data="{ index }">{{ index + 1 }}</template>
      <template #actions-data="{ row }">
        <UDropdown :items="actionItems(row)">
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
        </UDropdown>
      </template>
    </UTable>
  </main>
</template>
