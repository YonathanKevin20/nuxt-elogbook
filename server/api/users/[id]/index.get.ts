import { db } from '~/server/database/connection'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
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
    WHERE
      auth.users.id = ${id}
    LIMIT 1
  `)

  if (items.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
    })
  }

  const item = items[0]

  return item
})
