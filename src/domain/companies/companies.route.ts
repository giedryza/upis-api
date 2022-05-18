import { Router } from 'express';

import { BaseRoute } from 'routes/_base.route';
import { controller } from 'domain/companies/companies.controller';
import { AuthMiddleware } from 'middlewares';
import { filesService, ValidatorService } from 'tools/services';
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
        ValidatorService.catch,
        controller.create
      );

    this.router
      .route('/:id')
      .get(controller.getOne)
      .patch(
        AuthMiddleware.protect,
        AuthMiddleware.isOwner('company'),
        Validation.update,
        ValidatorService.catch,
        controller.update
      )
      .delete(
        AuthMiddleware.protect,
        AuthMiddleware.isOwner('company'),
        Validation.destroy,
        ValidatorService.catch,
        controller.destroy
      );

    this.router
      .route('/:id/logo')
      .patch(
        AuthMiddleware.protect,
        AuthMiddleware.isOwner('company'),
        Validation.addLogo,
        ValidatorService.catch,
        filesService
          .upload(['image/jpeg', 'image/jpg', 'image/png'])
          .single('logo'),
        controller.addLogo
      );
  };
}

export const companiesRoute = new Route();
