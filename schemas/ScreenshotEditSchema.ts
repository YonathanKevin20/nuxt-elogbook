import { z } from 'zod'

export const ScreenshotEditSchema = z.object({
  description: z.string()
})

export type ScreenshotEdit = z.output<typeof ScreenshotEditSchema>
