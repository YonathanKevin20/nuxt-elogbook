<script setup lang="ts">
import { ModalDeleteTask } from '#components'

useHead({
  title: 'Task'
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
  label: 'STATUS'
}, {
  key: 'actions',
  label: 'ACTIONS'
}]
const actionItems = (row: { id: number, screenshots_count: number }) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => navigateTo(`/task/${row.id}/edit`)
  }, {
    label: `Screenshots (${row.screenshots_count})`,
    icon: 'i-heroicons-photo-20-solid',
    click: () => navigateTo(`/task/${row.id}/screenshot`)
  }], [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid',
    click: () => openModalDeleteTask(row.id)
  }]
]

const dayjs = useDayjs()
const yearSelected = ref(''+(dayjs().year()))
const monthSelected = ref(''+(dayjs().month() + 1))
const { data, pending, refresh } = await useLazyFetch('/api/tasks-self', {
  query: {
    year: yearSelected,
    month: monthSelected
  },
  default: () => [],
  watch: [yearSelected, monthSelected],
})

const dateFormatted = (datetime: string) => {
  if (!datetime) return ''
  return dayjs(datetime).format('dddd, D MMMM YYYY')
}

const modal = useModal()
const openModalDeleteTask = (id: number) => {
  modal.open(ModalDeleteTask, {
    id,
    onSuccess: () => refresh()
  })
}
</script>

<template>
  <main>
    <h1 class="text-2xl font-bold">Task</h1>

    <div class="my-4">
      <UButton
        to="/task/create"
        label="Create"
        variant="solid"
        color="sky" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-x-4 my-4">
      <ButtonMonth v-model="monthSelected" />
      <SelectYear v-model="yearSelected" />
    </div>

    <UTable
      :loading="pending"
      :columns="columns"
      :rows="data">
      <template #id-data="{ index }">{{ index + 1 }}</template>
      <template #implemented_at-data="{ row }">{{ dateFormatted(row.implemented_at) }}</template>
      <template #description-data="{ row }">
        <div class="max-w-lg truncate">{{ row.description }}</div>
      </template>
      <template #status-data="{ row }">
        <span class="uppercase">{{ row.status }}</span>
      </template>
      <template #actions-data="{ row }">
        <UDropdown :items="actionItems(row)">
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
        </UDropdown>
      </template>
    </UTable>
  </main>
</template>
