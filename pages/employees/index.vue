<script setup lang="ts">
import { ModalDeleteUser } from '#components'

useHead({
  title: 'Employees'
})
definePageMeta({
  middleware: ['auth', 'admin']
})

const user = useSupabaseUser()

const isSelf = (id: string) => user.value?.id === id

const columns = [{
  key: 'id',
  label: '#'
}, {
  key: 'full_name',
  label: 'FULL NAME',
  sortable: true
}, {
  key: 'role',
  label: 'ROLE',
  sortable: true,
  class: 'w-48'
}, {
  key: 'actions',
  label: 'ACTIONS',
  class: 'w-24'
}]
const actionItems = (row: { id: string, full_name: string }) => [
  [{
    label: 'Tasks',
    icon: 'i-heroicons-numbered-list-20-solid',
    click: () => isSelf(row.id) ? navigateTo('/tasks') : navigateTo(`/users/${row.id}/tasks`)
  }, {
    label: 'Profile',
    icon: 'i-heroicons-user-circle-20-solid',
  }],
  [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    disabled: isSelf(row.id),
    onClick: () => openModalDeleteUser(row.id, row.full_name)
  }]
]

const { data, status, refresh } = await useLazyFetch('/api/users', {
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
const openModalDeleteUser = (id: string, full_name: string) => {
  modal.open(ModalDeleteUser, {
    id,
    fullName: full_name,
    onSuccess: () => refresh()
  })
}
</script>

<template>
  <main>
    <h1 class="text-2xl font-bold">Employees</h1>

    <div class="flex items-center justify-between space-x-2 my-4">
      <UButton
        to="/employees/create"
        label="Create"
        variant="solid"
        color="sky" />
      <UInput v-model="q" class="w-1/2 xl:w-1/5" placeholder="Search employee..." />
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
