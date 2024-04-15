import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { eq } from 'drizzle-orm'

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

  const body = await readBody(event)

  try {
    await db.update(tasks)
    .set({
      projectId: body.project_id,
      implementedAt: body.implemented_at,
      description: body.description,
      status: body.status,
    })
    .where(eq(tasks.id, +id))

    return {
      message: 'Task updated successfully',
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.status,
      message: error.message || error.data?.message || 'Internal Server Error',
    })
  }
})
