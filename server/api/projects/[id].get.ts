import { db } from '~/server/database/connection'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    })
  }

  const items = await db.select({
    id: projects.id,
    name: projects.name,
  })
  .from(projects)
  .where(eq(projects.id, +id))
  .limit(1)

  if (items.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
    })
  }

  const item = items[0]

  return item
})
