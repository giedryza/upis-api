import { Express } from 'express';
import { Common } from 'middlewares/common.middleware';

class Middlewares {
  static common = (app: Express) => {
    const middleware = new Common(app);

    middleware.useJson();
    middleware.useCors();
  };
}

export { Middlewares };
