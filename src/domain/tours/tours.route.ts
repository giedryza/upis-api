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
      .get(controller.getAll)
      .post(
        AuthMiddleware.protect,
        Validation.create,
        ValidatorService.catch,
        controller.create
      );

    this.router
      .route('/:id')
      .get(Validation.getOne, controller.getOne)
      .patch(
        AuthMiddleware.protect,
        Validation.update,
        ValidatorService.catch,
        controller.update
      )
      .delete(
        AuthMiddleware.protect,
        Validation.destroy,
        ValidatorService.catch,
        controller.destroy
      );

    this.router
      .route('/:id/price')
      .patch(
        AuthMiddleware.protect,
        Validation.updatePrice,
        ValidatorService.catch,
        controller.updatePrice
      );

    this.router
      .route('/:id/geography')
      .patch(
        AuthMiddleware.protect,
        Validation.updateGeography,
        ValidatorService.catch,
        controller.updateGeography
      );

    this.router
      .route('/:id/amenities')
      .patch(
        AuthMiddleware.protect,
        Validation.updateAmenities,
        ValidatorService.catch,
        controller.updateAmenities
      );

    this.router
      .route('/:id/photo')
      .patch(
        AuthMiddleware.protect,
        filesService
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

    this.router
      .route('/:id/photos')
      .patch(
        AuthMiddleware.protect,
        filesService
          .upload([
            'image/jpeg',
            'image/png',
            'image/avif',
            'image/gif',
            'image/svg+xml',
            'image/bmp',
          ])
          .array('photos', 5),
        Validation.updatePhotos,
        ValidatorService.catch,
        controller.updatePhotos
      );
  };
}

export const toursRoute = new Route();
