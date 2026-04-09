import type { languageInput } from "../schemas/languages/language.schema.js";
import languagesModel from "../models/model.languages.js";

const languagesService = {
    async findAll(){
        return await languagesModel.findAll();
    },

    async create(language:languageInput){
        return await languagesModel.create(language);
    },

    async find(language_id:number){
        return await languagesModel.findOne(language_id);
    },

    async edit(language_id:Number,language:languageInput){
        return await languagesModel.update(language_id,language);
    },

    async remove(language_id:Number){
        return await languagesModel.delete(language_id);
    }
}

export default languagesService;