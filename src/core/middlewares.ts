import { Express } from 'express';
import { Common } from 'middlewares/common';

class Middlewares {
  static common = (app: Express) => {
    const middleware = new Common(app);

    middleware.useJson();
    middleware.useCors();
  };
}

export { Middlewares };
