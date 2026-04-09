import { z } from "zod";

export const editActorSchema = z.object({
    artist_name: z.string().min(3).optional(),
    artist_dob: z.coerce.date().optional(),
    artist_country: z.string().min(2).optional(),
    artist_city: z.string().min(2).optional()
});

export type editActorInput = z.infer< typeof editActorSchema >;
