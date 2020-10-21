import { Router } from 'express';
import { BaseRoute } from 'utils/route.base';
import { controller } from 'domain/companies/companies.controller';
import { Middleware as UsersMiddleware } from 'domain/users/users.middleware';
import { Validator } from 'utils/validator';
import { Validation } from 'domain/companies/companies.validation';

class Route extends BaseRoute {
  router = Router({ caseSensitive: true });

  path = '/companies';

  constructor() {
    super();

    this.init();
  }

  protected init = () => {
    this.router
      .route('/')
      .get(controller.getAll)
      .post(
        UsersMiddleware.protect,
        Validation.create,
        Validator.validate,
        controller.create
      );

    this.router
      .route('/:id')
      .get(Validation.getOne, Validator.validate, controller.getOne)
      .patch(
        UsersMiddleware.protect,
        Validation.update,
        Validator.validate,
        controller.update
      )
      .delete(
        UsersMiddleware.protect,
        Validation.destroy,
        Validator.validate,
        controller.destroy
      );
  };
}

export const route = new Route();