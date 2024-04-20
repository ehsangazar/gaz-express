import TaskQueueService from "../TaskQueueService";

describe("TaskQueueService", () => {
  it("should be a function", () => {
    expect(typeof TaskQueueService).toBe("function");
  });
  it("should be a function", () => {
    const taskQueueServiceObj = new TaskQueueService();
    expect(typeof taskQueueServiceObj.enqueue).toBe("function");
    expect(typeof taskQueueServiceObj.dequeue).toBe("function");
    expect(typeof taskQueueServiceObj.size).toBe("function");
  });

  it("should be able to enqueue", () => {
    const taskQueueServiceObj = new TaskQueueService();
    taskQueueServiceObj.enqueue({
      executionTime: 1,
      data: {
        userEmail: "me@gazar.dev",
      },
    });
    expect(taskQueueServiceObj.size()).toBe(1);
  });

  it("should sort the queue", () => {
    const taskQueueServiceObj = new TaskQueueService();
    taskQueueServiceObj.enqueue({
      executionTime: 10,
      data: {
        userEmail: "me@gazar.dev",
      },
    });
    taskQueueServiceObj.enqueue({
      executionTime: 1,
      data: {
        userEmail: "me@gazar.dev",
      },
    });
    taskQueueServiceObj.enqueue({
      executionTime: 4,
      data: {
        userEmail: "me@gazar.dev",
      },
    });
    expect(taskQueueServiceObj.dequeue().executionTime).toBe(1);
    expect(taskQueueServiceObj.dequeue().executionTime).toBe(4);
    expect(taskQueueServiceObj.dequeue().executionTime).toBe(10);
  });

  it("should return undefined if queue is empty", () => {
    const taskQueueServiceObj = new TaskQueueService();
    expect(taskQueueServiceObj.dequeue()).toBe(undefined);
  });

  it("should return the first item", () => {
    const taskQueueServiceObj = new TaskQueueService();
    taskQueueServiceObj.enqueue({
      executionTime: 10,
      data: {
        userEmail: "me@gazar.dev",
      },
    });
    expect(taskQueueServiceObj.peek().executionTime).toBe(10);
  });
});
