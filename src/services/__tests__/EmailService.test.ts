import EmailService from "../EmailService";

describe("EmailService", () => {
  it("should be a function", () => {
    expect(typeof EmailService).toBe("function");
  });
  it("should be a function", () => {
    const emailServiceObj = new EmailService();
    expect(typeof emailServiceObj.sendEmail).toBe("function");
  });
});
