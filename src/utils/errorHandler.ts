export const catchErrors =
  (fn) => (req: Request, res: Response, next: Function) =>
    fn(req, res, next).catch(next);

export const notFound = (
  req: Request,
  res: {
    status: (arg0: number) => void;
  },
  next: Function
) => {
  const err = new Error("Not Found");
  res.status(404);
  next(err);
};

export const developmentErrors = (
  err: {
    message: any;
    status: any;
    stack: any;
  },
  req: Request,
  res: {
    status: (arg0: any) => {
      (): any;
      new (): any;
      send: { (arg0: any): any; new (): any };
    };
    format: (arg0: {
      "text/html": () => void;
      "application/json": () => void;
    }) => void;
    render: (
      arg0: string,
      arg1: { message: any; status: any; stackHighlighted: any }
    ) => void;
    json: (arg0: { message: any; status: any; stackHighlighted: any }) => void;
  },
  next: Function
) => {
  const errorDetails = {
    message: err.message,
    status: err.status,
    stackHighlighted: err.stack?.replace(
      /[a-z_-\d]+.js:\d+:\d+/gi,
      "<mark>$&</mark>"
    ),
  };
  res.status(err.status || 500);
  res.format({
    "text/html": () => {
      res.render("error", errorDetails);
    },
    "application/json": () => res.json(errorDetails),
  });
};

export const productionErrors = (
  err: {
    message: any;
    status: any;
  },
  req: Request,
  res: {
    status: (arg0: any) => {
      (): any;
      send: { (arg0: any): any; new (): any };
    };
    format: (arg0: {
      "text/html": () => void;
      "application/json": () => void;
    }) => void;
    render: (arg0: string, arg1: { message: any; status: any }) => void;
    json: (arg0: { message: any; status: any }) => void;
  },
  next: Function
) => {
  res.status(err.status || 500);
  res.format({
    "text/html": () => {
      res.render("error", {
        message: err.message,
        status: err.status,
      });
    },
    "application/json": () =>
      res.json({
        message: err.message,
        status: err.status,
      }),
  });
};
