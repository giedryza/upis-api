import { Request } from 'express';
import { Document, DocumentQuery } from 'mongoose';
import { User } from 'domain/users/users.types';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      document?: Document;
      documentQuery?: DocumentQuery<Document[], Document, {}>;
    }

    namespace Multer {
      interface File {
        location: string;
        contentType: string;
      }
    }
  }
}

export interface RequestWithDocument<T extends Document> extends Request {
  document: T;
}
