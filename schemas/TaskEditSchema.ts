import { z } from 'zod'

export const TaskEditSchema = z.object({
  project_id: z.string().min(1, 'Please select a project'),
  implemented_at: z.string(),
  description: z.string().min(32, 'Must be at least 32 characters'),
  status: z.string().min(1, 'Please select a status'),
})

export type TaskEdit = z.output<typeof TaskEditSchema>
