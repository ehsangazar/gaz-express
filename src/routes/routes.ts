import express from "express";
import general from "./general/controller";
import mailScheduler from "./mail-scheduler/controller";
import { catchErrors } from "../utils/errorHandler";
import {
  startBackupScheduler,
  stopBackupScheduler,
  getBackupStatus,
  triggerManualBackup,
  addBackupEndpoint,
  removeBackupEndpoint,
  getBackupEndpoints,
} from "./backup/controller";

const routes = express.Router();

routes.get("/", catchErrors(general.main));

routes.post("/mail-scheduler", catchErrors(mailScheduler.postEvent));
routes.get("/mail-scheduler", catchErrors(mailScheduler.getEvent));

// Backup routes
routes.post("/backup/start", catchErrors(startBackupScheduler));
routes.post("/backup/stop", catchErrors(stopBackupScheduler));
routes.get("/backup/status", catchErrors(getBackupStatus));
routes.post("/backup/trigger", catchErrors(triggerManualBackup));
routes.post("/backup/endpoints", catchErrors(addBackupEndpoint));
routes.delete("/backup/endpoints/:url", catchErrors(removeBackupEndpoint));
routes.get("/backup/endpoints", catchErrors(getBackupEndpoints));

export default routes;
