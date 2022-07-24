import { Router } from 'express';

import { AuthMiddleware } from 'middlewares';
import { BaseRoute } from 'routes/_base.route';
import { ValidatorService } from 'tools/services';

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
  };
}

export const toursRoute = new Route();
