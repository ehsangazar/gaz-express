import mockFlowMap from "../../../mock/mockFlowMap";
import FlowManagerService from "../FlowManagerService";

const fakeToday = new Date("2020-01-01");
jest.useFakeTimers().setSystemTime(fakeToday);
jest.mock("../EmailService", () => {
  return jest.fn().mockImplementation(() => {
    return {
      sendEmail: jest.fn(),
    };
  });
});

describe("FlowManagerService", () => {
  let flowServiceObj: FlowManagerService;
  beforeEach(() => {
    flowServiceObj = new FlowManagerService(mockFlowMap);
  });
  it("should be a function", () => {
    expect(typeof FlowManagerService).toBe("function");
  });
  it("should have emit and listen", () => {
    expect(typeof flowServiceObj.emit).toBe("function");
    expect(typeof flowServiceObj.listen).toBe("function");
    expect(typeof flowServiceObj.whenCalculator).toBe("function");
    expect(typeof flowServiceObj.stopEmailQueueService).toBe("function");
    expect(typeof flowServiceObj.stopTaskQueueService).toBe("function");
    expect(typeof flowServiceObj.stop).toBe("function");
    expect(typeof flowServiceObj.startProcessEmailQueue).toBe("function");
    expect(typeof flowServiceObj.startProcessTaskQueue).toBe("function");
    expect(typeof flowServiceObj.processEmailQueue).toBe("function");
    expect(typeof flowServiceObj.processTaskQueue).toBe("function");
  });
  it("should work with whenCalculator", () => {
    expect(
      flowServiceObj.whenCalculator({
        seconds: 10,
        minutes: 1,
        hours: 1,
      })
    ).toBe(1577840470000);
  });
  it("should listen", () => {
    flowServiceObj.eventServiceObj.on = jest.fn();
    flowServiceObj.listen();
    expect(flowServiceObj.eventServiceObj.on).toHaveBeenCalled();
  });
  it("should listen after emit socksPurchased", () => {
    flowServiceObj.taskQueueServiceObj.enqueue = jest.fn();
    flowServiceObj.listen();
    flowServiceObj.emit("socksPurchased", "me@gazar.dev");
    expect(flowServiceObj.taskQueueServiceObj.enqueue).toHaveBeenCalled();
    flowServiceObj.stop();
  });
  it("should listen to emit websiteSignup and isEmpty to be called", async () => {
    flowServiceObj.taskQueueServiceObj.isEmpty = jest.fn(() => true);
    Date.now = jest.fn(() => fakeToday.getTime() - 1000 * 60 * 60 * 3);

    flowServiceObj.listen();
    flowServiceObj.emit("websiteSignup", "me@gazar.dev");
    expect(flowServiceObj.taskQueueServiceObj.isEmpty).toHaveBeenCalled();
  });
  it("should listen to emit websiteSignup and peek to be called", async () => {
    flowServiceObj.emailServiceObj.sendEmail = jest.fn(async () => true);
    flowServiceObj.listen();
    flowServiceObj.emit("websiteSignup", "me@gazar.dev");
    expect(flowServiceObj.taskQueueServiceObj.size()).toBe(1);
    jest.runAllTimers();
    await Promise.resolve();
    expect(flowServiceObj.taskQueueServiceObj.size()).toBe(0);
    jest.runAllTimers();
    expect(flowServiceObj.emailQueueServiceObj.size()).toBe(1);
    await Promise.resolve();
    expect(flowServiceObj.emailQueueServiceObj.size()).toBe(0);
  });
  it("should call next function for socksPurchased", async () => {
    flowServiceObj.emailServiceObj.sendEmail = jest.fn(async () => true);
    flowServiceObj.listen();
    flowServiceObj.emit("socksPurchased", "me@gazar.dev");
    expect(flowServiceObj.taskQueueServiceObj.size()).toBe(1);
    jest.runAllTimers();
    await Promise.resolve();
    jest.runAllTimers();
    await Promise.resolve();
    expect(flowServiceObj.emailServiceObj.sendEmail).toHaveBeenCalledTimes(1);
    jest.runAllTimers();
    await Promise.resolve();
    jest.runAllTimers();
    await Promise.resolve();
    expect(flowServiceObj.emailServiceObj.sendEmail).toHaveBeenCalledTimes(2);
  });
  it("should call add to emailQueueServiceObj if sendEmail fails", async () => {
    flowServiceObj.emailServiceObj.sendEmail = jest.fn(async () => false);
    flowServiceObj.listen();
    flowServiceObj.emit("socksDispatched", "me@gazar.dev");
    expect(flowServiceObj.taskQueueServiceObj.size()).toBe(1);
    jest.runAllTimers();
    await Promise.resolve();
    jest.runAllTimers();
    await Promise.resolve();
    expect(flowServiceObj.emailServiceObj.sendEmail).toHaveBeenCalledTimes(1);
    jest.runAllTimers();
    await Promise.resolve();
    expect(flowServiceObj.emailQueueServiceObj.size()).toBe(1);
  });
});
