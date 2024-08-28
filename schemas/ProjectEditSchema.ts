import { z } from 'zod'

export const ProjectEditSchema = z.object({
  name: z.string().min(1, 'Please enter a title'),
})

export type ProjectEdit = z.output<typeof ProjectEditSchema>
