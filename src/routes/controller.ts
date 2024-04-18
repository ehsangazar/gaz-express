const main = async (req, res) => {
  res.status(200).json({
    message: "app is working",
  });
};

const event = async (req, res) => {
  res.status(200).json({
    message: "event is working",
  });
};

export default { main, event };
