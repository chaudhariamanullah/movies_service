import { z } from "zod";

export const addReviewSchema = z.object({
    user_name:z.string(),
    user_public_id:z.string(),
    comment:z.string(),
    rating:z.number().min(1).max(5)
}).strict();

export type addReviewInput = z.infer< typeof addReviewSchema >