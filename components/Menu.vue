<script setup lang="ts">
const user = useSupabaseUser()

const isAdmin = computed(() => user.value?.user_metadata.role === 'admin')

const activeClass = 'text-sky-700 font-medium'
const inactiveClass = 'text-gray-500 hover:text-red-700'
</script>

<template>
  <div v-if="user">
    <ULink
      to="/"
      :active-class="activeClass"
      :inactive-class="inactiveClass">Home</ULink>
    <span> | </span>
    <ULink
      to="/tasks"
      :active-class="activeClass"
      :inactive-class="inactiveClass">Tasks</ULink>
    <template v-if="isAdmin">
      <span> | </span>
      <ULink
        to="/projects"
        :active-class="activeClass"
        :inactive-class="inactiveClass">Projects</ULink>
      <span> | </span>
      <ULink
        to="/users"
        :active-class="activeClass"
        :inactive-class="inactiveClass">Users</ULink>
    </template>
  </div>
</template>
