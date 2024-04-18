import EventService from "./EventService";
import EmailQueueService from "./EmailQueueService";
import TaskQueueService from "./TaskQueueService";
import { IflowMap } from "../config/flowMap";
import EmailService from "./EmailService";

class FlowManagerService {
  public eventServiceObj: EventService;
  public emailServiceObj: EmailService;
  public emailQueueServiceObj: EmailQueueService;
  public taskQueueServiceObj: TaskQueueService;
  public flowMap: IflowMap;
  constructor(flowMap: IflowMap) {
    this.eventServiceObj = new EventService();
    this.emailServiceObj = new EmailService();
    this.emailQueueServiceObj = new EmailQueueService({
      callToFunction: this.sendEmail.bind(this),
    });
    this.taskQueueServiceObj = new TaskQueueService({
      callToFunction: this.pushToEmailQueueService.bind(this),
    });
    this.flowMap = flowMap;
  }

  async sendEmail(item) {
    const response = await this.emailServiceObj.sendEmail(item);
    if (response && item.after?.length) {
      item.after.map((singleEvent) => {
        this.emit(singleEvent, item.userEmail);
      });
    }
    return response;
  }

  pushToEmailQueueService(item) {
    this.emailQueueServiceObj.push(item);
  }

  emit(eventName: string, userEmail: string) {
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
      time += when.hours * 60 * 60 * 1000;
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
              executionTimestamp: this.whenCalculator(flow.when),
              ...flow,
            });
            break;
          case "now":
            this.emailQueueServiceObj.push({
              userEmail,
              ...flow,
            });
            break;
        }
      });
    });
  }

  start() {
    this.emailQueueServiceObj.start();
    this.taskQueueServiceObj.start();
  }
}

export default FlowManagerService;
