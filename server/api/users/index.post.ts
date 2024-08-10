import { serverSupabaseServiceRole } from '#supabase/server'
import adminOnly from '~/server/adminOnly'

const generatePassword = () => Math.random().toString(36).slice(-8)

export default defineEventHandler(async (event) => {
  await adminOnly(event)

  const body = await readBody(event)
  const password = generatePassword()

  const supabase = serverSupabaseServiceRole(event)

  const { data, error } = await supabase.auth.admin.createUser({
    email: body.email,
    email_confirm: true,
    password,
    user_metadata: {
      full_name: body.full_name,
      role: body.role,
    }
  })

  if (error) {
    console.error('Error creating user:', error)
    throw createError({
      statusCode: error.status,
      statusMessage: error.message || 'Internal Server Error',
    })
  }

  setResponseStatus(event, 201)
  return {
    message: 'User created successfully',
    password,
  }
})
