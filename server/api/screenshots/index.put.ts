import { db } from '~/server/database/connection'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  try {
    await db.update(screenshots)
    .set({
      description: body.description,
    })
    .where(eq(screenshots.path, body.path))

    return {
      message: 'Description screenshot updated successfully',
    }
  } catch (error: any) {
    console.error(error)
    throw createError({
      statusCode: error.status,
      statusMessage: error.message || error.data?.message || 'Internal Server Error',
    })
  }
})
