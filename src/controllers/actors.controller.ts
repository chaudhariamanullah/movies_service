import type {Request, Response} from "express";
import actorService from "../services/actors.service.js";
import { createActorSchema } from "../schemas/actors/inputActor.schema.js";
import { editActorSchema } from "../schemas/actors/editActor.schema.js";

import { ZodError } from "zod";

const actorController = {
    
    async find(req: Request, res: Response) {
        try{
            const actor_public_id = req.params.actor_public_id;
            
            if(!actor_public_id){
                return res.status(400).json({error:"Actor Id Not Found!"})
            }

            const actorDetails = await actorService.find(actor_public_id);
            if (!actorDetails){
                return res.status(404).json({message:"Actor Not Found"})
            } else {
                return res.status(200).json(actorDetails);
            }
        } catch(err){
            return res.status(500).json({error:err});
        }
    },

    async findNameAndId(req: Request, res: Response){
        try{
            const artist = await actorService.findNameAndId();
            return res.status(200).json(artist);
        } catch(err){
            return res.status(500).json({error:err});
        }
    },

    async findAll(req: Request, res: Response){

        try{

            const limit = parseInt(req.query.limit as string) || 10;
            const offset = parseInt(req.query.offset as string) || 0;

            const artists = await actorService.findAll(limit,offset);
            return res.status(200).json(artists);
        }catch(err){
            return res.status(500).json({error:err});
        }

    },

    async create(req: Request, res: Response) {
        try{
            const actorData = createActorSchema.parse(req.body);

            if(!req.file)
                return res.status(400).json({message:"Actor Profile Missing"});

            await actorService.create(actorData,req.file);
            res.status(201).json({message:"Actor Added Succesfully"});
        } catch (err){

            if ( err instanceof ZodError ){
                return res.status(400).json({zodError:err});
            }
            return res.status(500).json({error:err});
        }
    },

    async edit(req: Request, res: Response) {
        try{
            const actor_public_id = req.params.actor_public_id;

            if (!actor_public_id){
                return res.status(400).json({message:"Actor Id Is Required"});
            }

            const actorData = editActorSchema.parse(req.body);
            await actorService.edit(actorData,actor_public_id,req.file);
            return res.status(200).json({message:`Actor With ${actor_public_id} Is Updated`})
            
        } catch(err){

            if ( err instanceof ZodError ){
                return res.status(400).json({zodError:err});
            }
            return res.status(500).json({error:err});
        }
    },
    async remove(req: Request, res: Response) {
        try{
            const actor_public_id = req.params.actor_public_id;

            if (!actor_public_id){
                return res.status(400).json({message:"Actor ID Is Required"});
            }
            await actorService.remove(actor_public_id);
            res.status(200).json({message: `Actor With ${actor_public_id} Is Deleted`})
        } catch(err){
            res.status(500).json({error:err});
        }
    }
}

export default actorController;