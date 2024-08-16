<script setup lang="ts">
import { ModalDeleteTask } from '#components'

useHead({
  title: 'Tasks'
})
definePageMeta({
  middleware: 'auth'
})

const columns = [{
  key: 'id',
  label: '#'
}, {
  key: 'project_name',
  label: 'PROJECT NAME'
}, {
  key: 'implemented_at',
  label: 'DATE',
  sortable: true
}, {
  key: 'description',
  label: 'DESCRIPTION'
}, {
  key: 'status',
  label: 'STATUS',
  class: 'w-48'
}, {
  key: 'actions',
  label: 'ACTIONS',
  class: 'w-24'
}]
const actionItems = (row: { id: number, screenshots_count: number }) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => navigateTo(`/tasks/${row.id}/edit`)
  }, {
    label: `Screenshots (${row.screenshots_count})`,
    icon: 'i-heroicons-photo-20-solid',
    click: () => navigateTo(`/tasks/${row.id}/screenshots`)
  }],
  [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    click: () => openModalDeleteTask(row.id)
  }]
]

const route = useRoute()
const dayjs = useDayjs()

const currentMonth = route.query.month ? ''+route.query.month : ''+(dayjs().month() + 1)
const currentYear = route.query.year ? ''+route.query.year : ''+(dayjs().year())
const selectedYear = ref(currentYear)
const selectedMonth = ref(currentMonth)
const { data, status, refresh } = await useLazyFetch('/api/tasks-self', {
  query: {
    year: selectedYear,
    month: selectedMonth
  },
  default: () => [],
  watch: [selectedYear, selectedMonth],
})

const updateRouteQuery = async (key: string, value: string) => {
  await navigateTo({ query: { ...route.query, [key]: value } })
}

const modal = useModal()
const openModalDeleteTask = (id: number) => {
  modal.open(ModalDeleteTask, {
    id,
    onSuccess: () => refresh()
  })
}

const toast = useToast()
const updateTaskStatus = async (id: number, status: string) => {
  try {
    const data = await $fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      body: { status }
    })

    toast.add({ title: data.message })
  } catch (error: any) {
    toast.add({ title: error.message })
  }
}
</script>

<template>
  <main>
    <h1 class="text-2xl font-bold">My Tasks</h1>

    <div class="flex items-center space-x-2 my-4">
      <UButton
        to="/tasks/create"
        label="Create"
        variant="solid"
        color="sky" />
      <ButtonTaskExportExcel
        :year="selectedYear"
        :month="selectedMonth"
        :data="data" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-x-4 my-4">
      <ButtonMonth
        v-model="selectedMonth"
        @change="updateRouteQuery('month', selectedMonth)" />
      <SelectYear
        v-model="selectedYear"
        @change="updateRouteQuery('year', selectedYear)" />
    </div>

    <UTable
      :loading="status === 'pending'"
      :columns="columns"
      :rows="data"
      class="min-h-full border-2 rounded-lg">
      <template #id-data="{ index }">{{ index + 1 }}</template>
      <template #implemented_at-data="{ row }">{{ dateFormatted(row.implemented_at) }}</template>
      <template #description-data="{ row }">
        <div class="max-w-lg truncate">{{ row.description }}</div>
      </template>
      <template #status-data="{ row }">
        <SelectMenuTaskStatus
          v-model="row.status"
          @change="updateTaskStatus(row.id, $event)" />
      </template>
      <template #actions-data="{ row }">
        <UDropdown :items="actionItems(row)">
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
        </UDropdown>
      </template>
    </UTable>
  </main>
</template>
