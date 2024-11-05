import { z } from 'zod'

export const ProfileEditSchema = z.object({
  full_name: z.string().min(1, 'Please enter a full name'),
  new_password: z.union([z.string().min(8, 'Password must be at least 8 characters long'), z.literal('')]),
})

export type ProfileEdit = z.output<typeof ProfileEditSchema>
