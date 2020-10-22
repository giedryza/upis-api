import { Router } from 'express';
import { BaseRoute } from 'utils/route.base';
import { controller } from 'domain/companies/companies.controller';
import { Middleware as AuthMiddleware } from 'middlewares/auth.middleware';
import { Validator } from 'utils/validator';
import { Validation } from 'domain/companies/companies.validation';
import { upload } from 'utils/upload';

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
        AuthMiddleware.protect,
        Validation.create,
        Validator.validate,
        controller.create
      );

    this.router
      .route('/:id')
      .get(Validation.getOne, Validator.validate, controller.getOne)
      .patch(
        AuthMiddleware.protect,
        Validation.update,
        Validator.validate,
        controller.update
      )
      .delete(
        AuthMiddleware.protect,
        Validation.destroy,
        Validator.validate,
        controller.destroy
      );

    this.router
      .route('/:id/logo')
      .patch(
        AuthMiddleware.protect,
        Validation.addLogo,
        Validator.validate,
        upload.toS3(['image/jpeg', 'image/jpg', 'image/png']).single('logo'),
        controller.addLogo
      );
  };
}

export const route = new Route();
