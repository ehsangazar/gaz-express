import express from "express";
import controller from "./controller";
import { catchErrors } from "../utils/errorHandler";

const routes = express.Router();

routes.get("/", catchErrors(controller.main));
routes.post("/event", catchErrors(controller.event));

export default routes;
