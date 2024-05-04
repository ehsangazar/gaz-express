import TaskQueueService from "../TaskQueueService";

describe("TaskQueueService", () => {
  let taskQueueServiceObj: TaskQueueService;
  beforeEach(() => {
    taskQueueServiceObj = new TaskQueueService();
  });
  it("should be a function", () => {
    expect(typeof TaskQueueService).toBe("function");
  });
  it("should be a function", () => {
    expect(typeof taskQueueServiceObj.insert).toBe("function");
    expect(typeof taskQueueServiceObj.extractMin).toBe("function");
    expect(typeof taskQueueServiceObj.getLength).toBe("function");
  });

  it("should be able to enqueue", () => {
    taskQueueServiceObj.insert({
      executionTime: 1,
      data: {
        userEmail: "me@gazar.dev",
      },
    });
    expect(taskQueueServiceObj.getLength()).toBe(1);
  });

  it("should sort the queue", () => {
    taskQueueServiceObj.insert({
      executionTime: 10,
      data: {
        userEmail: "me@gazar.dev",
      },
    });
    taskQueueServiceObj.insert({
      executionTime: 1,
      data: {
        userEmail: "me@gazar.dev",
      },
    });
    taskQueueServiceObj.insert({
      executionTime: 4,
      data: {
        userEmail: "me@gazar.dev",
      },
    });
    expect(taskQueueServiceObj.extractMin().executionTime).toBe(1);
    expect(taskQueueServiceObj.extractMin().executionTime).toBe(4);
    expect(taskQueueServiceObj.extractMin().executionTime).toBe(10);
  });

  it("should return the first item", () => {
    taskQueueServiceObj.insert({
      executionTime: 10,
      data: {
        userEmail: "me@gazar.dev",
      },
    });
    expect(taskQueueServiceObj.peek().executionTime).toBe(10);
  });
});
