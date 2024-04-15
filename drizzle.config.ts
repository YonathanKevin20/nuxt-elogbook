import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './server/database/schemas/*.ts',
  out: './server/database/migrations',
})
