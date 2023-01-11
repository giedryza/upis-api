import { Request, Response, NextFunction } from 'express';
import { validationResult, matchedData } from 'express-validator';
import { z } from 'zod';

import { RequestValidationError } from 'errors';

interface RequestData<Params, Body> {
  params: Params;
  body: Body;
}

type Validator<F extends (req: Request) => z.ZodTypeAny> = z.infer<
  ReturnType<F>
>;

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

  static getParsedData = <V extends (req: Request) => z.ZodTypeAny>(
    req: Request
  ): Validator<V> => req.parsedData;

  static handleError = (error: unknown) => {
    if (error instanceof z.ZodError) {
      throw new RequestValidationError(
        error.issues.map((issue) => ({
          msg: issue.message,
          param: issue.path.join('.'),
        }))
      );
    }

    throw error;
  };

  static validate =
    <T extends z.ZodTypeAny>(getSchema: (req: Request) => T) =>
    async (req: Request, _res: Response, next: NextFunction) => {
      try {
        const parsedData = await getSchema(req).parseAsync(req);

        req.parsedData = parsedData;

        return next();
      } catch (error) {
        this.handleError(error);
      }
    };
}
