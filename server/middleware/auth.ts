import type { H3Event } from 'h3'
import { serverSupabaseSession } from '#supabase/server'

const GUEST_APIS = [
  {
    method: 'GET',
    path: '/api/_nuxt_icon/'
  }
]

export default defineEventHandler(async (event) => {
  const { method, path } = event

  if (!path.startsWith('/api') || GUEST_APIS.some((api) => method === api.method && path.startsWith(api.path))) {
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
