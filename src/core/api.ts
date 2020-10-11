import { Express } from 'express';
import { routes as routesV1 } from 'core/routes.v1';

class Api {
  private static apiV1 = '/api/v1';

  static v1 = (app: Express) => {
    app.use(Api.apiV1, routesV1.router);
  };
}

export { Api };
