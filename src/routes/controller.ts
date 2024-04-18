import Validator from "validatorjs";

const main = async (req, res) => {
  res.status(200).json({
    message: "app is working",
  });
};

const event = async (req, res) => {
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

  req.flowManager.emit(req.body.eventName, req.body.userEmail);

  res.status(200).json({
    message: "event emitted",
  });
};

export default { main, event };
