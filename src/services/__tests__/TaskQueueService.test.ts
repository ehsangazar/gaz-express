import TaskQueueService from "../TaskQueueService";

describe("TaskQueueService", () => {
  it("should be a function", () => {
    expect(typeof TaskQueueService).toBe("function");
  });
  it("should be a function", () => {
    const TaskQueueServiceObj = new TaskQueueService();
    expect(typeof TaskQueueServiceObj.add).toBe("function");
    expect(typeof TaskQueueServiceObj.shift).toBe("function");
    expect(typeof TaskQueueServiceObj.list).toBe("function");
  });

  it("should be able to add", () => {
    const taskQueueObj = new TaskQueueService();
    taskQueueObj.add({
      executionTimestamp: 1,
    });
    expect(taskQueueObj.list().length).toBe(1);
  });

  it("should sort the queue", () => {
    const taskQueueObj = new TaskQueueService();
    taskQueueObj.add({
      executionTimestamp: 10,
    });
    taskQueueObj.add({
      executionTimestamp: 1,
    });
    expect(taskQueueObj.shift().executionTimestamp).toBe(1);
  });
});
