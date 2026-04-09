import { Router } from "express";
import  actorController  from "../controllers/actors.controller.js"
import { upload } from "../config/multer.js";

const router = Router();

router.get("/fetch/name-id", actorController.findNameAndId);
router.get("/:actor_public_id", actorController.find);
router.get("/", actorController.findAll);
router.post("/",upload.single("artist_photo"),actorController.create);
router.patch("/:actor_public_id",upload.single("artist_photo"), actorController.edit);
router.delete("/:actor_public_id", actorController.remove);

export default router