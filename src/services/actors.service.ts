import { v4 as uuidv4 } from 'uuid';
import type { createActorInput } from "../schemas/actors/inputActor.schema.js";
import type { editActorInput } from "../schemas/actors/editActor.schema.js";
import { uploadActorPhoto } from "../config/uploadPhoto.js";
import actorModel from "../models/model.actors.js";

const actorService = {
    
    async find(artist_public_id:string){
        return await actorModel.find(artist_public_id);
    },

    async findNameAndId(){
        return await actorModel.fetchNameAndId();
    },

    async findAll(limit:number,offset:number){
        return await actorModel.fetchAll(limit,offset);
    },

    async create(actorData:createActorInput, file:Express.Multer.File){
        
        const artist_public_id = uuidv4();
        const profileUrl = await uploadActorPhoto(file.buffer, "artist");
        const actorFullData = {
            artist_public_id,
            artist_name: actorData.artist_name,
            artist_photo:profileUrl,
            artist_dob: actorData.artist_dob,
            artist_country: actorData.artist_country,
            artist_city: actorData.artist_city
        };
        return await actorModel.create(actorFullData);
    },

    async edit(actorData:editActorInput,artist_public_id:string,file?:Express.Multer.File){

        let profileUrl = "";

        if(file) {
            profileUrl = await uploadActorPhoto(file.buffer, "artist");
        }

        if(profileUrl)
            return await actorModel.update({...actorData,artist_photo:profileUrl},artist_public_id);
        else
            return await actorModel.update(actorData,artist_public_id);
    },
    async remove(artist_public_id:string){
        return await actorModel.delete(artist_public_id);
    },
}

export default actorService;