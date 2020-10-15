import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from 'errors/request-validation.error';

export class Validator {
  static validate = (req: Request, _res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array({ onlyFirstError: true }));
    }

    next();
  };
}
