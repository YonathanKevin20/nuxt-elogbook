import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
import { and, asc, eq } from 'drizzle-orm'

const toBase64 = async (url: string) => {
  const data = await $fetch<Blob>(url)
  const buffer = await data.arrayBuffer()
  return `data:${data.type};base64,` + Buffer.from(buffer).toString('base64')
}

export default defineEventHandler(async (event) => {
  const { databaseUrl } = useRuntimeConfig()
  const taskId = getRouterParam(event, 'taskId')

  if (!taskId) {
    throw createError({
      statusCode: 400,
      message: 'Bad Request',
    })
  }

  // Disable prefetch as it is not supported for "Transaction" pool mode
  const client = postgres(databaseUrl, { prepare: false })
  const db = drizzle(client)

  const user = await serverSupabaseUser(event)
  const supabase = await serverSupabaseClient(event)

  const items = await db.select({
    path: screenshots.path,
    description: screenshots.description,
  })
  .from(screenshots)
  .innerJoin(tasks, eq(screenshots.taskId, tasks.id))
  .where(
    and(
      eq(tasks.userId, user!.id),
      eq(tasks.id, +taskId)
    )
  )
  .orderBy(asc(screenshots.createdAt))

  // Create array of objects with image and description properties for each screenshot
  const images = await Promise.all(items.map(async (item) => {
    const { data } = await supabase.storage.from('task-screenshots').createSignedUrl(item.path, 120)

    if (data) {
      return {
        path: item.path,
        description: item.description,
        image: await toBase64(data.signedUrl),
      }
    }

    return {
      path: item.path,
      description: item.description,
      image: null,
    }
  }))


  return images
})
