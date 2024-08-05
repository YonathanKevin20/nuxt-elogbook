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
    console.error(error)
    throw createError({
      statusCode: error.status,
      statusMessage: error.message || error.data?.message || 'Internal Server Error',
    })
  }
})
