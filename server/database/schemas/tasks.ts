import { sql } from 'drizzle-orm'
import { pgTable, bigserial, bigint, uuid, text, timestamp, date } from 'drizzle-orm/pg-core'

export const tasks = pgTable('tasks', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).default(sql`timezone('utc'::text, now())`),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }),
  userId: uuid('user_id').default(sql`auth.uid()`).notNull(),
  projectId: bigint('project_id', { mode: 'number' }).notNull().references(() => projects.id),
  implementedAt: date('implemented_at', { mode: 'string' }).notNull(),
  description: text('description').notNull(),
  status: text('status').notNull(),
})

export type SelectTask = typeof tasks.$inferSelect
export type InsertTask = typeof tasks.$inferInsert
