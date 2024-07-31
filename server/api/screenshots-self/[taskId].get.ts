import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { and, asc, eq } from 'drizzle-orm'
import sharp from 'sharp'

const resizeBase64Image = async (url: string) => {
  const data = await $fetch<Blob>(url)
  const arrayBuffer = await data.arrayBuffer()

  const buffer = await sharp(arrayBuffer)
  .jpeg({
    mozjpeg: true,
    quality: 40
  })
  .toBuffer()

  return `data:${data.type};base64,` + Buffer.from(buffer).toString('base64')
}

export default defineEventHandler(async (event) => {
  const taskId = getRouterParam(event, 'taskId')

  if (!taskId) {
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
  const user = await serverSupabaseUser(event)

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
  const images = Promise.all(items.map(async (item) => {
    const { data } = await supabase.storage.from('task-screenshots').createSignedUrl(item.path, 120)

    if (data) {
      const base64Image = await resizeBase64Image(data.signedUrl)

      return {
        path: item.path,
        description: item.description,
        image: base64Image,
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
