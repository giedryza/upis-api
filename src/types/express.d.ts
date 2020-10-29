import { Request } from 'express';
import { Document } from 'mongoose';
import { User } from 'domain/users/users.types';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      document?: Document;
    }

    namespace Multer {
      interface File {
        location: string;
        contentType: string;
        key: string;
      }
    }
  }
}

export interface RequestWithDocument<T extends Document> extends Request {
  document: T;
}
