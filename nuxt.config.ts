// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: ['@vuepic/vue-datepicker']
  },

  colorMode: {
    preference: 'light'
  },

  dayjs: {
    plugins: ['timezone']
  },

  devtools: { enabled: true },

  nitro: {
    imports: {
      dirs: [
        './server/database/schemas',
      ]
    }
  },

  modules: [
    'dayjs-nuxt',
    '@nuxtjs/supabase',
    '@nuxt/ui',
  ],

  runtimeConfig: {
    databaseUrl: '',
  },

  supabase: {
    redirect: false,
  },

  typescript: {
    strict: true,
    typeCheck: true
  },

  compatibilityDate: '2024-07-22'
})
