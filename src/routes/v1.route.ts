import { Router } from 'express';

import { BaseRoute } from 'routes/_base.route';
import { usersRoute } from 'domain/users/users.route';
import { companiesRoute } from 'domain/providers/providers.route';
import { socialLinksRoute } from 'domain/social-links/social-links.route';
import { toursRoute } from 'domain/tours/tours.route';
import { amenitiesRoute } from 'domain/amenities/amenities.route';
import { imagesRoute } from 'domain/images/images.route';

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
    this.tours();
    this.amenities();
    this.images();
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

  private tours = () => {
    this.router.use(toursRoute.path, toursRoute.router);
  };

  private amenities = () => {
    this.router.use(amenitiesRoute.path, amenitiesRoute.router);
  };

  private images = () => {
    this.router.use(imagesRoute.path, imagesRoute.router);
  };
}

export const v1Route = new Route();
