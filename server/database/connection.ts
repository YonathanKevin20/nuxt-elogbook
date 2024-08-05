import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'

const { databaseUrl } = useRuntimeConfig()

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(databaseUrl, { prepare: false })

export const db = drizzle(client)
