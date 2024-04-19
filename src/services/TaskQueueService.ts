import config from "../config/config";
import { IflowMap } from "../config/flowMap";

interface Item {
  userEmail: string;
  executionTimestamp: number;
}

class TaskQueueService {
  private items: Item[];
  public started: boolean = false;
  private callToFunction: (item: Item) => void;

  constructor({ callToFunction }: { callToFunction: (item: Item) => void }) {
    this.items = [];
    this.callToFunction = callToFunction;
  }

  push(item: Item) {
    let low = 0;
    let high = this.items.length;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (this.items[mid].executionTimestamp < item.executionTimestamp) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    this.items.splice(low, 0, item);
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
      await this.callToFunction(item);
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
