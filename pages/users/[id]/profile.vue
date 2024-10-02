<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import type { ProfileEdit } from '~/schemas/ProfileEditSchema'
import { ProfileEditSchema } from '~/schemas/ProfileEditSchema'

useHead({
  title: 'Profile',
})
definePageMeta({
  middleware: 'auth'
})

const state = reactive({
  email: '',
  full_name: '',
  new_password: '',
})
const hidePassword = ref(true)

const route = useRoute()
const id = route.params.id
const initState = async () => {
  try {
    const data = await $fetch(`/api/users/${id}`)

    if (data) {
      state.email = data.email
      state.full_name = data.full_name
    }
  } catch (error: any) {
    console.error(error)
  }
}

onMounted(() => {
  initState()
})

const toast = useToast()

const pending = ref(false)
const onSubmit = async (event: FormSubmitEvent<ProfileEdit>) => {
  pending.value = true

  try {
    const data = await $fetch(`/api/profiles`, {
      method: 'PUT',
      body: event.data
    })

    toast.add({ title: data.message })
  } catch (error: any) {
    toast.add({ title: error.data.message })
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <main>
    <h1 class="text-2xl font-bold">Profile</h1>

    <UForm :schema="ProfileEditSchema" :state="state" class="space-y-4 max-w-lg my-4" @submit="onSubmit">
      <UFormGroup label="Email" name="email">
        <UInput :model-value="state.email" readonly />
      </UFormGroup>
      <UFormGroup label="Full Name" name="full_name">
        <UInput v-model="state.full_name" />
      </UFormGroup>
      <UFormGroup label="New Password" name="new_password">
        <UInput
          v-model="state.new_password"
          :type="hidePassword ? 'password' : 'text'"
          :ui="{ icon: { trailing: { pointer: '' } } }">
          <template #trailing>
            <UButton
              v-show="hidePassword"
              color="black"
              variant="link"
              icon="i-heroicons-eye-20-solid"
              :padded="false"
              @click="hidePassword = !hidePassword" />
            <UButton
              v-show="!hidePassword"
              color="black"
              variant="link"
              icon="i-heroicons-eye-slash-20-solid"
              :padded="false"
              @click="hidePassword = !hidePassword" />
          </template>
        </UInput>
      </UFormGroup>
      <UButton type="submit" label="Submit" :loading="pending" />
    </UForm>
  </main>
</template>
