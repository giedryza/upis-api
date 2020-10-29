import { Express } from 'express';
import { CommonMiddleware } from 'middlewares/common.middleware';
import { ErrorMiddleware } from 'middlewares/error.middleware';

class Middlewares {
  static common = (app: Express) => {
    const middleware = new CommonMiddleware(app);

    middleware.useHelmet();
    middleware.useTrustProxy();
    middleware.useCors();
    middleware.useRateLimit();
    middleware.useJson();
    middleware.useCookieSession();
    middleware.useUser();
  };

  static error = (app: Express) => {
    const middleware = new ErrorMiddleware(app);

    middleware.useError();
  };
}

export { Middlewares };
