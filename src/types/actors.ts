export interface Actor{
    artist_public_id:string,
    artist_name:string,
    artist_photo:string,
    artist_dob:Date,
    artist_country:string,
    artist_city:string
}

export type ActorUpdate = {
    artist_name?: string | undefined,
    artist_dob?: Date | undefined | string,
    artist_country?: string | undefined,
    artist_city?: string | undefined,
    artist_photo?:string | undefined
}
