import { db } from '~/server/database/connection'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  try {
    await db.insert(projects)
    .values({
      name: body.name,
    })

    await invalidateCache('cache:nitro:functions', 'projects:all.json')

    setResponseStatus(event, 201)
    return {
      message: 'Project created successfully',
    }
  } catch (error: any) {
    console.error(error)
    throw createError({
      statusCode: error.status,
      statusMessage: error.message || error.data?.message || 'Internal Server Error',
    })
  }
})
