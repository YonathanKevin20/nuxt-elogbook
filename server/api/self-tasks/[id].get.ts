import { serverSupabaseUser } from '#supabase/server'
import { db } from '~/server/database/connection'
import { and, eq } from 'drizzle-orm'
import dayjs from 'dayjs'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    })
  }

  const user = await serverSupabaseUser(event)

  const items = await db.select({
    id: tasks.id,
    project_id: tasks.projectId,
    implemented_at: tasks.implementedAt,
    description: tasks.description,
    status: tasks.status,
  })
  .from(tasks)
  .where(
    and(
      eq(tasks.id, +id),
      eq(tasks.userId, user!.id)
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
