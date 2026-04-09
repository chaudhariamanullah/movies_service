import { z } from "zod";

export const addLanguageSchema = z.object({
  language_ids: z.array( z.number() ).min(1),
  languages: z.array(
    z.string().trim().min(2).max(30)
  ).min(1)
});

export type addLangugeInput = z.infer< typeof addLanguageSchema >;
