import { Router } from 'express';
import { BaseRoute } from 'routes/_base.route';
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
      .post(Validation.signup, Validator.catch, controller.signup);
    this.router
      .route('/signin')
      .post(Validation.signin, Validator.catch, controller.signin);
    this.router.route('/signout').post(controller.signout);
  };
}

export const usersRoute = new Route();
