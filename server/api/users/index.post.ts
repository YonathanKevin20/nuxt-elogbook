import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

const generatePassword = () => Math.random().toString(36).slice(-8)

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const isAdmin = user!.app_metadata.role === 'admin'

  if (!isAdmin) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden',
    })
  }

  const body = await readBody(event)
  const password = generatePassword()

  const supabase = serverSupabaseServiceRole(event)

  const { data, error } = await supabase.auth.admin.createUser({
    email: body.email,
    email_confirm: true,
    password,
    app_metadata: {
      role: body.role,
    },
    user_metadata: {
      full_name: body.full_name,
    }
  })

  if (error) {
    throw createError({
      statusCode: error.status,
      message: error.message || 'Internal Server Error',
    })
  }

  setResponseStatus(event, 201)
  return {
    message: 'User created successfully',
    password,
  }
})
