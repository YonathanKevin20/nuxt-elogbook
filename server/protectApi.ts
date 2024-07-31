import type { H3Event, EventHandlerRequest  } from 'h3'
import { serverSupabaseSession } from '#supabase/server'

export default async (event: H3Event<EventHandlerRequest>) => {
  const session = await serverSupabaseSession(event)

  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }
}
