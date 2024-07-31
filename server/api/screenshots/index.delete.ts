import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { inArray } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { databaseUrl } = useRuntimeConfig()

  // Disable prefetch as it is not supported for "Transaction" pool mode
  const client = postgres(databaseUrl, { prepare: false })
  const db = drizzle(client)

  const body = await readBody(event)

  try {
    await db.delete(screenshots).where(inArray(screenshots.path, body.paths))

    return {
      message: 'Screenshots deleted successfully',
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.status,
      message: error.message || error.data?.message || 'Internal Server Error',
    })
  }
})
