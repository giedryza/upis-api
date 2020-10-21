import { Router } from 'express';
import { BaseRoute } from 'utils/route.base';
import { controller } from 'domain/users/users.controller';
import { Validator } from 'utils/validator';
import { Validation } from 'domain/users/users.validation';

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
      .post(Validation.signup, Validator.validate, controller.signup);
    this.router
      .route('/signin')
      .post(Validation.signin, Validator.validate, controller.signin);
    this.router.route('/signout').post(controller.signout);
  };
}

export const route = new Route();