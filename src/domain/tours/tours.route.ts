import { Router } from 'express';

import { AuthMiddleware } from 'middlewares';
import { BaseRoute } from 'routes/_base.route';
import { filesService, ValidatorService } from 'tools/services';

import { controller } from './tours.controller';
import { Validation } from './tours.validation';

class Route extends BaseRoute {
  router = Router({ caseSensitive: true });

  path = '/tours';

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

    this.router.route('/filters').get(controller.getFilters);

    this.router
      .route('/:id')
      .get(ValidatorService.validate(Validation.getOne), controller.getOne)
      .patch(
        AuthMiddleware.protect,
        AuthMiddleware.isOwner('tour'),
        Validation.update,
        ValidatorService.catch,
        controller.update
      )
      .delete(
        AuthMiddleware.protect,
        AuthMiddleware.isOwner('tour'),
        Validation.destroy,
        ValidatorService.catch,
        controller.destroy
      );

    this.router
      .route('/:id/price')
      .patch(
        AuthMiddleware.protect,
        AuthMiddleware.isOwner('tour'),
        Validation.updatePrice,
        ValidatorService.catch,
        controller.updatePrice
      );

    this.router
      .route('/:id/geography')
      .patch(
        AuthMiddleware.protect,
        AuthMiddleware.isOwner('tour'),
        Validation.updateGeography,
        ValidatorService.catch,
        controller.updateGeography
      );

    this.router
      .route('/:id/amenities')
      .patch(
        AuthMiddleware.protect,
        AuthMiddleware.isOwner('tour'),
        Validation.updateAmenities,
        ValidatorService.catch,
        controller.updateAmenities
      );

    this.router
      .route('/:id/photo')
      .patch(
        AuthMiddleware.protect,
        AuthMiddleware.isOwner('tour'),
        filesService('cloudinary')
          .upload([
            'image/jpeg',
            'image/png',
            'image/avif',
            'image/gif',
            'image/svg+xml',
            'image/bmp',
          ])
          .single('photo'),
        Validation.addPhoto,
        ValidatorService.catch,
        controller.addPhoto
      );
  };
}

export const toursRoute = new Route();
