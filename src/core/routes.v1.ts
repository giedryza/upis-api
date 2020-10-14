import { Router } from 'express';
import { route as toursRoute } from 'domain/tours/tours.route';
import { route as authRoute } from 'domain/auth/auth.route';

class Routes {
  router = Router({ caseSensitive: true });

  constructor() {
    this.tours();
    this.auth();
  }

  tours = () => {
    this.router.use(toursRoute.path, toursRoute.router);
  };

  auth = () => {
    this.router.use(authRoute.path, authRoute.router);
  };
}

export const routes = new Routes();
