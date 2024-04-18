import EventService from "./services/EventService";
import EmailService from "./services/EmailService";
import EmailQueueService from "./services/EmailQueueService";
import FlowManagerService from "./services/FlowManagerService";
import TaskQueueService from "./services/TaskQueueService";
import flowMap from "./config/flowMap";

const eventServiceObj = new EventService();
const emailServiceObj = new EmailService();
const emailQueueServiceObj = new EmailQueueService({
  callToFunction: emailServiceObj.sendEmail,
});
const taskQueueServiceObj = new TaskQueueService({
  callToFunction: emailQueueServiceObj.push,
});

const flowServiceObj = new FlowManagerService(
  eventServiceObj,
  emailQueueServiceObj,
  taskQueueServiceObj,
  flowMap
);

flowServiceObj.listen();
emailQueueServiceObj.start();
taskQueueServiceObj.start();

flowServiceObj.emit("websiteSignup", "me@gazar.dev");
flowServiceObj.emit("socksPurchased", "me@gazar.dev");
