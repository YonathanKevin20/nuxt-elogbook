import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { db } from '~/server/database/connection'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)

  const body = await readBody(event)

  const supabase = await serverSupabaseClient(event)

  try {
    const { data, error } = await supabase.auth.updateUser({
      password: body.new_password || undefined,
      data: {
        full_name: body.full_name,
      }
    })

    if (error) {
      console.error('Error updating user:', error)
      throw createError({
        statusCode: error.status,
        statusMessage: error.message || 'Internal Server Error',
      })
    }

    await db.update(profiles)
    .set({
      fullName: body.full_name,
    })
    .where(eq(profiles.id, user!.id))

    return {
      message: 'Profile updated successfully',
    }
  } catch (error: any) {
    console.error(error)
    throw createError({
      statusCode: error.status,
      statusMessage: error.message || error.data?.message || 'Internal Server Error',
    })
  }
})
