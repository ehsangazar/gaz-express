import mockFlowMap from "../../../mock/mockFlowMap";
import EmailQueueService from "../EmailQueueService";
import EmailService from "../EmailService";
import EventService from "../EventService";
import FlowManagerService from "../FlowManagerService";
import TaskQueueService from "../TaskQueueService";

jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
jest.mock("../EmailService");
jest.mock("../EmailQueueService");

describe("TaskQueueService", () => {
  it("should be a function", () => {
    expect(typeof TaskQueueService).toBe("function");
  });
  it("should have emit and listen", () => {
    const eventServiceObj = new EventService();
    const emailServiceObj = new EmailService();
    const emailQueueServiceObj = new EmailQueueService(emailServiceObj);
    const taskQueueServiceObj = new TaskQueueService(emailQueueServiceObj);
    const flowServiceObj = new FlowManagerService(
      eventServiceObj,
      emailQueueServiceObj,
      taskQueueServiceObj,
      mockFlowMap
    );
    expect(typeof flowServiceObj.emit).toBe("function");
    expect(typeof flowServiceObj.listen).toBe("function");
  });
  it("should work with whenCalculator", () => {
    const eventServiceObj = new EventService();
    const emailServiceObj = new EmailService();
    const emailQueueServiceObj = new EmailQueueService(emailServiceObj);
    const taskQueueServiceObj = new TaskQueueService(emailQueueServiceObj);
    const flowServiceObj = new FlowManagerService(
      eventServiceObj,
      emailQueueServiceObj,
      taskQueueServiceObj,
      mockFlowMap
    );
    expect(
      flowServiceObj.whenCalculator({
        seconds: 10,
        minutes: 1,
        hours: 1,
      })
    ).toBe(1577840470000);
  });
  it("should listen", () => {
    const eventServiceObj = new EventService();
    const emailServiceObj = new EmailService();
    const emailQueueServiceObj = new EmailQueueService(emailServiceObj);
    const taskQueueServiceObj = new TaskQueueService(emailQueueServiceObj);
    eventServiceObj.on = jest.fn();
    const flowServiceObj = new FlowManagerService(
      eventServiceObj,
      emailQueueServiceObj,
      taskQueueServiceObj,
      mockFlowMap
    );
    flowServiceObj.listen();
    expect(eventServiceObj.on).toHaveBeenCalled();
  });
  it("should listen after emit socksPurchased", () => {
    const eventServiceObj = new EventService();
    const emailServiceObj = new EmailService();
    const emailQueueServiceObj = new EmailQueueService(emailServiceObj);
    const taskQueueServiceObj = new TaskQueueService(emailQueueServiceObj);
    emailQueueServiceObj.push = jest.fn();
    const flowServiceObj = new FlowManagerService(
      eventServiceObj,
      emailQueueServiceObj,
      taskQueueServiceObj,
      mockFlowMap
    );
    flowServiceObj.listen();
    flowServiceObj.emit("socksPurchased", "me@gazar.dev");
    expect(emailQueueServiceObj.push).toHaveBeenCalled();
  });
  it("should listen to emit websiteSignup", () => {
    const eventServiceObj = new EventService();
    const emailServiceObj = new EmailService();
    const emailQueueServiceObj = new EmailQueueService(emailServiceObj);
    const taskQueueServiceObj = new TaskQueueService(emailQueueServiceObj);
    taskQueueServiceObj.push = jest.fn();
    const flowServiceObj = new FlowManagerService(
      eventServiceObj,
      emailQueueServiceObj,
      taskQueueServiceObj,
      mockFlowMap
    );
    flowServiceObj.listen();
    flowServiceObj.emit("websiteSignup", "me@gazar.dev");
    expect(taskQueueServiceObj.push).toHaveBeenCalled();
  });
  it("should listen to after emit socksPurchased", () => {
    const eventServiceObj = new EventService();
    const emailServiceObj = new EmailService();
    const emailQueueServiceObj = new EmailQueueService(emailServiceObj);
    const taskQueueServiceObj = new TaskQueueService(emailQueueServiceObj);
    const flowServiceObj = new FlowManagerService(
      eventServiceObj,
      emailQueueServiceObj,
      taskQueueServiceObj,
      mockFlowMap
    );
    flowServiceObj.emit = jest.fn();
    flowServiceObj.listen();
    flowServiceObj.emit("socksPurchased", "me@gazar.dev");
    expect(flowServiceObj.emit).toHaveBeenCalled();
  });
});
