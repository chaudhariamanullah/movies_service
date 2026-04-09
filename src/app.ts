import express from "express"
import movieRoutes from "./routes/movies.routes.js"
import actorRoutes from "./routes/actors.route.js";
import languageRoutes from "./routes/language.route.js";
import cors from "cors";

const app = express()

app.use(express.json({ type: "application/json" }));
app.use(express.urlencoded({ extended: true }));

app.use( cors({
    origin:"http://localhost:5173"
}));

app.use("/movies", movieRoutes);
app.use("/artists", actorRoutes);
app.use("/languages", languageRoutes)

export default app
