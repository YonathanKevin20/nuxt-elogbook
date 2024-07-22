import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './server/database/schemas/*.ts',
  out: './server/database/migrations',
})
