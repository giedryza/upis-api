import { User } from 'domain/users/users.types';

declare global {
  namespace Express {
    interface Request {
      user?: User;
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
