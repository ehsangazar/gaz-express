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

  if (req.mailSchedulerFlowManager) {
    if (req.mailSchedulerFlowManager.taskQueueServiceObj.getLength() < 20) {
      if (
        !req.mailSchedulerFlowManager.taskQueueServiceObj.search(
          req.body.userEmail
        )
      ) {
        req.mailSchedulerFlowManager.emit(
          req.body.eventName,
          req.body.userEmail
        );
      } else {
        res.status(400).json({
          status: "error",
          message: "User already in queue",
        });
      }
    } else {
      res.status(400).json({
        status: "error",
        message: "System is overloaded with tasks, you can try later",
      });
    }
  }

  res.status(200).json({
    status: "success",
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
    status: "success",
    message: "success",
    length,
  });
};

export default { postEvent, getEvent };
