import { json, Express } from 'express';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import { rateLimit, Options } from 'express-rate-limit';
import { handle } from 'i18next-http-middleware';

import { APP } from 'config';
import { RateLimitError } from 'errors';
import { i18n } from 'tools/services';

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
      max: 300,
      handler: (req) => {
        throw new RateLimitError(req.rateLimit?.resetTime);
      },
    };

    this.app.use(rateLimit(options));
  };

  useI18n = () => {
    this.app.use(handle(i18n));
  };
}
