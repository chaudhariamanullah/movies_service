import { z } from "zod";

export const languageSchema = z.object({
    language_name: z.string().min(3)
}).strict();

export type languageInput = z.infer<typeof languageSchema>