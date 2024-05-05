class ChatQueueService {
  private queue: any[];

  constructor() {
    this.queue = [];
  }

  public enqueue(item) {
    this.queue.push(item);
  }

  public dequeue() {
    return this.queue.shift();
  }

  public isEmpty() {
    return this.queue.length === 0;
  }

  public size() {
    return this.queue.length;
  }

  public clear() {
    this.queue = [];
  }

  public getQueue() {
    return this.queue;
  }
}

export default ChatQueueService;
