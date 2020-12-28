import { json, Express } from 'express';
import cookieSession from 'cookie-session';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import rateLimit, { Options } from 'express-rate-limit';
import { Jwt } from 'common/jwt';
import { AuthMiddleware } from 'middlewares/auth.middleware';
import { RateLimitError } from 'errors/rate-limit.error';

export class CommonMiddleware {
  constructor(private app: Express) {}

  useJson = () => {
    this.app.use(json());
  };

  useCors = () => {
    const options: CorsOptions = {
      origin: process.env.HOST,
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
    const options: Options = {
      windowMs: 15 * 60 * 1000,
      max: 150,
      handler: (req) => {
        throw new RateLimitError(req.rateLimit.resetTime);
      },
    };

    this.app.use(rateLimit(options));
  };

  useCookieSession = () => {
    this.app.use(
      cookieSession({
        signed: true,
        secure: process.env.NODE_ENV === 'production',
        keys: [process.env.COOKIE_KEY_1, process.env.COOKIE_KEY_2],
        maxAge: Jwt.expiresIn * 1000,
      })
    );
  };

  useUser = () => {
    this.app.use(AuthMiddleware.user);
  };
}
