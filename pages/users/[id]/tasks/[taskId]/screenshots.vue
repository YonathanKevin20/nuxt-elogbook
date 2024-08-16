<script setup lang="ts">
useHead({
  title: 'Screenshots'
})
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const userId = ''+route.params.id
const taskId = +route.params.taskId
</script>

<template>
  <main>
    <h1 class="text-2xl font-bold">Screenshots</h1>

    <CardTaskDetail
      :user-id="userId"
      :id="taskId" />

    <ListScreenshot
      :user-id="userId"
      :task-id="taskId" />
  </main>
</template>
