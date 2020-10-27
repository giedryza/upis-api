import { Request } from 'express';
import { matchedData } from 'express-validator';
import { Document, DocumentQuery, FilterQuery, Model } from 'mongoose';
import { RequestWithDocument } from 'types/express';
import { Basics } from 'utils/basics';

export class Helpers {
  static update = async <T extends Document>(
    document: T,
    update: Partial<T>
  ) => {
    document.set(Basics.stripUndefined(update));

    await document.save();

    return document;
  };

  static getBody = <T extends object>(req: Request): T =>
    matchedData(req, {
      locations: ['body'],
      includeOptionals: true,
    }) as T;

  static getDocument = <T extends Document>(req: Request): T =>
    (req as RequestWithDocument<T>).document;

  static getDocumentQuery = <T extends Document>(req: Request) =>
    req.documentQuery as DocumentQuery<T[], T, {}>;

  static getQueries = <A extends Document, T extends Model<A>>(
    model: T,
    req: Request
  ) => {
    const documentQuery = model.find();
    const filterQuery = req.query as FilterQuery<A>;

    return { documentQuery, filterQuery };
  };
}
