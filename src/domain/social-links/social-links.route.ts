import { Router } from 'express';

import { BaseRoute } from 'routes/_base.route';
import { AuthMiddleware } from 'middlewares';
import { ValidatorService } from 'tools/services';
import { controller } from 'domain/social-links/social-links.controller';
import { Validation } from 'domain/social-links/social-links.validation';

class Route extends BaseRoute {
  router = Router({ caseSensitive: true });

  path = '/social-links';

  constructor() {
    super();

    this.init();
  }

  protected init = () => {
    this.router
      .route('/')
      .get(Validation.getAll, ValidatorService.catch, controller.getAll)
      .post(
        AuthMiddleware.protect,
        Validation.create,
        ValidatorService.catch,
        controller.create
      );

    this.router
      .route('/:id')
      .get(Validation.getOneById, ValidatorService.catch, controller.getOneById)
      .patch(
        AuthMiddleware.protect,
        AuthMiddleware.isOwner('social-link'),
        Validation.update,
        ValidatorService.catch,
        controller.update
      )
      .delete(
        AuthMiddleware.protect,
        AuthMiddleware.isOwner('social-link'),
        Validation.destroy,
        ValidatorService.catch,
        controller.destroy
      );
  };
}

export const socialLinksRoute = new Route();
