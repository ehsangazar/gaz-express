import EventService from "../EventService";

describe("EventService", () => {
  let eventServiceObj: EventService;
  beforeEach(() => {
    eventServiceObj = new EventService();
  });
  it("should be a function", () => {
    expect(typeof EventService).toBe("function");
  });
  it("should have emit and on", () => {
    expect(typeof eventServiceObj.emit).toBe("function");
    expect(typeof eventServiceObj.on).toBe("function");
  });

  it("should listen and emit an event", () => {
    let test = 1;
    eventServiceObj.on("test", () => {
      test = 2;
    });
    eventServiceObj.emit("test", 1);
    expect(test).toBe(2);
  });
});
