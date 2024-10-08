import { db } from '~/server/database/connection'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId')

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    })
  }

  const items = await db.execute<{
    id: string
    email: string
    full_name: string
    role: string
  }>(sql`
    SELECT
      auth.users.id,
      auth.users.email,
      full_name,
      profiles.role
    FROM
      auth.users
    INNER JOIN
      profiles ON auth.users.id = profiles.id
    WHERE
      auth.users.id = ${userId}
    LIMIT 1
  `)

  if (items.length === 0) {
    return null
  }

  const item = items[0]

  return item
})
