import express from "express";
import logger from "./utils/logger";
import { pinoHttp } from "pino-http";
import bodyParser from "body-parser";
import routes from "./routes";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(pinoHttp({ logger }));

app.use("/", routes);

app.set("port", process.env.PORT || 3000);

const server = app.listen(app.get("port"), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
