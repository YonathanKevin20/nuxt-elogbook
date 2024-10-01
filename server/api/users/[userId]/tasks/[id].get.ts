import { db } from '~/server/database/connection'
import { and, eq } from 'drizzle-orm'
import dayjs from 'dayjs'

export default defineEventHandler(async (event) => {
  await adminOnly(event)

  const userId = getRouterParam(event, 'userId')
  const id = getRouterParam(event, 'id')

  if (!userId || !id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    })
  }

  const items = await db.select({
    id: tasks.id,
    project_name: tasks.projectName,
    implemented_at: tasks.implementedAt,
    description: tasks.description,
    status: tasks.status,
  })
  .from(tasks)
  .where(
    and(
      eq(tasks.userId, userId),
      eq(tasks.id, +id)
    )
  )
  .limit(1)

  if (items.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
    })
  }

  const item = items[0]
  item.implemented_at = dayjs(item.implemented_at).format('YYYY-MM-DD')

  return item
})
