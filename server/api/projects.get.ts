import { db } from '~/server/database/connection'

export default defineCachedEventHandler(async (event) => {
  const items = await db.select({
    id: projects.id,
    name: projects.name,
  })
  .from(projects)

  return items
}, {
  maxAge: 60 * 60 * 12, // 12 hours
})
