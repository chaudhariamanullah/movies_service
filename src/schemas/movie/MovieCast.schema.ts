import { z } from "zod";

export const addCastSchema = z.object({
    artist_public_id:z.string().trim(),
    character_name: z.string().trim().optional().or(z.literal("")),
    job: z.enum(['actor','writer','producer','crew','director'])
}).strict();

export type addCastInput = z.infer< typeof addCastSchema >;