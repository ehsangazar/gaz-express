import EventService from "./EventService";
import EmailQueueService from "./EmailQueueService";
import TaskQueueService from "./TaskQueueService";
import { IflowMap } from "../config/flowMap";

class FlowManagerService {
  private eventServiceObj;
  private emailQueueServiceObj;
  private taskQueueServiceObj;
  private flowMap: IflowMap;
  constructor(
    eventServiceObj: EventService,
    emailQueueServiceObj: EmailQueueService,
    taskQueueServiceObj: TaskQueueService,
    flowMap
  ) {
    this.eventServiceObj = eventServiceObj;
    this.emailQueueServiceObj = emailQueueServiceObj;
    this.taskQueueServiceObj = taskQueueServiceObj;
    this.flowMap = flowMap;
  }

  emit(eventName, userEmail) {
    this.eventServiceObj.emit(eventName, userEmail);
  }

  public whenCalculator(when) {
    let time = Date.now();
    if (when.seconds) {
      time += when.seconds * 1000;
    }
    if (when.minutes) {
      time += when.minutes * 60 * 1000;
    }
    if (when.hours) {
      time += when.minutes * 60 * 60 * 1000;
    }
    return time;
  }

  listen() {
    Object.keys(this.flowMap).map((eventName) => {
      const flow = this.flowMap[eventName];
      this.eventServiceObj.on(eventName, (userEmail) => {
        switch (flow.type) {
          case "scheduled":
            this.taskQueueServiceObj.push({
              userEmail,
              subject: flow.subject,
              body: flow.body,
              executionTimestamp: this.whenCalculator(flow.when),
            });
            break;
          case "now":
            this.emailQueueServiceObj.push({
              userEmail,
              subject: flow.subject,
              body: flow.body,
            });
            break;
        }

        if (flow.after) {
          flow.after.map((afterEventName) => {
            this.emit(afterEventName, userEmail);
          });
        }
      });
    });
  }
}

export default FlowManagerService;
