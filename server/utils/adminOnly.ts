
import type { H3Event } from 'h3'
import { serverSupabaseUser } from '#supabase/server'

export const adminOnly = async (event: H3Event) => {
  const user = await serverSupabaseUser(event)
  const isAdmin = user!.user_metadata.role === 'admin'

  if (!isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }
}
