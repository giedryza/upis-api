import { Request, Response, NextFunction } from 'express';
import { validationResult, matchedData } from 'express-validator';

import { RequestValidationError } from 'errors';

interface RequestData<Params, Body> {
  params: Params;
  body: Body;
}

export class ValidatorService {
  static catch = (req: Request, _res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array({ onlyFirstError: true }));
    }

    next();
  };

  static getData = <Params extends object = {}, Body extends object = {}>(
    req: Request
  ): RequestData<Params, Body> => ({
    params: matchedData(req, {
      locations: ['params'],
      includeOptionals: false,
    }) as Params,
    body: matchedData(req, {
      locations: ['body'],
      includeOptionals: false,
    }) as Body,
  });

  static getBody = <T extends object>(req: Request): T =>
    matchedData(req, {
      locations: ['body'],
      includeOptionals: false,
    }) as T;
}
