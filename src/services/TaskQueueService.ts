import config from "../config/config";
import EmailQueueService from "./EmailQueueService";

interface Item {
  executionTimestamp: number;
  userEmail: string;
  subject?: string;
  body: string;
}

class TaskQueueService {
  private items: Item[];
  public started: boolean = false;
  private emailQueueServiceObj: EmailQueueService;

  constructor(emailQueueServiceObj) {
    this.items = [];
    this.emailQueueServiceObj = emailQueueServiceObj;
  }
  push(item: Item) {
    this.items.push(item);
    this.items = this.items.sort((a, b) => {
      return a.executionTimestamp - b.executionTimestamp;
    });
  }

  shift() {
    return this.items.shift();
  }

  list() {
    return this.items;
  }

  private loopProcessing() {
    setTimeout(() => {
      this.processing();
    }, config.DELAY_QUEUE_TASK);
  }

  private async processing() {
    if (this.start) {
      const item = this.items[0];
      if (!item) {
        this.loopProcessing();
        return;
      }
      if (item.executionTimestamp > Date.now()) {
        this.loopProcessing();
        return;
      }
      await this.emailQueueServiceObj.push(item);
      this.shift();
      this.loopProcessing();
    }
  }

  start() {
    this.started = true;
    this.processing();
  }

  stop() {
    this.started = false;
  }
}

export default TaskQueueService;
