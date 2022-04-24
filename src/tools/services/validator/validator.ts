import { Request, Response, NextFunction } from 'express';
import { validationResult, matchedData } from 'express-validator';

import { RequestValidationError } from 'errors';

export class ValidatorService {
  static catch = (req: Request, _res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array({ onlyFirstError: true }));
    }

    next();
  };

  static getBody = <T extends object>(req: Request): T =>
    matchedData(req, {
      locations: ['body'],
      includeOptionals: false,
    }) as T;
}
