import { UserWithTimestamp } from 'domain/users/users.types';

declare global {
  namespace Express {
    interface Request {
      user?: UserWithTimestamp;
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
