import EmailQueueService from "../EmailQueueService";
import EmailService from "../EmailService";

jest.mock("../EmailService");
describe("EmailQueueService", () => {
  it("should be a function", () => {
    expect(typeof EmailQueueService).toBe("function");
  });
  it("should be a function", () => {
    const emailServiceObj = new EmailService();
    const emailQueueServiceObj = new EmailQueueService(emailServiceObj);
    expect(typeof emailQueueServiceObj.push).toBe("function");
    expect(typeof emailQueueServiceObj.shift).toBe("function");
    expect(typeof emailQueueServiceObj.list).toBe("function");
  });

  it("should be able to push", () => {
    const emailServiceObj = new EmailService();
    const emailQueueServiceObj = new EmailQueueService(emailServiceObj);
    emailQueueServiceObj.push(1);
    expect(emailQueueServiceObj.list().length).toBe(1);
  });

  it("should shift the first item", () => {
    const emailServiceObj = new EmailService();
    const emailQueueServiceObj = new EmailQueueService(emailServiceObj);
    emailQueueServiceObj.push(10);
    emailQueueServiceObj.push(1);
    expect(emailQueueServiceObj.shift()).toBe(10);
  });

  it("should start/stop the process", () => {
    const emailServiceObj = new EmailService();
    const emailQueueServiceObj = new EmailQueueService(emailServiceObj);
    emailQueueServiceObj.start();
    expect(emailQueueServiceObj.started).toBe(true);
    emailQueueServiceObj.stop();
    expect(emailQueueServiceObj.started).toBe(false);
  });

  it("should finish the stack", async () => {
    const emailServiceObj = new EmailService();
    const emailQueueServiceObj = new EmailQueueService(emailServiceObj);
    emailServiceObj.sendEmail = jest.fn(async () => true);
    emailQueueServiceObj.push(1);
    emailQueueServiceObj.start();
    await new Promise((r) => setTimeout(r, 10));
    emailQueueServiceObj.stop();
    expect(emailQueueServiceObj.list().length).toBe(0);
  });
  it("should finish push an item back to stack", async () => {
    const emailServiceObj = new EmailService();
    const emailQueueServiceObj = new EmailQueueService(emailServiceObj);
    emailServiceObj.sendEmail = jest.fn(async () => false);
    emailQueueServiceObj.push(1);
    emailQueueServiceObj.start();
    await new Promise((r) => setTimeout(r, 100));
    emailQueueServiceObj.stop();
    expect(emailQueueServiceObj.list().length).toBe(1);
  });
});
