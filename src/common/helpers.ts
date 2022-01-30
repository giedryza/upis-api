import { Request } from 'express';
import { matchedData } from 'express-validator';

export class Helpers {
  static getBody = <T extends object>(req: Request): T =>
    matchedData(req, {
      locations: ['body'],
      includeOptionals: false,
    }) as T;
}
