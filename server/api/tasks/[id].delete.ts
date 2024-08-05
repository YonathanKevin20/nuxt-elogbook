import { serverSupabaseClient } from '#supabase/server'
import { db } from '~/server/database/connection'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    })
  }

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
    console.error(error)
    throw createError({
      statusCode: error.status,
      statusMessage: error.message || error.data?.message || 'Internal Server Error',
    })
  }
})
