import { Router } from 'express';

import { AuthMiddleware } from 'middlewares';
import { BaseRoute } from 'routes/_base.route';
import { ValidatorService } from 'tools/services';

import { controller } from './tours.controller';
import { Validation } from './tours.validation';

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
      .post(
        AuthMiddleware.protect,
        Validation.create,
        ValidatorService.catch,
        controller.create
      );
  };
}

export const toursRoute = new Route();
