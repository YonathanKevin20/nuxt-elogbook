import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import adminOnly from '~/server/adminOnly'

export default defineEventHandler(async (event) => {
  await adminOnly(event)

  const user = await serverSupabaseUser(event)

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    })
  }

  if (id === user!.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'You cannot delete yourself',
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
