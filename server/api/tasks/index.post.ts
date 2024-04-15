import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const { databaseUrl } = useRuntimeConfig()

  // Disable prefetch as it is not supported for "Transaction" pool mode
  const client = postgres(databaseUrl, { prepare: false })
  const db = drizzle(client)

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
    throw createError({
      statusCode: error.status,
      message: error.message || error.data?.message || 'Internal Server Error',
    })
  }
})
