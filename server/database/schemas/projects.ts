import { pgTable, bigserial, text } from 'drizzle-orm/pg-core'

export const projects = pgTable('projects', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  name: text('name').notNull().unique(),
})

export type SelectProject = typeof projects.$inferSelect
