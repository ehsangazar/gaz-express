import EmailQueueService from "../EmailQueueService";

describe("EmailQueueService", () => {
  it("should be a function", () => {
    expect(typeof EmailQueueService).toBe("function");
  });
  it("should be a function", () => {
    const EmailQueueServiceObj = new EmailQueueService();
    expect(typeof EmailQueueServiceObj.add).toBe("function");
    expect(typeof EmailQueueServiceObj.shift).toBe("function");
    expect(typeof EmailQueueServiceObj.list).toBe("function");
  });

  it("should be able to add", () => {
    const emailQueueObj = new EmailQueueService();
    emailQueueObj.add(1);
    expect(emailQueueObj.list().length).toBe(1);
  });

  it("should shift the first item", () => {
    const emailQueueObj = new EmailQueueService();
    emailQueueObj.add(10);
    emailQueueObj.add(1);
    expect(emailQueueObj.shift()).toBe(10);
  });
});
