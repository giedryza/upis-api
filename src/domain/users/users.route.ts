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
      .post(ValidatorService.validate(Validation.signup), controller.signup);
    this.router
      .route('/signin')
      .post(ValidatorService.validate(Validation.signin), controller.signin);
    this.router
      .route('/signin-with-token')
      .post(
        ValidatorService.validate(Validation.signinWithToken),
        controller.signinWithToken
      );
    this.router
      .route('/signin-with-google')
      .post(
        ValidatorService.validate(Validation.signinWithGoogle),
        controller.signinWithGoogle
      );
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
        ValidatorService.validate(Validation.updatePassword),
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
        ValidatorService.validate(Validation.resetPassword),
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
      .post(
        AuthMiddleware.protect,
        ValidatorService.validate(Validation.sendVerifyEmail),
        controller.sendVerifyEmail
      );
    this.router
      .route('/verify-email')
      .patch(
        ValidatorService.validate(Validation.verifyEmail),
        controller.verifyEmail
      );
  };
}

export const usersRoute = new Route();
