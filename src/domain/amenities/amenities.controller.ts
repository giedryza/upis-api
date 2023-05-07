import { Request, Response } from 'express';

import { ValidatorService } from 'tools/services';
import { Currency } from 'types/common';
import { SuccessResponse, NoContentResponse } from 'responses';

import { Service } from './amenities.service';
import { Variant, Unit } from './amenities.types';
import { Validation } from './amenities.validation';

interface Create {
  params: {};
  body: {
    variant: Variant;
    amount: number;
    currency: Currency;
    unit: Unit;
    info: string;
    providerId: string;
  };
}

interface Update {
  params: {
    id: string;
  };
  body: {
    amount: number;
    currency: Currency;
    unit: Unit;
    info: string;
  };
}

interface Destroy {
  params: {
    id: string;
  };
}

class Controller {
  getOne = async (req: Request, res: Response) => {
    const { params } =
      ValidatorService.getParsedData<typeof Validation.getOne>(req);

    const { data } = await Service.getOne({
      data: {
        id: params.id,
      },
    });

    return new SuccessResponse(res, data).send();
  };

  create = async (req: Request, res: Response) => {
    const { body } = ValidatorService.getData<Create['params'], Create['body']>(
      req
    );

    const { data } = await Service.create({
      data: { ...body, user: req.user!._id },
      t: req.t,
    });

    return new SuccessResponse(res, data).send();
  };

  update = async (req: Request, res: Response) => {
    const { params, body } = ValidatorService.getData<
      Update['params'],
      Update['body']
    >(req);

    const { data } = await Service.update({
      data: {
        id: params.id,
        ...body,
      },
      t: req.t,
    });

    return new SuccessResponse(res, data).send();
  };

  destroy = async (req: Request, res: Response) => {
    const { params } = ValidatorService.getData<Destroy['params']>(req);

    await Service.destroy({
      data: {
        id: params.id,
      },
      t: req.t,
    });

    return new NoContentResponse(res).send();
  };
}

export const controller = new Controller();
