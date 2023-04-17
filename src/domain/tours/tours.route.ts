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
      )
      .patch(
        AuthMiddleware.protect,
        AuthMiddleware.restrict(['manager', 'admin']),
        ValidatorService.validate(Validation.updateMany),
        controller.updateMany
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
        ValidatorService.validate(Validation.destroy),
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
          .upload(['jpg', 'jpeg', 'png', 'avif', 'svg', 'gif', 'bmp'])
          .single('photo'),
        ValidatorService.validate(Validation.addPhoto),
        controller.addPhoto
      );
  };
}

export const toursRoute = new Route();
