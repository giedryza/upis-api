import { Router } from 'express';
import { BaseRoute } from 'types/base/route.base';
import { controller } from 'domain/auth/auth.controller';
import { Validator } from 'utils/validator';
import { Validation } from 'domain/auth/auth.validation';

class Route implements BaseRoute {
  router = Router({ caseSensitive: true });

  path = '/auth';

  constructor() {
    this.init();
  }

  init = () => {
    this.router
      .route('/signup')
      .post(Validation.signup, Validator.validate, controller.signup);
    this.router
      .route('/signin')
      .post(Validation.signin, Validator.validate, controller.signin);
    this.router.route('/signout').post(controller.signout);
  };
}

export const route = new Route();
