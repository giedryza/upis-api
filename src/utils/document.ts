import { Request } from 'express';
import { matchedData } from 'express-validator';
import { Document as MongooseDocument } from 'mongoose';
import { RequestWithDocument } from 'types/express';
import { Helpers } from 'utils/helpers';

export class Document {
  static update = async <T extends MongooseDocument>(
    document: T,
    update: Partial<T>
  ) => {
    document.set(Helpers.stripUndefined(update));

    await document.save();

    return document;
  };

  static getBody = <T extends object>(req: Request): T =>
    matchedData(req, {
      locations: ['body'],
      includeOptionals: true,
    }) as T;

  static getDocument = <T extends MongooseDocument>(req: Request): T =>
    (req as RequestWithDocument<T>).document;
}
