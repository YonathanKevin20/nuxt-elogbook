import { serverSupabaseUser } from '#supabase/server'
import { db } from '~/server/database/connection'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const user = await serverSupabaseUser(event)

  try {
    await db.insert(tasks)
    .values({
      userId: user!.id,
      projectId: body.project_id,
      implementedAt: body.implemented_at,
      description: body.description,
      status: body.status,
    })

    setResponseStatus(event, 201)
    return {
      message: 'Task created successfully',
    }
  } catch (error: any) {
    console.error(error)
    throw createError({
      statusCode: error.status,
      statusMessage: error.message || error.data?.message || 'Internal Server Error',
    })
  }
})
