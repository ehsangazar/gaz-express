import express from "express";
import logger from "./utils/logger";
import { pinoHttp } from "pino-http";
import bodyParser from "body-parser";
import routes from "./routes";
import {
  developmentErrors,
  notFound,
  productionErrors,
} from "./utils/errorHandler";
import FlowManagerService from "./services/FlowManagerService";
import flowMap from "./config/flowMap";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const flowManager = new FlowManagerService(flowMap);
flowManager.listen();
flowManager.start();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req: (req) => ({
        id: req.id,
        method: req.method,
        url: req.url,
      }),
      res: (res) => ({
        statusCode: res.statusCode,
      }),
    },
  })
);

app.use((req, res, next) => {
  req.logger = logger;
  req.flowManager = flowManager;
  next();
});

app.use("/", routes);

if (app.get("env") === "development") {
  app.use(developmentErrors);
} else {
  app.use(productionErrors);
}

app.use(notFound);

app.set("port", process.env.PORT || 3000);
const server = app.listen(app.get("port"), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
