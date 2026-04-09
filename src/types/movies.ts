export interface Movie{
    movie_public_id:string,
    title:string,
    poster_url:string,
    released_at:Date,
    created_at:Date,
    updated_at:Date
}

export type MovieUpdate = Omit<Movie,"movie_public_id" | "created_at" | "updated_at">