import { json, Express } from 'express';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import { rateLimit, Options } from 'express-rate-limit';

import { APP } from 'config';
import { RateLimitError } from 'errors';

export class CommonMiddleware {
  constructor(private app: Express) {}

  useJson = () => {
    this.app.use(json());
  };

  useCors = () => {
    const options: CorsOptions = {
      origin: APP.client.host,
      credentials: true,
    };

    this.app.use(cors(options));
  };

  useHelmet = () => {
    this.app.use(helmet());
  };

  useTrustProxy = () => {
    this.app.set('trust proxy', true);
  };

  useRateLimit = () => {
    const options: Partial<Options> = {
      windowMs: 15 * 60 * 1000,
      max: 150,
      handler: (req) => {
        throw new RateLimitError(req.rateLimit?.resetTime);
      },
    };

    this.app.use(rateLimit(options));
  };
}
