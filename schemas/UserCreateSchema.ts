import { z } from 'zod'

export const UserCreateSchema = z.object({
  role: z.string().min(1, 'Please select a role'),
  email: z.string().email('Please enter a valid email'),
  full_name: z.string().min(1, 'Please enter a full name'),
})

export type UserCreate = z.output<typeof UserCreateSchema>
