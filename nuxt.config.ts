// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

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

  icon: {
    clientBundle: {
      // scan all components in the project and include icons
      scan: true,

      // guard for uncompressed bundle size, will fail the build if exceeds
      sizeLimitKb: 256,
    },
  },

  nitro: {
    imports: {
      dirs: [
        './server/database/schemas',
      ]
    },
    preset: 'bun',
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
