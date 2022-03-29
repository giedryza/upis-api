import { Router } from 'express';

import { BaseRoute } from 'routes/_base.route';
import { usersRoute } from 'domain/users/users.route';
import { companiesRoute } from 'domain/companies/companies.route';
import { socialLinksRoute } from 'domain/social-links/social-links.route';

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
    this.socialLinks();
  };

  private users = () => {
    this.router.use(usersRoute.path, usersRoute.router);
  };

  private companies = () => {
    this.router.use(companiesRoute.path, companiesRoute.router);
  };

  private socialLinks = () => {
    this.router.use(socialLinksRoute.path, socialLinksRoute.router);
  };
}

export const v1Route = new Route();
