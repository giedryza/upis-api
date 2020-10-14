import { Router } from 'express';

import { BaseRoute } from 'types/base/route.base';
import { controller } from 'domain/users/users.controller';

class Route implements BaseRoute {
  router = Router({ caseSensitive: true });

  path = '/users';

  constructor() {
    this.init();
  }

  init = () => {
    this.router.route('/signup').post(controller.signup);
    this.router.route('/signin').post(controller.signin);
    this.router.route('/signout').post(controller.signout);
  };
}

export const route = new Route();
