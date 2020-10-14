import { Router } from 'express';
import { BaseRoute } from 'types/base/route.base';
import { controller } from 'domain/tours/tours.controller';
import { Middleware as AuthMiddleware } from 'domain/auth/auth.middleware';

class Route implements BaseRoute {
  router = Router({ caseSensitive: true });

  path = '/tours';

  constructor() {
    this.init();
  }

  init = () => {
    this.router
      .route('/')
      .get(AuthMiddleware.protect, controller.getTours)
      .post(controller.addTour);
  };
}

export const route = new Route();
