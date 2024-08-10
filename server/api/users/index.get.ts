import { db } from '~/server/database/connection'
import adminOnly from '~/server/adminOnly'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await adminOnly(event)

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
