import { serverSupabaseUser } from '#supabase/server'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const isAdmin = user!.user_metadata.app_role === 'admin'

  if (!isAdmin) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden',
    })
  }

  const { databaseUrl } = useRuntimeConfig()

  // Disable prefetch as it is not supported for "Transaction" pool mode
  const client = postgres(databaseUrl, { prepare: false })
  const db = drizzle(client)

  const items = await db.select({
    email: users.email,
    app_role: sql.raw(`raw_user_meta_data->>'app_role'`),
  })
  .from(users)

  return items
})
