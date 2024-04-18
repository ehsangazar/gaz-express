import EmailQueueService from "../EmailQueueService";
import EmailService from "../EmailService";
import TaskQueueService from "../TaskQueueService";

jest.mock("../EmailService");
jest.mock("../EmailQueueService");
describe("TaskQueueService", () => {
  it("should be a function", () => {
    expect(typeof TaskQueueService).toBe("function");
  });
  it("should be a function", () => {
    const emailServiceObj = new EmailService();
    const emailQueueServiceObj = new EmailQueueService(
      emailServiceObj.sendEmail
    );
    const taskQueueServiceObj = new TaskQueueService(emailQueueServiceObj);
    expect(typeof taskQueueServiceObj.push).toBe("function");
    expect(typeof taskQueueServiceObj.shift).toBe("function");
    expect(typeof taskQueueServiceObj.list).toBe("function");
  });

  it("should be able to push", () => {
    const emailServiceObj = new EmailService();
    const emailQueueServiceObj = new EmailQueueService(
      emailServiceObj.sendEmail
    );
    const taskQueueServiceObj = new TaskQueueService(emailQueueServiceObj);
    taskQueueServiceObj.push({
      executionTimestamp: 1,
      userEmail: "me@gazar.dev",
      subject: "test",
      body: "test",
    });
    expect(taskQueueServiceObj.list().length).toBe(1);
  });

  it("should sort the queue", () => {
    const emailServiceObj = new EmailService();
    const emailQueueServiceObj = new EmailQueueService(
      emailServiceObj.sendEmail
    );
    const taskQueueServiceObj = new TaskQueueService(emailQueueServiceObj);
    taskQueueServiceObj.push({
      executionTimestamp: 10,
      userEmail: "me@gazar.dev",
      subject: "test",
      body: "test",
    });
    taskQueueServiceObj.push({
      executionTimestamp: 1,
      userEmail: "me@gazar.dev",
      subject: "test",
      body: "test",
    });
    expect(taskQueueServiceObj.shift().executionTimestamp).toBe(1);
  });

  it("should be able to start/stop", () => {
    const emailServiceObj = new EmailService();
    const emailQueueServiceObj = new EmailQueueService(
      emailServiceObj.sendEmail
    );
    const taskQueueServiceObj = new TaskQueueService(emailQueueServiceObj);
    taskQueueServiceObj.push({
      executionTimestamp: 1,
      userEmail: "me@gazar.dev",
      subject: "test",
      body: "test",
    });
    taskQueueServiceObj.start();
    expect(taskQueueServiceObj.started).toBe(true);
    taskQueueServiceObj.stop();
    expect(taskQueueServiceObj.started).toBe(false);
  });

  it("should finish the stack", async () => {
    const emailServiceObj = new EmailService();
    const emailQueueServiceObj = new EmailQueueService(
      emailServiceObj.sendEmail
    );
    const taskQueueServiceObj = new TaskQueueService(emailQueueServiceObj);
    emailQueueServiceObj.push = jest.fn(async () => true);
    taskQueueServiceObj.push({
      userEmail: "me@gazar.dev",
      subject: "test",
      body: "test",
      executionTimestamp: Date.now(),
    });
    taskQueueServiceObj.start();
    await new Promise((r) => setTimeout(r, 10));
    expect(emailQueueServiceObj.push).toHaveBeenCalled();
    expect(taskQueueServiceObj.list().length).toBe(0);
  });
  it("should not be able to finish because time has not reached", async () => {
    const emailServiceObj = new EmailService();
    const emailQueueServiceObj = new EmailQueueService(
      emailServiceObj.sendEmail
    );
    const taskQueueServiceObj = new TaskQueueService(emailQueueServiceObj);
    emailQueueServiceObj.push = jest.fn(async () => true);
    taskQueueServiceObj.push({
      userEmail: "me@gazar.dev",
      subject: "test",
      body: "test",
      executionTimestamp: Date.now() + 1000 * 60,
    });
    taskQueueServiceObj.start();
    await new Promise((r) => setTimeout(r, 10));
    expect(emailQueueServiceObj.push).not.toHaveBeenCalled();
    expect(taskQueueServiceObj.list().length).toBe(1);
  });
});
