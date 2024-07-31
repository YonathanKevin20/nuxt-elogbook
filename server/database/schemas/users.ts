import { pgSchema, uuid, text, jsonb } from 'drizzle-orm/pg-core'

export const auth = pgSchema('auth')

export const users = auth.table('users', {
  id: uuid('id').notNull(),
  email: text('email'),
  rawUserMetaData: jsonb('raw_user_meta_data').$type<{ app_role: string }>(),
})

export type SelectUser = typeof users.$inferSelect
export type InsertUser = typeof users.$inferInsert
