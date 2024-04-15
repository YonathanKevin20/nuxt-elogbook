import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { serverSupabaseUser } from '#supabase/server'
import { and, eq } from 'drizzle-orm'
import dayjs from 'dayjs'

export default defineEventHandler(async (event) => {
  const { databaseUrl } = useRuntimeConfig()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Bad Request',
    })
  }

  // Disable prefetch as it is not supported for "Transaction" pool mode
  const client = postgres(databaseUrl, { prepare: false })
  const db = drizzle(client)

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

  const item = items[0]
  item.implemented_at = dayjs(item.implemented_at).format('YYYY-MM-DD')

  return item
})
