import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const isAdmin = user!.user_metadata.role === 'admin'

  if (!isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    })
  }

  const supabase = serverSupabaseServiceRole(event)

  const { data, error } = await supabase.auth.admin.deleteUser(id)

  if (error) {
    console.error('Error deleting user:', error)
    throw createError({
      statusCode: error.status,
      statusMessage: error.message || 'Internal Server Error',
    })
  }

  return {
    message: 'User deleted successfully',
  }
})
