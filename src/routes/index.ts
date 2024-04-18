import express from "express";
import controller from "./controller";
import { catchErrors } from "../utils/errorHandler";

const routes = express.Router();

routes.get("/", catchErrors(controller));
routes.post("/event", catchErrors(controller));

export default routes;
