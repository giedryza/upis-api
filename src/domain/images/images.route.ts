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
      .get(ValidatorService.validate(Validation.getOne), controller.getOne)
      .patch(
        AuthMiddleware.protect,
        AuthMiddleware.isOwner('image'),
        ValidatorService.validate(Validation.update),
        controller.update
      )
      .delete(
        AuthMiddleware.protect,
        AuthMiddleware.isOwner('image'),
        ValidatorService.validate(Validation.destroy),
        controller.destroy
      );
  };
}

export const imagesRoute = new Route();
