import { Express } from 'express';

import { v1Route } from 'routes/v1.route';
import { NotFoundError } from 'errors/not-found.error';

export class Api {
  static v1 = (app: Express) => {
    app.use(v1Route.path, v1Route.router);
  };

  static all = (app: Express) => {
    app.all('*', () => {
      throw new NotFoundError('Route not found');
    });
  };
}
