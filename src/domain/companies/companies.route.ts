import { Router } from 'express';
import { BaseRoute } from 'routes/_base.route';
import { controller } from 'domain/companies/companies.controller';
import { AuthMiddleware } from 'middlewares/auth.middleware';
import { Validator } from 'utils/validator';
import { Validation } from 'domain/companies/companies.validation';
import { fileStorage } from 'utils/file-storage';
import { DocumentMiddleware } from 'middlewares/document.middleware';
import { Company } from 'domain/companies/companies.model';

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

    this.router
      .route('/:id')
      .get(
        Validation.getOne,
        Validator.catch,
        DocumentMiddleware.exists(Company),
        controller.getOne
      )
      .patch(
        AuthMiddleware.protect,
        Validation.update,
        Validator.catch,
        DocumentMiddleware.exists(Company),
        DocumentMiddleware.isOwner,
        controller.update
      )
      .delete(
        AuthMiddleware.protect,
        Validation.destroy,
        Validator.catch,
        DocumentMiddleware.exists(Company),
        DocumentMiddleware.isOwner,
        controller.destroy
      );

    this.router
      .route('/:id/logo')
      .patch(
        AuthMiddleware.protect,
        Validation.addLogo,
        Validator.catch,
        DocumentMiddleware.exists(Company),
        DocumentMiddleware.isOwner,
        fileStorage
          .upload(['image/jpeg', 'image/jpg', 'image/png'])
          .single('logo'),
        controller.addLogo
      );
  };
}

export const route = new Route();
