import { Router } from 'express';
import { route as usersRoute } from 'domain/users/users.route';
import { route as companiesRoute } from 'domain/companies/companies.route';

class Routes {
  router = Router({ caseSensitive: true });

  constructor() {
    this.users();
    this.companies();
  }

  users = () => {
    this.router.use(usersRoute.path, usersRoute.router);
  };

  companies = () => {
    this.router.use(companiesRoute.path, companiesRoute.router);
  };
}

export const routes = new Routes();
