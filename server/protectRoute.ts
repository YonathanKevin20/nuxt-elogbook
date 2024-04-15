import type { H3Event, EventHandlerRequest  } from 'h3'
import { serverSupabaseUser } from '#supabase/server'

export default async (event: H3Event<EventHandlerRequest>) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }
}
