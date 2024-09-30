<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import type { SignIn } from '~/schemas/SignInSchema'
import { SignInSchema } from '~/schemas/SignInSchema'

useHead({
  title: 'Sign In'
})
definePageMeta({
  middleware: 'guest'
})

const state = reactive({
  email: '',
  password: ''
})
watchEffect(() => {
  if (state.email.length > 0 && state.password.length > 0) {
    errorMessage.value = ''
  }
})
const hidePassword = ref(true)
const errorMessage = ref('')
const pending = ref(false)

const supabase = useSupabaseClient()
const onSubmit = async (event: FormSubmitEvent<SignIn>) => {
  pending.value = true

  try {
    const { error } = await supabase.auth.signInWithPassword(event.data)

    if (error) {
      errorMessage.value = error.message

      return
    }

    await navigateTo('/')
  } catch (error: any) {
    console.error(error)
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <main>
    <h1 class="text-2xl font-bold">Sign In</h1>

    <UForm :schema="SignInSchema" :state="state" class="space-y-4 max-w-lg my-4" @submit="onSubmit">
      <UAlert
        v-if="errorMessage"
        color="red"
        variant="soft"
        :title="errorMessage" />
      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" type="email" />
      </UFormGroup>
      <UFormGroup label="Password" name="password">
        <UInput
          v-model="state.password"
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
