import { z } from "zod";

export const updateMovieSchema = z.object({
  title: z.string().min(1),
  released_at: z.coerce.date(),
  status: z.coerce.number(),
  movie_description: z.string(),
  movie_duration: z.coerce.number(),
  age_rating: z.string(),
}).partial().strict()


export type updateMovieInput = z.infer<typeof updateMovieSchema> & {
  poster_url?: string;
};