export interface InputCast {
    cast_public_id:string,
    artist_public_id:string,
     job: 'actor' | 'writer' | 'producer' | 'crew' | 'director';
    character_name?:string | undefined
}