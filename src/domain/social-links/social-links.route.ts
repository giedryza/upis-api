import { Router } from 'express';
import { BaseRoute } from 'routes/_base.route';
import { AuthMiddleware } from 'middlewares/auth.middleware';
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
      .post(
        AuthMiddleware.protect,
        Validation.create,
        Validator.catch,
        controller.create
      );
  };
}

export const socialLinksRoute = new Route();
