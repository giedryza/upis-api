import { User } from 'domain/users/users.types';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export interface MulterS3Request {
  file: {
    location: string;
  };
}
