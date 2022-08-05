import { Express } from 'express';

import { CommonMiddleware, ErrorMiddleware } from 'middlewares';

export class Middlewares {
  static common = (app: Express) => {
    const middleware = new CommonMiddleware(app);

    middleware.useHelmet();
    middleware.useTrustProxy();
    middleware.useCors();
    middleware.useRateLimit();
    middleware.useJson();
    middleware.useI18n();
  };

  static error = (app: Express) => {
    const middleware = new ErrorMiddleware(app);

    middleware.useError();
  };
}
