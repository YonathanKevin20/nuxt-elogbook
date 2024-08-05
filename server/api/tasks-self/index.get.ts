import { serverSupabaseUser } from '#supabase/server'
import { db } from '~/server/database/connection'
import { and, desc, eq, gte, lte, sql } from 'drizzle-orm'
import dayjs from 'dayjs'

const getDatetimeRange = (year: number, month: number) => {
  const start = dayjs().year(year).month(month - 1).startOf('month')
  const end = start.clone().endOf('month')

  return {
    start: start.format('YYYY-MM-DD'),
    end: end.format('YYYY-MM-DD'),
  }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const year = query.year
  const month = query.month

  if (!year || !month) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    })
  }

  const { start, end } = getDatetimeRange(+year, +month)

  const user = await serverSupabaseUser(event)

  const items = await db.select({
    id: tasks.id,
    project_name: projects.name,
    implemented_at: tasks.implementedAt,
    description: tasks.description,
    status: tasks.status,
    screenshots_count: sql.raw('(SELECT COUNT(*) FROM screenshots WHERE task_id = tasks.id) AS screenshots_count'),
  })
  .from(tasks)
  .innerJoin(projects, eq(tasks.projectId, projects.id))
  .where(
    and(
      eq(tasks.userId, user!.id),
      and(
        gte(tasks.implementedAt, start),
        lte(tasks.implementedAt, end)
      )
    )
  )
  .orderBy(desc(tasks.implementedAt), desc(tasks.createdAt))

  items.forEach((item) => {
    item.implemented_at = dayjs(item.implemented_at).format('YYYY-MM-DD')
  })

  return items
})
