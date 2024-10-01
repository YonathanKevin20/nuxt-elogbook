import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const profiles = pgTable('profiles', {
  id: uuid('id').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }),
  fullName: text('full_name').notNull(),
  role: text('role').notNull(),
})

export type SelectProfile = typeof profiles.$inferSelect
