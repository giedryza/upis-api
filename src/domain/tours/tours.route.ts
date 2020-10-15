import { Router } from 'express';
import { BaseRoute } from 'utils/route.base';
import { controller } from 'domain/tours/tours.controller';
import { Middleware as AuthMiddleware } from 'domain/auth/auth.middleware';
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
        AuthMiddleware.protect,
        AuthMiddleware.restrict([Role.Admin]),
        controller.getTours
      )
      .post(controller.addTour);
  };
}

export const route = new Route();
