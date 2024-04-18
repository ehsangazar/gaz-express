import controller from "../controller";

it("should return a json response", async () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  controller.main(null, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    message: "app is working",
  });
});

it("should return a json response", async () => {
  const req = {
    body: {
      eventName: "test",
      userEmail: "info@gazar.dev",
    },
    flowManager: {
      emit: jest.fn(),
    },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  controller.event(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    message: "event emitted",
  });
  expect(req.flowManager.emit).toHaveBeenCalledWith("test", "info@gazar.dev");
});
