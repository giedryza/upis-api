import { Router } from 'express';

import { BaseRoute } from 'routes/_base.route';
import { AuthMiddleware } from 'middlewares';
import { ValidatorService } from 'tools/services';

import { Validation } from './amenities.validation';
import { controller } from './amenities.controller';

class Route extends BaseRoute {
  router = Router({ caseSensitive: true });

  path = '/amenities';

  constructor() {
    super();

    this.init();
  }

  protected init = () => {
    this.router
      .route('/')
      .post(
        AuthMiddleware.protect,
        AuthMiddleware.restrict(['manager', 'admin']),
        Validation.create,
        ValidatorService.catch,
        controller.create
      );

    this.router
      .route('/:id')
      .get(Validation.getOne, controller.getOne)
      .patch(
        AuthMiddleware.protect,
        AuthMiddleware.isOwner('amenity'),
        Validation.update,
        ValidatorService.catch,
        controller.update
      )
      .delete(
        AuthMiddleware.protect,
        AuthMiddleware.isOwner('amenity'),
        Validation.destroy,
        ValidatorService.catch,
        controller.destroy
      );
  };
}

export const amenitiesRoute = new Route();
