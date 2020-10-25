import { Request, Response, NextFunction } from 'express';
import { Model, Document } from 'mongoose';
import { NotFoundError } from 'errors/not-found.error';
import { UnauthorizedError } from 'errors/unauthorized.error';
import { DocumentWithUser } from 'types/mongoose';
import { RequestWithDocument } from 'types/express';

export class Middleware {
  static exists = <A extends Document, T extends Model<A>>(model: T) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
      const { id } = req.params;

      if (!id) {
        throw new NotFoundError('Record not found.');
      }

      const document = await model.findById(id);

      if (!document) {
        throw new NotFoundError('Record not found.');
      }

      req.document = document;

      next();
    };
  };

  static isOwner = (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const { document } = req as RequestWithDocument<DocumentWithUser>;

    if (!document.user) {
      throw new UnauthorizedError();
    }

    if (document.user.toHexString() !== req.user.id) {
      throw new UnauthorizedError();
    }

    next();
  };
}
