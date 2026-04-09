import pool from "../config/db.js";
import type { RowDataPacket } from "mysql2";
import type { Actor, ActorUpdate } from "../types/actors.js";

const actorModel = {
    async find(actor_public_id:string){
        const sql = "SELECT artist_name, artist_photo, artist_dob, artist_country, artist_city FROM artists where artist_public_id = ?";
        const [rows] = await pool.execute<RowDataPacket[]>(sql,[actor_public_id]);
        return rows[0] ?? null;
    },

    async fetchNameAndId (){
        const sql = "SELECT artist_public_id, artist_name FROM artists";
        const [rows] = await pool.execute<RowDataPacket[]>(sql);
        return rows ?? null
    },

    async fetchAll(limit:number,offset:number){
        const sql = `SELECT 
                    artist_public_id, artist_name FROM artists
                    LIMIT ${limit} OFFSET ${offset}`;
        const [rows] = await pool.execute<RowDataPacket[]>(sql);
        return rows ?? null;
    },

    async create(actorData:Actor){
        const sql = "INSERT INTO artists(artist_public_id, artist_name, artist_photo, artist_dob, artist_country, artist_city) VALUES(?,?,?,?,?,?)";
        return await pool.execute(
            sql,[
                actorData.artist_public_id,
                actorData.artist_name,
                actorData.artist_photo,
                actorData.artist_dob,
                actorData.artist_country,
                actorData.artist_city]);
    },

    async update(actorData:ActorUpdate, actor_public_id:string){
        const keys = Object.keys(actorData);
        const fields = keys.map(k => `${k} = ?`).join(", ");
        const values = keys.map(k => (actorData as any)[k]);

        const sql = `UPDATE artists SET ${fields} WHERE artist_public_id = ?`;
        return await pool.execute(sql,[...values,actor_public_id])
    },
    
    async delete(actor_public_id:string){
        const sql = "DELETE FROM artists WHERE artist_public_id = ?";
        return await pool.execute(sql,[actor_public_id]);
    }
}

export default actorModel;
