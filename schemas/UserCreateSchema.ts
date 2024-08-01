import { z } from 'zod'

export const UserCreateSchema = z.object({
  role: z.string().min(1, 'Please select a role'),
  email: z.string().email('Invalid email'),
  full_name: z.string()
})

export type UserCreate = z.output<typeof UserCreateSchema>
