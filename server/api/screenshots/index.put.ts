import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { databaseUrl } = useRuntimeConfig()

  // Disable prefetch as it is not supported for "Transaction" pool mode
  const client = postgres(databaseUrl, { prepare: false })
  const db = drizzle(client)

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
    throw createError({
      statusCode: error.status,
      message: error.message || error.data?.message || 'Internal Server Error',
    })
  }
})
