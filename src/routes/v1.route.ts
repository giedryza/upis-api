import { Router } from 'express';
import { BaseRoute } from 'routes/_base.route';
import { route as usersRoute } from 'domain/users/users.route';
import { route as companiesRoute } from 'domain/companies/companies.route';

class Route extends BaseRoute {
  router = Router({ caseSensitive: true });

  path = '/api/v1';

  constructor() {
    super();

    this.init();
  }

  init = () => {
    this.users();
    this.companies();
  };

  private users = () => {
    this.router.use(usersRoute.path, usersRoute.router);
  };

  private companies = () => {
    this.router.use(companiesRoute.path, companiesRoute.router);
  };
}

export const v1Route = new Route();
