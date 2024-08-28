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
    await db.update(projects)
    .set({
      name: body.name,
    })
    .where(eq(projects.id, +id))

    await invalidateCache('cache:nitro:functions', 'projects:all.json')

    return {
      message: 'Project updated successfully',
    }
  } catch (error: any) {
    console.error(error)
    throw createError({
      statusCode: error.status,
      statusMessage: error.message || error.data?.message || 'Internal Server Error',
    })
  }
})
