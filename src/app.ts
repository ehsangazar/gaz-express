import express from "express";
import { createServer } from "node:http";
import logger from "./utils/logger";
import { pinoHttp } from "pino-http";
import bodyParser from "body-parser";
import routes from "./routes/routes";
import { receive } from "./routes/chat/controller";
import {
  developmentErrors,
  notFound,
  productionErrors,
} from "./utils/errorHandler";
import FlowManagerService from "./routes/mail-scheduler/services/FlowManagerService";
import flowMap from "./routes/mail-scheduler/config/flowMap";
import BackupSchedulerService from "./routes/backup/services/BackupSchedulerService";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import ChatQueueService from "./routes/chat/services/ChatQueueService";

dotenv.config();

const app = express();
const server = createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// MAIL SCHEDULER FLOW MANAGER
const mailSchedulerFlowManager = new FlowManagerService(flowMap);
mailSchedulerFlowManager.listen();

// BACKUP SCHEDULER
const backupScheduler = new BackupSchedulerService();
backupScheduler.start();

// SOCKET IO
const chatQueue = new ChatQueueService();
const io = new Server(server, {
  path: "/chat",
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.emit("chat:receive", chatQueue.getQueue());
  socket.on("chat:send", (data) => receive(io, socket, chatQueue, data));
});

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

server.listen(Number(process.env.PORT || 3000), "0.0.0.0", () => {
  logger.info(
    `Server is running on port http://${"0.0.0.0"}:${process.env.PORT}`
  );
});
