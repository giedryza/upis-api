import { Router } from 'express';

import { BaseRoute } from 'routes/_base.route';
import { AuthMiddleware } from 'middlewares';
import { filesService, ValidatorService } from 'tools/services';

import { controller } from './providers.controller';
import { Validation } from './providers.validation';

class Route extends BaseRoute {
  router = Router({ caseSensitive: true });

  path = '/providers';

  constructor() {
    super();

    this.init();
  }

  protected init = () => {
    this.router
      .route('/')
      .get(ValidatorService.validate(Validation.getAll), controller.getAll)
      .post(
        AuthMiddleware.protect,
        AuthMiddleware.restrict(['manager', 'admin']),
        Validation.create,
        ValidatorService.catch,
        controller.create
      );

    this.router
      .route('/:id')
      .get(ValidatorService.validate(Validation.getOne), controller.getOne)
      .patch(
        AuthMiddleware.protect,
        AuthMiddleware.isOwner('provider'),
        Validation.update,
        ValidatorService.catch,
        controller.update
      )
      .delete(
        AuthMiddleware.protect,
        AuthMiddleware.isOwner('provider'),
        ValidatorService.validate(Validation.destroy),
        controller.destroy
      );

    this.router
      .route('/:id/logo')
      .patch(
        AuthMiddleware.protect,
        AuthMiddleware.isOwner('provider'),
        ValidatorService.validate(Validation.addLogo),
        filesService('cloudinary')
          .upload([
            'image/jpeg',
            'image/png',
            'image/avif',
            'image/svg+xml',
            'image/gif',
            'image/bmp',
          ])
          .single('logo'),
        controller.addLogo
      );

    this.router
      .route('/:id/socials')
      .post(
        AuthMiddleware.protect,
        AuthMiddleware.isOwner('provider'),
        Validation.createSocial,
        ValidatorService.catch,
        controller.createSocial
      )
      .patch(
        AuthMiddleware.protect,
        AuthMiddleware.isOwner('provider'),
        Validation.updateSocial,
        ValidatorService.catch,
        controller.updateSocial
      )
      .delete(
        AuthMiddleware.protect,
        AuthMiddleware.isOwner('provider'),
        ValidatorService.validate(Validation.destroySocial),
        controller.destroySocial
      );
  };
}

export const providersRoute = new Route();
