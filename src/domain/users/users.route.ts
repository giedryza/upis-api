import { Router } from 'express';

import { BaseRoute } from 'routes/_base.route';
import { controller } from 'domain/users/users.controller';
import { ValidatorService } from 'tools/services';
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
      .post(Validation.signup, ValidatorService.catch, controller.signup);
    this.router
      .route('/signin')
      .post(Validation.signin, ValidatorService.catch, controller.signin);
    this.router.route('/me').get(AuthMiddleware.protect, controller.me);
    this.router
      .route('/update-password')
      .patch(
        AuthMiddleware.protect,
        Validation.updatePassword,
        ValidatorService.catch,
        controller.updatePassword
      );
    this.router
      .route('/forgot-password')
      .post(
        Validation.forgotPassword,
        ValidatorService.catch,
        controller.forgotPassword
      );
    this.router
      .route('/reset-password')
      .post(
        Validation.resetPassword,
        ValidatorService.catch,
        controller.resetPassword
      );
  };
}

export const usersRoute = new Route();
