<script setup lang="ts">

useHead({
  title: 'Employees'
})
definePageMeta({
  middleware: 'auth'
})

const { data, status, refresh } = await useLazyFetch('/api/users', {
  default: () => []
})
</script>

<template>
  <main>
    <h1 class="text-2xl font-bold">Employees List</h1>
    <ul>
      <li v-for="(item, index) in data" :key="index">{{ item.email }} | {{ item.app_role }}</li>
    </ul>
  </main>
</template>
