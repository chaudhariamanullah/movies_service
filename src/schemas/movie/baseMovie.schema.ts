import { z } from "zod"

export const createMovieSchema = z.object({
  title: z.string().min(1),
  released_at: z.coerce.date(),
  status: z.coerce.number(),
  movie_description: z.string(),
  movie_duration: z.coerce.number(),
  age_rating: z.string(),
}).strict();

export type CreateMovieInput = z.infer<typeof createMovieSchema> & {
  poster_url?: string;
};
