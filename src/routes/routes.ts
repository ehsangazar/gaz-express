import express from "express";
import general from "./general/controller";
import mailScheduler from "./mail-scheduler/controller";
import { catchErrors } from "../utils/errorHandler";

const routes = express.Router();

routes.get("/", catchErrors(general.main));

routes.post("/mail-scheduler", catchErrors(mailScheduler.postEvent));
routes.get("/mail-scheduler", catchErrors(mailScheduler.getEvent));

export default routes;
