import { z } from "zod";

export const createActorSchema = z.object({
    artist_name:z.string().min(3),
    artist_dob:z.coerce.date(),
    artist_country:z.string().min(3),
    artist_city:z.string().min(2),
}).strict();

export type createActorInput = z.infer<typeof createActorSchema>