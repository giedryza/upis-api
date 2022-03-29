import { Router } from 'express';

import { BaseRoute } from 'routes/_base.route';
import { controller } from 'domain/users/users.controller';
import { Validator } from 'common/validator';
import { Validation } from 'domain/users/users.validation';
import { AuthMiddleware } from 'middlewares';

class Route extends BaseRoute {
  router = Router({ caseSensitive: true });

  path = '/users';

  constructor() {
    super();

    this.init();
  }

  protected init = () => {
    this.router
      .route('/signup')
      .post(Validation.signup, Validator.catch, controller.signup);
    this.router
      .route('/signin')
      .post(Validation.signin, Validator.catch, controller.signin);
    this.router.route('/me').get(AuthMiddleware.protect, controller.me);
    this.router
      .route('/update-password')
      .patch(
        AuthMiddleware.protect,
        Validation.updatePassword,
        Validator.catch,
        controller.updatePassword
      );
  };
}

export const usersRoute = new Route();
