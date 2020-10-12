import { Express } from 'express';
import { routes as routesV1 } from 'core/routes.v1';
import { NotFoundError } from 'errors/not-found.error';

class Api {
  private static apiV1 = '/api/v1';

  static v1 = (app: Express) => {
    app.use(Api.apiV1, routesV1.router);
  };

  static all = (app: Express) => {
    app.all('*', () => {
      throw new NotFoundError('Route not found');
    });
  };
}

export { Api };
