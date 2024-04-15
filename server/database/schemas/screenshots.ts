import { sql } from 'drizzle-orm'
import { pgTable, bigserial, bigint, text, timestamp } from 'drizzle-orm/pg-core'

export const screenshots = pgTable('screenshots', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).default(sql`timezone('utc'::text, now())`),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }),
  taskId: bigint('task_id', { mode: 'number' }).notNull().references(() => tasks.id),
  path: text('path').notNull().unique(),
  description: text('description'),
})

export type SelectScreenshot = typeof screenshots.$inferSelect
export type InsertScreenshot = typeof screenshots.$inferInsert
