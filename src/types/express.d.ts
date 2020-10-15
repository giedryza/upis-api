import { User } from 'domain/users/users.types';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
