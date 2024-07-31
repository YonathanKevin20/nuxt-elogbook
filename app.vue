<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - elogbook` : 'elogbook'
  }
})
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <UContainer class="flex flex-col h-screen">
      <nav class="flex items-center">
        <Menu />
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
