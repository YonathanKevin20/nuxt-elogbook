import { serverSupabaseUser } from '#supabase/server'
import { db } from '~/server/database/connection'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const isAdmin = user!.user_metadata.role === 'admin'

  if (!isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }

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
