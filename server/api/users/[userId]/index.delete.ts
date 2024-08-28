import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  await adminOnly(event)

  const user = await serverSupabaseUser(event)

  const userId = getRouterParam(event, 'userId')

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    })
  }

  if (userId === user!.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'You cannot delete yourself',
    })
  }

  const supabase = serverSupabaseServiceRole(event)

  const { data, error } = await supabase.auth.admin.deleteUser(userId)

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
