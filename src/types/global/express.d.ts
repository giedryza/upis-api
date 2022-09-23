import { RateLimitInfo } from 'express-rate-limit';

import { AppUser } from 'domain/users/users.types';

declare global {
  namespace Express {
    interface Request {
      user?: AppUser;
      rateLimit?: RateLimitInfo;
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
