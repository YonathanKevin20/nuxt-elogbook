import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

export default defineCachedEventHandler(async (event) => {
  const { databaseUrl } = useRuntimeConfig()

  // Disable prefetch as it is not supported for "Transaction" pool mode
  const client = postgres(databaseUrl, { prepare: false })
  const db = drizzle(client)

  const items = await db.select({
    id: projects.id,
    name: projects.name,
  })
  .from(projects)

  return items
}, {
  maxAge: 60 * 60 * 12, // 12 hours
})
