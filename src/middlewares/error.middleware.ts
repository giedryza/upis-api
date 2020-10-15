import { Express, Request, Response, NextFunction } from 'express';
import { BaseError } from 'types/base/error.base';
import { StatusCode } from 'constants/status-code';

class ErrorMiddleware {
  constructor(private app: Express) {}

  useError = () => {
    this.app.use(this.handle);
  };

  private handle = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    if (err instanceof BaseError) {
      res.status(err.statusCode).send({ data: err.serialize() });
      return;
    }

    console.error(err);

    res.status(StatusCode.InternalServerError).send({
      data: [{ message: err.message || 'Something went wrong' }],
    });
  };
}

export { ErrorMiddleware };
