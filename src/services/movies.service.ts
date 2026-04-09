import { v4 as uuidv4 } from 'uuid';
import MovieModel from "../models/model.movies.js";
import type { CreateMovieInput } from "../schemas/movie/baseMovie.schema.js"
import type { updateMovieInput } from '../schemas/movie/updateMovie.schema.js';
import type { addLangugeInput } from "../schemas/movie/movieLanguage.schema.js";
import type { addCastInput } from "../schemas/movie/MovieCast.schema.js";
import type { addReviewInput } from "../schemas/review/schema.addReview.js";
import { uploadMoviePhoto } from "../config/uploadPhoto.js";

const MovieService = {

    async findAll(limit:number,offset:number){
        return await MovieModel.fetchAll(limit,offset);
    },

    async create(movie:CreateMovieInput, file: Express.Multer.File) {

            const movie_public_id = uuidv4();
            const posterUrl = await uploadMoviePhoto(file.buffer, "movies");
            movie.poster_url = posterUrl;
            const movieData = {movie_public_id,...movie};
            return await MovieModel.insert(movieData,movie_public_id);
    },

    async getActiveMovies(offset:number){
        return await MovieModel.fetchActiveMovies(offset);
    },

    async findOne(movie_public_id:string){
        return await MovieModel.fetchOne(movie_public_id);
    },

    async edit(movie_public_id:string,data:updateMovieInput,file?: Express.Multer.File){

        if (file) {
            const posterUrl = await uploadMoviePhoto(file.buffer, "movies");
            data.poster_url = posterUrl;
        }

        return await MovieModel.update(movie_public_id,data);
    },

    async remove(movie_public_id:string){
        return await MovieModel.deleteMovie(movie_public_id);
    },

    async getMovieLanguages(movie_public_id:string){
        return await MovieModel.fetchMovieLanguages(movie_public_id);
    },

    async addLanguages(movie_public_id:string,languages:addLangugeInput){
        return await MovieModel.addLanguages(movie_public_id,languages);
    },

    async removeLanguage(movie_public_id:string,language_id:string){
        return await MovieModel.deleteLanguage(movie_public_id,language_id);
    },

    async findCast(movie_public_id:string){
        return await MovieModel.fetchCast(movie_public_id);
    },

    async addCast(movie_public_id:string,cast:addCastInput){

        const cast_public_id = uuidv4();
        return await MovieModel.addCast(movie_public_id,{...cast,cast_public_id});
    },

    async removeCast(cast_id :string){
        return await MovieModel.deleteCast(cast_id);
    },

    async genres(){
        return await MovieModel.genres();
    },

    async movieGenres(movie_public_id:string){
        return await MovieModel.movieGenres(movie_public_id);
    },

    async addMovieGenres(movie_public_id: string, genre_id: number[]) {
        return await MovieModel.addMovieGenres(movie_public_id, genre_id);
    },

    async removeMovieGenre(movie_public_id: string, genre_id: number) {
        return await MovieModel.removeMovieGenre(movie_public_id, genre_id);
    },

    async getReviewsSummary(movie_public_id:string){
        return await MovieModel.fetchReviewsSummary(movie_public_id)
    },

    async addReview(review:addReviewInput,movie_public_id:string){

        return await MovieModel.insertReview({...review,review_public_id:uuidv4()},movie_public_id);
    },

    async getReviews(movie_public_id:string,offset:number){

        return await MovieModel.fetchReviews(movie_public_id,offset)
    },

    async removeReview(review_public_id:string,user_public_id:string){
        return await MovieModel.deleteReview(review_public_id,user_public_id);
    },

    async getMovieName(search:string){
        return await MovieModel.fetchMovieName(search);
    },

    async getMovieIdAndName(){
        return await MovieModel.fetchMovieIdAndName()
    }
}

export default MovieService;