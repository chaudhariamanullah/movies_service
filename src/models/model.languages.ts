import pool from "../config/db.js";
import type { Languages } from "../types/languages.js";
import type { RowDataPacket } from "mysql2";

const languagesModel = {
    async findAll(){
        const sql = "SELECT * FROM languages";
        const [rows] = await pool.execute(sql);
        return rows;
    },

    async create(language:Omit<Languages,"language_id">){
        const sql = "INSERT INTO languages(language_name) VALUE(?)";
        return await pool.execute(sql,[language.language_name]);
    },

    async findOne(language_id:Number){
        const sql = "SELECT language_name FROM languages WHERE language_id = ?";
        const rows = await pool.execute<RowDataPacket[]>(sql,[language_id]);
        return rows[0] ?? null;
    },

    async update(language_id:Number, language: Omit<Languages,"language_id">){
        const sql = "UPDATE languages SET language_name = ? WHERE language_id = ?";
        return await pool.execute(sql,[language.language_name,language_id]);
    },

    async delete(language_id:Number){
        //No need to delete imo
    }
}   

export default languagesModel;