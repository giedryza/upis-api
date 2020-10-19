import { Router } from 'express';
import { BaseRoute } from 'utils/route.base';
import { controller } from 'domain/tours/tours.controller';
import { Middleware as UsersMiddleware } from 'domain/users/users.middleware';
import { Role } from 'domain/users/users.types';

class Route extends BaseRoute {
  router = Router({ caseSensitive: true });

  path = '/tours';

  constructor() {
    super();

    this.init();
  }

  protected init = () => {
    this.router
      .route('/')
      .get(
        UsersMiddleware.protect,
        UsersMiddleware.restrict([Role.Admin]),
        controller.getTours
      )
      .post(controller.addTour);
  };
}

export const route = new Route();
