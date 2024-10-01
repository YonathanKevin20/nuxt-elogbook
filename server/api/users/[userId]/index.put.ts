import { db } from '~/server/database/connection'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId')

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    })
  }

  const body = await readBody(event)

  try {
    await db.update(profiles)
    .set({
      fullName: body.full_name,
      role: body.role,
    })
    .where(eq(profiles.id, userId))

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
