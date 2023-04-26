import { Router } from 'express';

import { BaseRoute } from 'routes/_base.route';
import { ValidatorService } from 'tools/services';
import { AuthMiddleware } from 'middlewares';

import { Validation } from './users.validation';
import { controller } from './users.controller';

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
    this.router
      .route('/me')
      .get(
        AuthMiddleware.protect,
        ValidatorService.validate(Validation.me),
        controller.me
      );
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
        ValidatorService.validate(Validation.forgotPassword),
        controller.forgotPassword
      );
    this.router
      .route('/reset-password')
      .post(
        Validation.resetPassword,
        ValidatorService.catch,
        controller.resetPassword
      );
    this.router
      .route('/become-provider')
      .patch(
        AuthMiddleware.protect,
        ValidatorService.validate(Validation.becomeProvider),
        controller.becomeProvider
      );
    this.router
      .route('/send-verify-email')
      .patch(
        AuthMiddleware.protect,
        ValidatorService.validate(Validation.sendVerifyEmail),
        controller.sendVerifyEmail
      );
  };
}

export const usersRoute = new Route();
