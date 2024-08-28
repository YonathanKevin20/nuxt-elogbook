import type { H3Event } from 'h3'
import { db } from '~/server/database/connection'

export default defineEventHandler(async (event) => {
  const data = await cachedData(event)

  return data
})

const cachedData = defineCachedFunction(async (_event: H3Event) => {
  const items = await db.select({
    id: projects.id,
    name: projects.name,
  })
  .from(projects)

  return items
}, {
  name: 'projects',
  getKey: () => 'all',
  maxAge: 60 * 60 * 24, // 24 hours
  swr: false
})
