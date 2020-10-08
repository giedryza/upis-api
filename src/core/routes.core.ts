import { Express } from 'express';
import { route as toursRoute } from 'domain/tours/tours.route';

class Routes {
  private static prefix = '/api/v1';

  private static path = (name: string) => `${Routes.prefix}/${name}`;

  static tours = (app: Express) => {
    app.use(Routes.path(toursRoute.name), toursRoute.router);
  };
}

export { Routes };
