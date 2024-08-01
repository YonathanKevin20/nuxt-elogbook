import { serverSupabaseUser } from '#supabase/server'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const isAdmin = user!.app_metadata.role === 'admin'

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

  const items = await db.execute<{
    id: string
    full_name: string
    role: string
  }>(sql`
    SELECT
      auth.users.id,
      full_name,
      profiles.role
    FROM
      auth.users
    INNER JOIN
      profiles ON auth.users.id = profiles.id
    ORDER BY
      profiles.role, full_name
  `)

  return items
})
