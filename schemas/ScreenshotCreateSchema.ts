import { z } from 'zod'

export const ScreenshotCreateSchema = z.object({
  description: z.string()
})

export type ScreenshotCreate = z.output<typeof ScreenshotCreateSchema>
