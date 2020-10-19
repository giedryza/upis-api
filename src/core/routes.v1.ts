import { Router } from 'express';
import { route as toursRoute } from 'domain/tours/tours.route';
import { route as usersRoute } from 'domain/users/users.route';

class Routes {
  router = Router({ caseSensitive: true });

  constructor() {
    this.users();
    this.tours();
  }

  users = () => {
    this.router.use(usersRoute.path, usersRoute.router);
  };

  tours = () => {
    this.router.use(toursRoute.path, toursRoute.router);
  };
}

export const routes = new Routes();
