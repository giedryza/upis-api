import { Router } from 'express';
import { route as toursRoute } from 'domain/tours/tours.route';

class Routes {
  router = Router({ caseSensitive: true });

  constructor() {
    this.tours();
  }

  tours = () => {
    this.router.use(toursRoute.path, toursRoute.router);
  };
}

export const routes = new Routes();
