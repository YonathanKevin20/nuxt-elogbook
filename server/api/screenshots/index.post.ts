import { db } from '~/server/database/connection'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  try {
    await db.insert(screenshots)
    .values({
      taskId: body.task_id,
      path: body.path,
      description: body.description || null,
    })

    setResponseStatus(event, 201)
    return {
      message: 'Screenshot created successfully',
    }
  } catch (error: any) {
    console.error(error)
    throw createError({
      statusCode: error.status,
      statusMessage: error.message || error.data?.message || 'Internal Server Error',
    })
  }
})
