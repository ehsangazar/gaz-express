import EmailService from "../EmailService";

describe("EmailService", () => {
  let emailServiceObj: EmailService;

  beforeEach(() => {
    emailServiceObj = new EmailService();
  });
  it("should be a function", () => {
    expect(typeof EmailService).toBe("function");
  });
  it("should be a function", () => {
    expect(typeof emailServiceObj.sendEmail).toBe("function");
  });
});
