<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - elogbook` : 'elogbook';
  }
})

const activeClass = 'text-sky-700 font-bold';
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <UContainer>
      <nav class="flex justify-between">
        <div>
          <ULink
            to="/"
            :active-class="activeClass"
            inactive-class="text-gray-500 hover:text-red-700">Home</ULink>
          <span> | </span>
          <ULink
            to="/tasks"
            :active-class="activeClass"
            inactive-class="text-gray-500 hover:text-red-700">Tasks</ULink>
        </div>
        <Auth />
      </nav>
      <NuxtPage />
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
