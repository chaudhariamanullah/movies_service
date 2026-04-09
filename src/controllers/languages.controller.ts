import languagesService from "../services/languages.service.js";
import type { Request, Response } from "express";
import { languageSchema } from "../schemas/languages/language.schema.js";
import { ZodError } from "zod";

const languagesController = {

    async findAll(req:Request, res:Response){
        try{
            const languages = await languagesService.findAll();
            res.status(200).json(languages);
        } catch(err){
            return res.status(500).json({error:err});
        }
    },

    async create(req:Request, res:Response){
        try{
            const language = languageSchema.parse(req.body);
            await languagesService.create(language);
            return res.status(201).json({message: `${language.language_name} Added`})
        }catch(err){

            if( err instanceof ZodError){
                return res.status(400).json({
                    message:"Zod Error",
                    error:err
                })
            }
            return res.status(500).json({error:err});
        }
    },

    async find(req:Request, res:Response){
        try{
            const language_id = Number(req.params.language_id);
            if (!language_id){
                return res.status(400).json({message:"Language Id Not Found!"});
            }

            if ( Number.isNaN(language_id)){
                return res.status(400).json({ error: "Invalid id" });
            }

            const language = await languagesService.find(language_id);
            return res.json(language);
        } catch(err){
            return res.status(500).json({error:"Internel Server Error"});
        }
    },

    async edit(req:Request, res:Response){
        try{
            const language = languageSchema.parse(req.body);
            const language_id = Number(req.params.language_id);

            if (!language_id){
                return res.status(400).json({message:"Language Id Not Found!"});
            }

            if ( Number.isNaN(language_id)){
                return res.status(400).json({ error: "Invalid id" });
            }

            await languagesService.edit(language_id,language);
            return res.status(200).json({message:`${language.language_name} Updated`});
        } catch(err){
            if( err instanceof ZodError){
                return res.status(400).json({
                    message:"Zod Error",
                    error:err
                })
            }
            return res.status(500).json({error:err});
        }
    },

    async remove(req:Request, res:Response){
         try{
            const language_id = Number(req.params.language_id);
            if (!language_id){
                return res.status(400).json({message:"Language Id Not Found!"});
            }

            if ( Number.isNaN(language_id)){
                return res.status(400).json({ error: "Invalid id" });
            }

            const language = await languagesService.remove(language_id);
            return res.status(200).json({message:`${language} removed`});
        } catch(err){
            return res.status(500).json({error:"Internel Server Error"});
        }
    }

}

export default languagesController;