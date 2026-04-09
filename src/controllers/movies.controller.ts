import type { Request, Response } from "express"
import MovieService from "../services/movies.service.js";
import { createMovieSchema } from '../schemas/movie/baseMovie.schema.js';
import { updateMovieSchema } from '../schemas/movie/updateMovie.schema.js';
import { addLanguageSchema } from "../schemas/movie/movieLanguage.schema.js";
import { addCastSchema } from "../schemas/movie/MovieCast.schema.js";
import { addReviewSchema } from "../schemas/review/schema.addReview.js";
import { ZodError } from "zod";

const MovieController = {
    
    async findAll(req: Request, res: Response) {
        try{
            const limit = parseInt(req.query.limit as string) || 10;
            const offset = parseInt(req.query.offset as string) || 0;
            const movies = await MovieService.findAll(limit,offset);
            return res.status(200).json(movies);
        } catch(err){
            return res.status(500).json({error:err});
        }    
    },

    async  create(req: Request, res: Response) {
        try{

            const data = createMovieSchema.parse(req.body);
            
            if(!req.file)
                return res.status(400).json({message:"Movie Poster Missing"});

            const movie_public_id = await MovieService.create(data,req.file);
            res.status(201).json(movie_public_id);
            
            } catch(err:any){
                console.log(err.message)
                res.status(500).json({error:err});
        }
    },

    async getActiveMovies(req: Request, res: Response){
        try{
            const offset = Number(req.query.offset as string) || 0;
            const movies = await MovieService.getActiveMovies(offset);
            return res.status(200).json(movies);
        } catch(err:any){
            console.log(err.message);
            return res.status(500).json({error:err})
        }      
    },

    async findOne(req: Request, res: Response){
        try{
            const movie_public_id = req.params.movie_public_id;

            if(!movie_public_id){
                return res.status(400).json({error:"Movie Id Is Required!"})
            }

            
            const movie = await MovieService.findOne(movie_public_id);

            if(!movie){
                res.status(400).json({error:`No Movie With ID ${movie_public_id}`});
            } else {
                res.status(201).json(movie)
            }
                
            }catch(err){
                res.status(500).json({error:err});
        }
    },

    async edit(req: Request, res: Response) {
        try {
            const movie_public_id = req.params.movie_public_id;

            if (!movie_public_id) {
            return res.status(400).json({ error: "Movie ID Is Required!" });
            }

            const data = updateMovieSchema.parse(req.body);

            await MovieService.edit(movie_public_id, data, req.file);

            res.status(200).json({ success: "Movie Updated Successfully" });
        } catch (err:any) {
            console.log(err);
            console.log(err.message)
            res.status(500).json({ error: err });
        }
    },
        
    async remove(req:Request, res:Response){
        try{
            const movie_public_id = req.params.movie_public_id as string;
            if(!movie_public_id){
                return res.status(400).json({message:"Movie Id Is Required"});
            }

            await MovieService.remove(movie_public_id);
            res.status(200).json({message:`Movie ${movie_public_id} Is Removed Succesfully`});
            } catch(err){
                res.status(500).json({error:err});
        }
    },

    async getMovieLanguages(req:Request, res:Response){
        try{
            const movie_public_id = req.params.movie_public_id;

            if(!movie_public_id){
                return res.status(400).json({message:"Movie Id Not Found"});
            }
            const languages = await MovieService.getMovieLanguages(movie_public_id);
            return res.status(200).json(languages);
        } catch(err){
            return res.status(500).json({error:err});
        }
    },

    async addLanguages(req:Request, res:Response){
        try{
            const languages =  addLanguageSchema.parse(req.body);
            const movie_public_id = req.params.movie_public_id;

            console.log(languages)
            if (!movie_public_id){
                return res.status(400).json({message:"Movie Id Is Required"});
            }
            await MovieService.addLanguages(movie_public_id,languages);
            res.status(201).json({message:"Languages Added"});
        }catch(err){

            if( err instanceof ZodError){
                return res.status(500).json({error:"Error In Json Schema"});
            }
            return res.status(500).json({error:err});
        }
    },

    async removeLanguage(req:Request, res:Response){
        try{
            const language_id = req.params.language_id;
            const movie_public_id = req.params.movie_public_id;

            if (!language_id || !movie_public_id){
                return res.status(400).json({message:"Both Language And Movie Id Is Required"});
            }

            await MovieService.removeLanguage(language_id,movie_public_id);
            return res.status(500).json({message:`${language_id} Is Deleted From ${movie_public_id}`});

        } catch(err){
            return res.status(500).json({error:err});
        }
    },

    async findCast(req:Request, res:Response){
        try{
            const movie_public_id = req.params.movie_public_id;
            if(!movie_public_id){
                return res.status(400).json({message:"Movie Id Not Found"});
            }

            const cast = await MovieService.findCast(movie_public_id);
            return res.status(200).json(cast);

        } catch( err ){
            return res.status(500).json({error:err});
        }
    },

    async addCast(req:Request, res:Response){
        try{
            
            const castList = addCastSchema.parse(req.body);
            const movie_public_id = req.params.movie_public_id;
            
            if(!movie_public_id){
                return res.status(400).json({message:"Movie Id Not Found"});
            }

            const insert = await MovieService.addCast(movie_public_id,castList);

            if(!insert)
                return res.status(400).json({message:"Cast Can't Be Added"});
            
            return res.status(201).json({message:"Cast Added"});

        } catch (err: any) {
            console.log(err);
            res.status(400).json({
                message: "Cast Can't Be Added",
                error: err.message
            });
        }
    },

    async removeCast(req:Request, res:Response){
        try{
            const movie_public_id = req.params.movie_public_id;
            const cast_public_id = req.params.cast_public_id;

            if ( !movie_public_id || !cast_public_id){
                return res.status(400).json({message:"Cast Id Or Movie Id Is Missing"});
            }

            await MovieService.removeCast(cast_public_id);
            return res.status(200).json({message:`Cast With Id ${cast_public_id} Is Removed`});

        } catch( err ){
            return res.status(500).json({error:err});
        }

    },

    async genres(req:Request, res:Response){
        try{
            const genres = await MovieService.genres();
            return res.status(200).json(genres);
        } catch(err){
            return res.status(500).json({error:err});
        }

    },

    async movieGenres(req:Request, res:Response){
        try{

            const movie_public_id = req.params.movie_public_id;
           
            if ( !movie_public_id ){
                return res.status(400).json({message:"Cast Id Or Movie Id Is Missing"});
            }

            const movieGenres = await MovieService.movieGenres(movie_public_id);
            return res.status(200).json(movieGenres);
        } catch(err){
            return res.status(500).json({error:err});
        }
    },

    async addMovieGenre(req: Request, res: Response) {

        try {
            const movie_public_id = req.params.movie_public_id;
            const genre_ids = req.body.genreIds;

            if (!movie_public_id || !Array.isArray(genre_ids)) {
            return res.status(400).json({ error: "Movie ID and genre_ids array required" });
            }

            const ids = genre_ids.map((id: any) => Number(id));

            await MovieService.addMovieGenres(movie_public_id, ids);

            res.status(201).json({ message: "Genres updated for movie" });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    },

    async removeMovieGenre(req: Request, res: Response) {
        try {
            const movie_public_id = req.params.movie_public_id;
            const { genre_id } = req.body;

            if (!movie_public_id || !genre_id) {
                return res.status(400).json({ error: "Movie ID and Genre ID required" });
            }

            await MovieService.removeMovieGenre(movie_public_id, Number(genre_id));

            res.status(200).json({ message: "Genre removed from movie" });
        } catch (err) {
            res.status(500).json({ error: err });
        }
    },

    async addReview(req: Request, res: Response){
        try{

            const movie_public_id = req.params.movie_public_id;
            const review = addReviewSchema.parse(req.body);

            if (!movie_public_id) {
                return res.status(400).json({ error: "IDs Missing" });
            }

            await MovieService.addReview(review,movie_public_id);
            return res.status(201).json({message:"Comment Added"});
        } catch(err:any) {
            console.log(err.message+"11");
            res.status(500).json({ error: err });
        }
    },

    async getReview(req: Request, res: Response){
        try{

            const movie_public_id = req.params.movie_public_id;
            const offset = Number(req.query.offset as string) || 0;

            if (!movie_public_id) {
                return res.status(400).json({ error: "IDs Missing" });
            }

            const reviews = await MovieService.getReviews(movie_public_id,offset);
            return res.status(200).json(reviews);
        }catch(err:any){

            console.log(err.message);
            res.status(500).json({ error: err });
        }
    },

    async removeReview(req: Request, res: Response){
        try{
            const { user_public_id,review_public_id} = req.params;

            if (!review_public_id || !user_public_id) {
                return res.status(400).json({ error: "IDs Missing" });
            }

            await MovieService.removeReview(review_public_id,user_public_id);
            return res.status(200).json({message:"Comment Deleted"});
        }catch(err:any){

            console.log(err.message);
            res.status(500).json({ error: err });
        }
    },

    async getReviewsSummary(req: Request, res: Response){

        try{
            const movie_public_id = req.params.movie_public_id;

            if (!movie_public_id) {
                return res.status(400).json({ error: "IDs Missing" });
            }

            const rating =  await MovieService.getReviewsSummary(movie_public_id);
            return res.status(200).json(rating);
        } catch(err:any){
            console.log(err.message)
            res.status(500).json({ error: err });
        }  
    },
    async getMovieName(req: Request, res: Response){

        try{

            const search = req.query.search as string;

            if(!search)
                return res.json({message:"Empty Query"});

            const movies = await MovieService.getMovieName(search);
            return res.status(200).json(movies);

        } catch(err:any){

            console.log(err.message)
            res.status(500).json({ error: err });
        }
    },

    async getMovieIdAndName(req: Request, res: Response){

        try{
            const movieIdsAndName = await MovieService.getMovieIdAndName()
            return res.status(200).json(movieIdsAndName)
        }catch(err){
            return res.status(500).json({message:err});
        }
        
    }

}

export default MovieController;