import EmailQueueService from "../EmailQueueService";

describe("EmailQueueService", () => {
  let emailQueueServiceObj: EmailQueueService;
  beforeEach(() => {
    emailQueueServiceObj = new EmailQueueService();
  });
  it("should be a function", () => {
    expect(typeof EmailQueueService).toBe("function");
  });
  it("should be a function", () => {
    expect(typeof emailQueueServiceObj.enqueue).toBe("function");
    expect(typeof emailQueueServiceObj.dequeue).toBe("function");
    expect(typeof emailQueueServiceObj.isEmpty).toBe("function");
    expect(typeof emailQueueServiceObj.size).toBe("function");
    expect(typeof emailQueueServiceObj.clear).toBe("function");
  });

  it("should be able to push", () => {
    emailQueueServiceObj.enqueue(1);
    expect(emailQueueServiceObj.size()).toBe(1);
  });

  it("should shift the first item", () => {
    emailQueueServiceObj.enqueue(10);
    emailQueueServiceObj.enqueue(1);
    expect(emailQueueServiceObj.dequeue()).toBe(10);
  });

  it("should return undefined if queue is empty", () => {
    expect(emailQueueServiceObj.dequeue()).toBe(undefined);
  });

  it("should clear the queue", () => {
    emailQueueServiceObj.enqueue(10);
    emailQueueServiceObj.enqueue(1);
    emailQueueServiceObj.clear();
    expect(emailQueueServiceObj.size()).toBe(0);
  });
});
