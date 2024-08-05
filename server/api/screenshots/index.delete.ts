import { db } from '~/server/database/connection'
import { inArray } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  try {
    await db.delete(screenshots).where(inArray(screenshots.path, body.paths))

    return {
      message: 'Screenshots deleted successfully',
    }
  } catch (error: any) {
    console.error(error)
    throw createError({
      statusCode: error.status,
      statusMessage: error.message || error.data?.message || 'Internal Server Error',
    })
  }
})
