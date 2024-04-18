interface Item {
  executionTimestamp: number;
}

class QueueService {
  private items: Item[];
  constructor() {
    this.items = [];
  }
  add(item: Item) {
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
}

export default QueueService;
