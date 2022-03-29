import { Express, Request, Response, NextFunction } from 'express';

import { BaseError } from 'errors/_base.error';
import { StatusCode } from 'constants/status-code';
import { ErrorResponse } from 'responses/error.response';

export class ErrorMiddleware {
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
      return new ErrorResponse(res, err.statusCode, err.serialize()).send();
    }

    console.error(err);

    const genericError = [{ message: err.message ?? 'Something went wrong.' }];

    return new ErrorResponse(
      res,
      StatusCode.InternalServerError,
      genericError
    ).send();
  };
}
