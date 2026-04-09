import { Router } from "express";
import languagesController from "../controllers/languages.controller.js";

const route = Router();

route.get("/",languagesController.findAll);
route.post("/",languagesController.create);
route.get("/:language_id",languagesController.find);
route.patch("/:language_id",languagesController.edit);
route.delete("/:language_id",languagesController.remove)

export default route;