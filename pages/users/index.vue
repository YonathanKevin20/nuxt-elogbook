<script setup lang="ts">
import { ModalDeleteUser } from '#components'

useHead({
  title: 'Users'
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
  key: 'email',
  label: 'EMAIL',
  sortable: true
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
  }],
  [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    disabled: isSelf(row.id),
    click: () => openModalDeleteUser(row.id, row.full_name)
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

const toast = useToast()
const updateRole = async (id: number, role: string) => {
  try {
    const data = await $fetch(`/api/users/${id}`, {
      method: 'PUT',
      body: { role }
    })

    toast.add({ title: data.message })
  } catch (error: any) {
    toast.add({ title: error.message })
  }
}
</script>

<template>
  <main>
    <h1 class="text-2xl font-bold">Users</h1>

    <div class="flex items-center justify-between space-x-2 my-4">
      <UButton
        to="/users/create"
        label="Create"
        variant="solid"
        color="sky" />
      <UInput v-model="q" class="w-1/2 xl:w-1/5" placeholder="Search user..." />
    </div>

    <UTable
      :loading="status === 'pending'"
      :columns="columns"
      :rows="filteredRows"
      class="min-h-full border-2 rounded-lg">
      <template #id-data="{ index }">{{ index + 1 }}</template>
      <template #role-data="{ row }">
        <SelectMenuRole
          v-if="!isSelf(row.id)"
          v-model="row.role"
          @change="updateRole(row.id, $event)" />
        <span v-else>{{ row.role.toUpperCase() }}</span>
      </template>
      <template #actions-data="{ row }">
        <UDropdown :items="actionItems(row)">
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
        </UDropdown>
      </template>
    </UTable>
  </main>
</template>
