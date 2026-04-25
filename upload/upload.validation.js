import { z } from "zod";

export const uploadValidation = z.object({
    subject: z.string(),
    title: z.string(),
    description: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    rotationDuration: z.coerce.number().optional()
});