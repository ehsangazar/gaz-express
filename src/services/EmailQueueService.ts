import config from "../config/config";

interface Item {}

class EmailQueueService {
  private items: Item[];
  private callToFunction: (item: Item) => Promise<boolean>;
  public started: boolean = false;

  constructor({
    callToFunction,
  }: {
    callToFunction: (item: Item) => Promise<boolean>;
  }) {
    this.items = [];
    this.callToFunction = callToFunction;
  }
  push(item: Item) {
    this.items.push(item);
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
    }, config.DELAY_QUEUE_EMAIL);
  }

  private async processing() {
    if (this.start) {
      const item = this.items[0];
      if (!item) {
        this.loopProcessing();
        return;
      }
      const response = await this.callToFunction(item);
      if (response) this.shift();
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

export default EmailQueueService;
