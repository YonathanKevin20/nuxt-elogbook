import { z } from 'zod'

export const ProjectCreateSchema = z.object({
  name: z.string().min(1, 'Please enter a title'),
})

export type ProjectCreate = z.output<typeof ProjectCreateSchema>
