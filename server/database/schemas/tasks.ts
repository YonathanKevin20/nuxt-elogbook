import { sql } from 'drizzle-orm'
import { bigint, bigserial, date, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const taskStatus = pgEnum('task_status', ['to_do', 'in_progress', 'done'])

export const tasks = pgTable('tasks', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).default(sql`timezone('utc'::text, now())`),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }),
  userId: uuid('user_id').default(sql`auth.uid()`).notNull(),
  projectId: bigint('project_id', { mode: 'number' }).notNull().references(() => projects.id),
  implementedAt: date('implemented_at', { mode: 'string' }).notNull(),
  description: text('description').notNull(),
  status: taskStatus('status').notNull(),
})

export type SelectTask = typeof tasks.$inferSelect
export type InsertTask = typeof tasks.$inferInsert
