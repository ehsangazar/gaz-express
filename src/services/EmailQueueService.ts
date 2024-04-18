interface Item {}

class EmailQueueService {
  private items: Item[];
  constructor() {
    this.items = [];
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
}

export default EmailQueueService;
