<script setup lang="ts">
import { version } from '~/package.json'
</script>

<template>
  <footer class="mt-auto border-t border-slate-400 p-2 flex justify-between items-center">
    <span class="text-sm text-gray-500">v{{ version }}</span>
  </footer>
</template>
