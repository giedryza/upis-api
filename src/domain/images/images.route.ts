import { Router } from 'express';

import { AuthMiddleware } from 'middlewares';
import { BaseRoute } from 'routes/_base.route';
import { ValidatorService } from 'tools/services';

import { Validation } from './images.validation';
import { controller } from './images.controller';

class Route extends BaseRoute {
  router = Router({ caseSensitive: true });

  path = '/images';

  constructor() {
    super();

    this.init();
  }

  protected init = () => {
    this.router
      .route('/:id')
      .patch(
        AuthMiddleware.protect,
        Validation.update,
        ValidatorService.catch,
        controller.update
      )
      .delete(
        AuthMiddleware.protect,
        Validation.destroy,
        ValidatorService.catch,
        controller.destroy
      );
  };
}

export const imagesRoute = new Route();
