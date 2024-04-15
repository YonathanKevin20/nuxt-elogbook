import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

export default defineEventHandler(async (event) => {
  const { databaseUrl } = useRuntimeConfig()

  // Disable prefetch as it is not supported for "Transaction" pool mode
  const client = postgres(databaseUrl, { prepare: false })
  const db = drizzle(client)

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
    throw createError({
      statusCode: error.status,
      message: error.message || error.data?.message || 'Internal Server Error',
    })
  }
})
