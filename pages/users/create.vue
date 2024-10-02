<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import type { UserCreate } from '~/schemas/UserCreateSchema'
import { UserCreateSchema } from '~/schemas/UserCreateSchema'

useHead({
  title: 'Create User'
})
definePageMeta({
  middleware: ['auth', 'admin']
})

const state = reactive({
  role: '',
  email: '',
  full_name: '',
})

const toast = useToast()

const pending = ref(false)
const onSubmit = async (event: FormSubmitEvent<UserCreate>) => {
  pending.value = true

  try {
    const data = await $fetch('/api/users', {
      method: 'POST',
      body: event.data
    })

    toast.add({ title: data.message })
    password.value = data.password
  } catch (error: any) {
    toast.add({ title: error.data.message })
  } finally {
    pending.value = false
  }
}

const password = ref('')
const copiedPassword = ref(false)
const copyPassword = () => {
  copiedPassword.value = true
  navigator.clipboard.writeText(password.value)
  toast.add({ title: 'Password copied to clipboard' })
}
</script>

<template>
  <main>
    <h1 class="text-2xl font-bold">Create User</h1>

    <UForm :schema="UserCreateSchema" :state="state" class="space-y-4 max-w-lg my-4" @submit="onSubmit">
      <UAlert
        v-if="password"
        color="emerald"
        variant="solid"
        title="Please copy the password below">
        <template #description>
          <div class="flex items-center space-x-2">
            <UInput
              :model-value="password"
              class="w-full"
              readonly
              :ui="{ icon: { trailing: { pointer: '' } } }">
              <template #trailing>
                <UButton
                  color="black"
                  variant="link"
                  :label="copiedPassword ? 'Copied' : 'Copy'"
                  :padded="false"
                  @click="copyPassword()" />
              </template>
            </UInput>
          </div>
        </template>
      </UAlert>
      <UFormGroup label="Role" name="role">
        <SelectMenuRole v-model="state.role" />
      </UFormGroup>
      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" type="email" />
      </UFormGroup>
      <UFormGroup label="Full Name" name="full_name">
        <UInput v-model="state.full_name" />
      </UFormGroup>
      <UButton type="submit" label="Submit" :loading="pending" />
    </UForm>
  </main>
</template>
