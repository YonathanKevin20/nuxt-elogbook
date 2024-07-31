import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { serverSupabaseClient } from '#supabase/server'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Bad Request',
    })
  }

  const { databaseUrl } = useRuntimeConfig()

  // Disable prefetch as it is not supported for "Transaction" pool mode
  const client = postgres(databaseUrl, { prepare: false })
  const db = drizzle(client)

  const supabase = await serverSupabaseClient(event)

  // Delete files from storage
  const deleteFiles = async () => {
    const items = await db.select({
      path: screenshots.path,
    })
    .from(screenshots)
    .where(eq(screenshots.taskId, +id))

    const paths = items.map((item) => item.path)

    await supabase.storage.from('task-screenshots').remove(paths)
  }

  try {
    await deleteFiles()
    await db.delete(tasks).where(eq(tasks.id, +id))

    return {
      message: 'Task deleted successfully',
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.status,
      message: error.message || error.data?.message || 'Internal Server Error',
    })
  }
})
