import Validator from "validatorjs";

const postEvent = async (req, res) => {
  const validator = new Validator(req.body, {
    eventName: "required",
    userEmail: "required|email",
  });

  if (validator.fails()) {
    return res.status(400).json({
      message: "invalid data",
      errors: validator.errors.all(),
    });
  }

  if (req.mailSchedulerFlowManager)
    req.mailSchedulerFlowManager.emit(req.body.eventName, req.body.userEmail);

  res.status(200).json({
    message: "event emitted",
  });
};

const getEvent = async (req, res) => {
  const validator = new Validator(req.body, {
    eventName: "required",
    userEmail: "required|email",
  });

  if (validator.fails()) {
    return res.status(400).json({
      message: "invalid data",
      errors: validator.errors.all(),
    });
  }

  let length = 0;
  if (req.mailSchedulerFlowManager)
    length = req.mailSchedulerFlowManager.getTaskQueueServiceLength();

  res.status(200).json({
    message: "success",
    length,
  });
};

export default { postEvent, getEvent };
