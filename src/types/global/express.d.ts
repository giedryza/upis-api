import { RateLimitInfo } from 'express-rate-limit';
import { z } from 'zod';

import { AppUser } from 'domain/users/users.types';

declare global {
  namespace Express {
    interface Request {
      user?: AppUser;
      rateLimit?: RateLimitInfo;
      parsedData?: z.ZodTypeAny;
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
