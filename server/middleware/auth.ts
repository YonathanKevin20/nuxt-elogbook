import type { H3Event } from 'h3'
import { serverSupabaseSession } from '#supabase/server'

const GUEST_PATHS = ['/api/_nuxt_icon/']

export default defineEventHandler(async (event) => {
  const { path } = event

  if (!path.startsWith('/api') || GUEST_PATHS.some((guestPath) => path.startsWith(guestPath))) {
    return
  }

  await protectApi(event)
})

const protectApi = async (event: H3Event) => {
  const session = await serverSupabaseSession(event)

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
}
