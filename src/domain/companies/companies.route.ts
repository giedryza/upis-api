import { Router } from 'express';
import { BaseRoute } from 'routes/_base.route';
import { controller } from 'domain/companies/companies.controller';
import { AuthMiddleware } from 'middlewares/auth.middleware';
import { fileStorage } from 'common/file-storage';
import { Validator } from 'common/validator';
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
        AuthMiddleware.protect,
        Validation.create,
        Validator.catch,
        controller.create
      );

    this.router.route('/:slug').get(controller.getOne);

    this.router
      .route('/:id')
      .patch(
        AuthMiddleware.protect,
        Validation.update,
        Validator.catch,
        controller.update
      )
      .delete(
        AuthMiddleware.protect,
        Validation.destroy,
        Validator.catch,
        controller.destroy
      );

    this.router
      .route('/:id/logo')
      .patch(
        AuthMiddleware.protect,
        Validation.addLogo,
        Validator.catch,
        fileStorage
          .upload(['image/jpeg', 'image/jpg', 'image/png'])
          .single('logo'),
        controller.addLogo
      );
  };
}

export const companiesRoute = new Route();
