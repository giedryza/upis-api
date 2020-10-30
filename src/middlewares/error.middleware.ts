import { Express, Request, Response, NextFunction } from 'express';
import { BaseError } from 'errors/_base.error';
import { StatusCode } from 'constants/status-code';

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
      res.status(err.statusCode).json({ data: err.serialize() });
      return;
    }

    console.error(err);

    res.status(StatusCode.InternalServerError).json({
      data: [{ message: err.message || 'Something went wrong' }],
    });
  };
}
