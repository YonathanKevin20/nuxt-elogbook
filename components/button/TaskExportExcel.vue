<script setup lang="ts">
import xlsx from 'node-xlsx'
import type { WorkSheetOptions } from 'node-xlsx'

const props = defineProps<{
  year: string,
  month: string,
  data: Array<{ project_name: string, implemented_at: string, description: string, status: string}>
}>()
const dayjs = useDayjs()

const exportExcel = () => {
  const convertedArray = props.data.map((d, index) => [
    index + 1,
    d.project_name,
    d.implemented_at,
    d.description,
    d.status.toUpperCase()
  ])
  const monthYear = dayjs().month((+props.month) - 1).format('MMMM') + ' ' + props.year
  const rows = [
    [monthYear],
    ['#', 'PROJECT NAME', 'DATE', 'DESCRIPTION', 'STATUS'],
    ...convertedArray
  ]
  const sheetOptions: WorkSheetOptions = {
    '!cols': [
      { wch: monthYear.length },
      { wch: 20 },
      { wch: 10 },
      { wch: 40 }
    ]
  }
  const buffer = xlsx.build([{
    name: 'Tasks',
    data: rows,
    options: sheetOptions
  }])

  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Tasks-${props.year}-${props.month}.xlsx`
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <UButton
    label="Export Excel"
    variant="outline"
    color="sky"
    @click="exportExcel()" />
</template>
