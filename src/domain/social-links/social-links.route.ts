import { Router } from 'express';

import { BaseRoute } from 'routes/_base.route';
import { AuthMiddleware } from 'middlewares';
import { Validator } from 'common/validator';
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
      .get(Validation.getAll, Validator.catch, controller.getAll)
      .post(
        AuthMiddleware.protect,
        Validation.create,
        Validator.catch,
        controller.create
      );

    this.router
      .route('/:id')
      .get(Validation.getOneById, Validator.catch, controller.getOneById)
      .patch(
        AuthMiddleware.protect,
        AuthMiddleware.isOwner('social-link'),
        Validation.update,
        Validator.catch,
        controller.update
      )
      .delete(
        AuthMiddleware.protect,
        AuthMiddleware.isOwner('social-link'),
        Validation.destroy,
        Validator.catch,
        controller.destroy
      );
  };
}

export const socialLinksRoute = new Route();
