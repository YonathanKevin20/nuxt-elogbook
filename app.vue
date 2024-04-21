<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - elogbook` : 'elogbook'
  }
})

const activeClass = 'text-sky-700 font-bold'
const inactiveClass = 'text-gray-500 hover:text-red-700'
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <UContainer class="flex flex-col h-screen">
      <nav class="flex justify-between items-center">
        <div>
          <ULink
            to="/"
            :active-class="activeClass"
            :inactive-class="inactiveClass">Home</ULink>
          <span> | </span>
          <ULink
            to="/tasks"
            :active-class="activeClass"
            :inactive-class="inactiveClass">Tasks</ULink>
        </div>
        <Auth />
      </nav>
      <NuxtPage />
      <Footer />
    </UContainer>
    <UNotifications />
    <UModals />
  </NuxtLayout>
</template>

<style>
body {
  @apply bg-slate-50;
}
</style>
