import { z } from 'zod'

export const SignInSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

export type SignIn = z.output<typeof SignInSchema>
