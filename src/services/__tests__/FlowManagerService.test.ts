import mockFlowMap from "../../../mock/mockFlowMap";
import FlowManagerService from "../FlowManagerService";
import TaskQueueService from "../TaskQueueService";

jest.useFakeTimers().setSystemTime(new Date("2020-01-01"));
jest.mock("../EmailService");

describe("TaskQueueService", () => {
  it("should be a function", () => {
    expect(typeof TaskQueueService).toBe("function");
  });
  it("should have emit and listen", () => {
    const flowServiceObj = new FlowManagerService(mockFlowMap);
    expect(typeof flowServiceObj.emit).toBe("function");
    expect(typeof flowServiceObj.listen).toBe("function");
  });
  it("should work with whenCalculator", () => {
    const flowServiceObj = new FlowManagerService(mockFlowMap);
    expect(
      flowServiceObj.whenCalculator({
        seconds: 10,
        minutes: 1,
        hours: 1,
      })
    ).toBe(1577840470000);
  });
  it("should listen", () => {
    const flowServiceObj = new FlowManagerService(mockFlowMap);
    flowServiceObj.eventServiceObj.on = jest.fn();
    flowServiceObj.listen();
    expect(flowServiceObj.eventServiceObj.on).toHaveBeenCalled();
  });
  it("should listen after emit socksPurchased", () => {
    const flowServiceObj = new FlowManagerService(mockFlowMap);
    flowServiceObj.emailQueueServiceObj.push = jest.fn();
    flowServiceObj.listen();
    flowServiceObj.emit("socksPurchased", "me@gazar.dev");
    expect(flowServiceObj.emailQueueServiceObj.push).toHaveBeenCalled();
  });
  it("should listen to emit websiteSignup", () => {
    const flowServiceObj = new FlowManagerService(mockFlowMap);
    flowServiceObj.taskQueueServiceObj.push = jest.fn();
    flowServiceObj.listen();
    flowServiceObj.emit("websiteSignup", "me@gazar.dev");
    expect(flowServiceObj.taskQueueServiceObj.push).toHaveBeenCalled();
  });
  it("should listen to after emit socksPurchased", () => {
    const flowServiceObj = new FlowManagerService(mockFlowMap);
    flowServiceObj.emit = jest.fn();
    flowServiceObj.listen();
    flowServiceObj.emit("socksPurchased", "me@gazar.dev");
    expect(flowServiceObj.emit).toHaveBeenCalled();
  });
});
