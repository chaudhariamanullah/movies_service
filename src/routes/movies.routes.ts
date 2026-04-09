import { Router } from "express"
import MovieController from "../controllers/movies.controller.js";
import { upload } from "../config/multer.js";

const router = Router();

router.get("/", MovieController.findAll);
router.get("/list",MovieController.getMovieIdAndName);
router.post("/",upload.single("poster"), MovieController.create);
router.get("/search",MovieController.getMovieName);
router.get("/movie/reccomendations",MovieController.getActiveMovies);
router.get("/review/rating/:movie_public_id",MovieController.getReviewsSummary);
router.post("/review/:movie_public_id",MovieController.addReview);
router.get("/review/:movie_public_id",MovieController.getReview);
router.get("/:movie_public_id", MovieController.findOne);

router.patch("/:movie_public_id",upload.single("poster"),MovieController.edit);

router.delete("/review/:review_public_id/:user_public_id",MovieController.removeReview)
router.delete("/:movie_public_id", MovieController.remove);

router.get("/:movie_public_id/languages", MovieController.getMovieLanguages);
router.post("/:movie_public_id/languages", MovieController.addLanguages);
router.delete("/:movie_public_id/languages/:language_id",MovieController.removeLanguage);

router.get("/:movie_public_id/casts",MovieController.findCast);
router.post("/:movie_public_id/casts",MovieController.addCast);
router.delete("/:movie_public_id/casts/:cast_public_id",MovieController.removeCast);

router.get("/genre/list",MovieController.genres);
router.get("/genre/:movie_public_id", MovieController.movieGenres);
router.post("/:movie_public_id/genre", MovieController.addMovieGenre);
router.delete("/:movie_public_id/genre", MovieController.removeMovieGenre);

export default router;