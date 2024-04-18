import QueueService from "../QueueService";

describe("QueueService", () => {
  it("should be a function", () => {
    expect(typeof QueueService).toBe("function");
  });
  it("should be a function", () => {
    const QueueServiceObj = new QueueService();
    expect(typeof QueueServiceObj.add).toBe("function");
    expect(typeof QueueServiceObj.shift).toBe("function");
    expect(typeof QueueServiceObj.list).toBe("function");
  });

  it("should be able to add", () => {
    const queueServiceObj = new QueueService();
    queueServiceObj.add({
      executionTimestamp: 1,
    });
    expect(queueServiceObj.list().length).toBe(1);
  });

  it("should sort the queue", () => {
    const queueServiceObj = new QueueService();
    queueServiceObj.add({
      executionTimestamp: 10,
    });
    queueServiceObj.add({
      executionTimestamp: 1,
    });
    expect(queueServiceObj.shift().executionTimestamp).toBe(1);
  });
});
