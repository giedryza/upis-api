import { Express } from 'express';
import { CommonMiddleware } from 'middlewares/common.middleware';
import { ErrorMiddleware } from 'middlewares/error.middleware';

class Middlewares {
  static common = (app: Express) => {
    const middleware = new CommonMiddleware(app);

    middleware.useTrustProxy();
    middleware.useJson();
    middleware.useCors();
    middleware.useCookieSession();
    middleware.useCurrentUser();
  };

  static error = (app: Express) => {
    const middleware = new ErrorMiddleware(app);

    middleware.useError();
  };
}

export { Middlewares };
