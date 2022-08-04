import { Request, Response } from 'express';

import { ValidatorService } from 'tools/services';
import { Currency } from 'types/common';
import { SuccessResponse, NoContentResponse } from 'responses';

import { Service } from './amenities.service';
import { Variant, Unit } from './amenities.types';

interface GetOne {
  params: {
    id: string;
  };
}

interface Create {
  params: {};
  body: {
    variant: Variant;
    amount: number;
    currency: Currency;
    unit: Unit;
    info: string;
    companyId: string;
  };
}

interface Update {
  params: {
    id: string;
  };
  body: {
    variant: Variant;
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
    const { params } = ValidatorService.getData<GetOne['params']>(req);

    const { data } = await Service.getOne({
      id: params.id,
    });

    return new SuccessResponse(res, data).send();
  };

  create = async (req: Request, res: Response) => {
    const { body } = ValidatorService.getData<Create['params'], Create['body']>(
      req
    );

    const { data } = await Service.create(body);

    return new SuccessResponse(res, data).send();
  };

  update = async (req: Request, res: Response) => {
    const { params, body } = ValidatorService.getData<
      Update['params'],
      Update['body']
    >(req);

    const { data } = await Service.update({
      id: params.id,
      ...body,
    });

    return new SuccessResponse(res, data).send();
  };

  destroy = async (req: Request, res: Response) => {
    const { params } = ValidatorService.getData<Destroy['params']>(req);

    await Service.destroy({
      id: params.id,
    });

    return new NoContentResponse(res).send();
  };
}

export const controller = new Controller();
