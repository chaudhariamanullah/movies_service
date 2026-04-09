import pool from "../config/db.js";
import type { CreateMovieInput} from '../schemas/movie/baseMovie.schema.js';
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import type { updateMovieInput } from '../schemas/movie/updateMovie.schema.js';
import type { AddLanguagesList } from "../types/movie_languages.js";
import type { InputCast } from "../types/inputCast.type.js"

const MovieModel = {
    async insert(movie:CreateMovieInput,movie_public_id:string){
        const sql = `INSERT INTO 
                     movies(movie_public_id,title,poster_url,movie_description,movie_duration,age_rating,status,released_at)
                     VALUES(?,?,?,?,?,?,?,?)`;
        await pool.execute(sql, [
            movie_public_id,
            movie.title,
            movie.poster_url,
            movie.movie_description,
            Number(movie.movie_duration),
            movie.age_rating,
            movie.status ?? 1,
            movie.released_at,
        ]);

        return { movie_public_id: movie_public_id}
    },

    async fetchAll(limit:number,offset:number){
        const sql = `SELECT
                    movie_public_id, title, poster_url, status, released_at
                    FROM movies 
                    LIMIT ${limit} OFFSET ${offset}`;
                    
        const [rows] = await pool.execute(sql);
        return rows
    },

    async fetchActiveMovies(offset:number){

        const sql = `SELECT 
                    movie_public_id, title, poster_url
                    FROM movies
                    WHERE status = 1
                    ORDER BY released_at DESC
                    LIMIT 5 OFFSET ${offset}`;

        const [rows] = await pool.execute(sql,);
        return rows;
    },

    async fetchOne(movie_public_id:string){

        const sql = `SELECT     
                    title,poster_url,released_at,status,movie_description,movie_duration,age_rating
                    FROM movies WHERE movie_public_id = ?`;
        const [rows] = await pool.execute<RowDataPacket[]>(sql, [movie_public_id]);
        return rows[0];
    },

    async update(movie_public_id:string,data:updateMovieInput){
        const keys = Object.keys(data);
        const fields = keys.map(k => `${k} = ?`).join(", ")
        const values = keys.map(k => (data as any)[k]);
        const sql = `UPDATE movies SET ${fields} WHERE movie_public_id = ?`
        return await pool.execute(sql, [...values,movie_public_id]);
    },

    async deleteMovie(movie_public_id:string){
        const sql = "DELETE FROM movies WHERE movie_public_id = ?";
        await pool.execute(sql,[movie_public_id]);
    },

    async fetchMovieLanguages(movie_public_id:string){

        const sql = `SELECT l.language_id, l.language_name
                        FROM languages l
                        JOIN movie_language ml ON ml.language_id = l.language_id
                        JOIN movies m ON m.movie_id = ml.movie_id
                        WHERE m.movie_public_id = ?`;

        const [languages] = await pool.execute<[RowDataPacket]>(sql, [movie_public_id]);
        return languages;

    },

    async addLanguages(movie_public_id: string, languages: AddLanguagesList) {

        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            const [rows]: any = await conn.execute(
                `SELECT movie_id FROM movies WHERE movie_public_id = ?`,
                [movie_public_id]
            );

            if (rows.length === 0) {
                throw new Error("Movie not found");
            }

            const movie_id = rows[0].movie_id;
            await conn.execute(
                `DELETE FROM movie_language WHERE movie_id = ?`,
                [movie_id]
            );

            if (languages.language_ids.length > 0) {
                const values = languages.language_ids.map(id => [movie_id, id]);

                await conn.query(
                    `INSERT INTO movie_language (movie_id, language_id) VALUES ?`,
                    [values]
                );
            }
            await conn.commit();
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    },

    async deleteLanguage(movie_public_id:string,language_id:string){
        const sql = `DELETE ml
                    FROM movie_language ml
                    JOIN movies m 
                    ON m.movie_id = ml.movie_id
                    WHERE ml.language_id = ?
                    AND 
                    m.movie_public_id = ?`;
        return await pool.execute(sql,[movie_public_id,language_id])
    },

    async fetchCast(movie_public_id:string){
        const sql = `SELECT mc.cast_public_id, a.artist_public_id, a.artist_name, a.artist_photo, mc.character_name, mc.job
                    FROM movie_cast mc
                    JOIN movies m ON mc.movie_id = m.movie_id
                    JOIN artists a ON mc.artist_id = a.artist_id
                    WHERE m.movie_public_id = ?`
        
        const [casts] = await pool.execute<[RowDataPacket]>(sql,[movie_public_id]);
        return casts;
    },

    async addCast(movie_public_id:string,cast:InputCast){

        const sql = `INSERT INTO movie_cast (cast_public_id, movie_id, artist_id, character_name, job)
                     SELECT ?, m.movie_id, a.artist_id, ?, ?
                     FROM movies m
                     JOIN artists a
                     ON a.artist_public_id = ?
                     WHERE m.movie_public_id = ?`;

        const [rows] = await pool.execute<ResultSetHeader>(sql,[
            cast.cast_public_id, 
            cast.character_name ?? null, 
            cast.job, 
            cast.artist_public_id,
            movie_public_id
        ]);

        if( rows.affectedRows > 0)
            return true;
        else
            return false;
    },

    async deleteCast(cast_public_id:string){
        const sql = `DELETE FROM movie_cast WHERE cast_public_id = ?`;
        return pool.execute(sql,[cast_public_id])
    },

    async genres(){
        const sql = "SELECT genre_id, genre_name FROM genres";
        const [rows] = await pool.execute<RowDataPacket[]>(sql);
        return rows ?? null;
    },

    async movieGenres(movie_public_id:string){
        
        const sql = `SELECT g.genre_id, g.genre_name
                    FROM movies m
                    JOIN movie_genres mg ON m.movie_id = mg.movie_id
                    JOIN genres g ON mg.genre_id = g.genre_id
                    WHERE m.movie_public_id = ?`;
        const [rows] = await pool.execute<RowDataPacket[]>(sql,[movie_public_id]);
        return rows ?? null;
    },

    async addMovieGenres(movie_public_id: string, genre_ids: number[]) {
        const conn = await pool.getConnection();

        try {
            await conn.beginTransaction();

            const [rows]: any = await conn.execute(
            `SELECT movie_id FROM movies WHERE movie_public_id = ?`,
            [movie_public_id]
            );

            const movie_id = rows[0].movie_id;
            await conn.execute(
                `DELETE FROM movie_genres WHERE movie_id = ?`,
                [movie_id]);

            if (genre_ids.length > 0) {
            const values = genre_ids.map((genre_id) => [movie_id, genre_id]);

            await conn.query(`
                INSERT INTO movie_genres (movie_id, genre_id) VALUES ?`,
                [values])}
            await conn.commit();
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    },

    async removeMovieGenre(movie_public_id: string, genre_id: number) {
        const sql = `DELETE mg
                    FROM movie_genres mg
                    JOIN movies m ON mg.movie_id = m.movie_id
                    WHERE m.movie_public_id = ?
                    AND mg.genre_id = ?`;
        return await pool.execute(sql, [movie_public_id, genre_id]);
    },

    async fetchReviews(movie_public_id:string,offset:number){
        const sql = `SELECT 
                     review_public_id, user_public_id, username, comment, rating, created_at
                     FROM user_review
                     WHERE movie_public_id = ?
                     LIMIT 5 OFFSET ${offset}`;

        const [rows] = await pool.execute<RowDataPacket[]>(sql,[movie_public_id]);
        return rows;               
    },

    async fetchReviewsSummary(movie_public_id:string){
        const sql = `SELECT 
                     ROUND(AVG(rating), 1) AS avg_rating,
                     COUNT(*) AS total_reviews
                     FROM user_review
                     WHERE movie_public_id = ?`;

        const [summary] = await pool.execute<RowDataPacket[]>(sql,[movie_public_id]);
        return summary[0] ?? null;
    },

    async insertReview(review:any,movie_public_id:string){
        const sql = `INSERT INTO user_review
                    (review_public_id,movie_public_id,user_public_id,username,rating,comment)
                    VALUES(?,?,?,?,?,?)`;

        const [result] = await pool.execute<ResultSetHeader>(sql,[
            review.review_public_id,
            movie_public_id,
            review.user_public_id,
            review.user_name,
            review.rating,
            review.comment
        ]);

        return result;
    },

    async deleteReview(review_public_id:string,user_public_id:string){
        const sql = `DELETE FROM user_review WHERE 
                    user_public_id = ? 
                    AND review_public_id = ?`;
        const [result] = await pool.execute<ResultSetHeader>(sql,[user_public_id,review_public_id]);
        return result;
    },

    async fetchMovieName(search:string){
        const sql = `SELECT 
                    movie_public_id, title 
                    FROM movies
                    WHERE title LIKE ?`;
        console.log(search)
        const [rows] = await pool.execute<RowDataPacket[]>(sql,[`%${search}%`]);
        return rows;
    },

    async fetchMovieIdAndName(){
        const sql = `SELECT movie_public_id, title FROM movies`;
        const [rows] = await pool.execute<RowDataPacket[]>(sql);
        return rows;
    }
}

export default MovieModel;

