import express from "express";
import logger from "./utils/logger";
import { pinoHttp } from "pino-http";
import bodyParser from "body-parser";
import routes from "./routes/routes";
import {
  developmentErrors,
  notFound,
  productionErrors,
} from "./utils/errorHandler";
import FlowManagerService from "./routes/mail-scheduler/services/FlowManagerService";
import flowMap from "./routes/mail-scheduler/config/flowMap";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config({ path: ".env" });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const mailSchedulerFlowManager = new FlowManagerService(flowMap);
mailSchedulerFlowManager.listen();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req: (req) =>
        JSON.stringify({
          id: req.id,
          method: req.method,
          url: req.url,
        }),
      res: (res) =>
        JSON.stringify({
          statusCode: res.statusCode,
        }),
    },
  })
);

app.use((req, res, next) => {
  req.logger = logger;
  req.mailSchedulerFlowManager = mailSchedulerFlowManager;
  next();
});

app.use("/", routes);
app.get("/favicon.ico", (req, res) => res.status(204));

if (app.get("env") === "development") {
  app.use(developmentErrors);
} else {
  app.use(productionErrors);
}

app.use(notFound);

app
  .listen(process.env.PORT || 3000, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:3000`);
  })
  .on("error", (e) => {
    console.log("Error happened: ", e.message);
  });
