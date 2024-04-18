import EmailService from "./EmailService";

interface Item {}

class EmailQueueService {
  private items: Item[];
  private emailServiceObj: EmailService;
  public started: boolean = false;

  constructor(emailServiceObj: EmailService) {
    this.items = [];
    this.emailServiceObj = emailServiceObj;
  }
  add(item: Item) {
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
    }, 2000);
  }

  private async processing() {
    if (this.start) {
      const item = this.items[0];
      if (!item) {
        this.loopProcessing();
        return;
      }
      const response = await this.emailServiceObj.sendEmail(item);
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
