import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const isAdmin = user!.app_metadata.role === 'admin'

  if (!isAdmin) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden',
    })
  }

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Bad Request',
    })
  }

  const supabase = serverSupabaseServiceRole(event)

  const { data, error } = await supabase.auth.admin.deleteUser(id)

  if (error) {
    throw createError({
      statusCode: error.status,
      message: error.message || 'Internal Server Error',
    })
  }

  return {
    message: 'User deleted successfully',
  }
})
