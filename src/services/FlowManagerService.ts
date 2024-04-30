import EventService from "./EventService";
import EmailQueueService from "./EmailQueueService";
import TaskQueueService from "./TaskQueueService";
import { IflowMap } from "../config/flowMap";
import EmailService from "./EmailService";
import config from "../config/config";

class FlowManagerService {
  public eventServiceObj: EventService;
  public emailServiceObj: EmailService;
  public emailQueueServiceObj: EmailQueueService;
  public taskQueueServiceObj: TaskQueueService;
  private flowMap: IflowMap;
  private startedEmailQueueService: boolean = false;
  private startedTaskQueueService: boolean = false;

  constructor(flowMap: IflowMap) {
    this.eventServiceObj = new EventService();
    this.emailServiceObj = new EmailService();
    this.emailQueueServiceObj = new EmailQueueService();
    this.taskQueueServiceObj = new TaskQueueService();
    this.flowMap = flowMap;
  }

  emit(eventName: string, userEmail: string) {
    this.eventServiceObj.emit(eventName, userEmail);
  }

  whenCalculator(when) {
    const now = Date.now();
    if (!when) return now;
    return (
      now +
      (when.seconds || 0) * 1000 +
      (when.minutes || 0) * 60 * 1000 +
      (when.hours || 0) * 60 * 60 * 1000
    );
  }

  async processEmailQueue() {
    this.startedEmailQueueService = true;
    while (this.startedEmailQueueService) {
      if (!this.emailQueueServiceObj.isEmpty()) {
        const item = this.emailQueueServiceObj.dequeue();
        const reponse = await this.emailServiceObj.sendEmail(item);
        if (reponse) {
          item.next?.map((next) => {
            this.emit(next, item.userEmail);
          });
        } else {
          if (item.retry && item.retry >= config.RETRY) return;
          this.emailQueueServiceObj.enqueue({
            ...item,
            retry: item.retry ? item.retry + 1 : 1,
          });
        }
      }
      await new Promise((resolve) =>
        setTimeout(resolve, config.DELAY_QUEUE_EMAIL)
      );
    }
  }

  async processTaskQueue() {
    this.startedTaskQueueService = true;
    while (this.startedTaskQueueService) {
      if (!this.taskQueueServiceObj.isEmpty()) {
        const item = this.taskQueueServiceObj.peek();
        if (item && item.executionTime < new Date().getTime()) {
          this.taskQueueServiceObj.extractMin();
          this.emailQueueServiceObj.enqueue(item.data);
        }
      }
      await new Promise((resolve) =>
        setTimeout(resolve, config.DELAY_QUEUE_TASK)
      );
    }
  }

  listen() {
    Object.keys(this.flowMap).map((eventName) => {
      const flow = this.flowMap[eventName];
      this.eventServiceObj.on(eventName, (userEmail) => {
        const executionTime = this.whenCalculator(flow.when);
        this.taskQueueServiceObj.insert({
          executionTime,
          data: {
            userEmail,
            ...flow,
          },
        });
      });
    });
    this.processEmailQueue();
    this.processTaskQueue();
  }

  stopEmailQueueService() {
    this.startedEmailQueueService = false;
  }

  stopTaskQueueService() {
    this.startedTaskQueueService = false;
  }

  stop() {
    this.stopEmailQueueService();
    this.stopTaskQueueService();
  }

  startProcessEmailQueue() {
    this.processEmailQueue();
  }

  startProcessTaskQueue() {
    this.processTaskQueue();
  }
}

export default FlowManagerService;
