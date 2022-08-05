import { Response } from 'express';

import { AppRequest, Currency } from 'types/common';
import {
  CreatedResponse,
  ListResponse,
  NoContentResponse,
  SuccessResponse,
} from 'responses';
import { ValidatorService } from 'tools/services';
import { Region } from 'domain/tours/tours.types';

import { Service } from './tours.service';

interface GetOne {
  params: {
    id: string;
  };
}

interface Create {
  params: {};
  body: {
    name: string;
    company: string;
  };
}

interface Update {
  params: {
    id: string;
  };
  body: {
    name: string;
    description: string;
    website: string;
    departure: string;
    arrival: string;
    distance: number;
    duration: number;
    days: number;
    difficulty: number;
  };
}

interface Destroy {
  params: {
    id: string;
  };
}

interface UpdatePrice {
  params: {
    id: string;
  };
  body: {
    amount?: number;
    currency?: Currency;
  };
}

interface UpdateGeography {
  params: {
    id: string;
  };
  body: {
    regions: Region[];
    rivers: string[];
  };
}

interface UpdateAmenities {
  params: {
    id: string;
  };
  body: {
    amenities: string[];
  };
}

class Controller {
  getAll = async (req: AppRequest, res: Response) => {
    const { query } = req;

    const { data, meta } = await Service.getAll({ query });

    return new ListResponse(res, data, meta).send();
  };

  getOne = async (req: AppRequest, res: Response) => {
    const { params } = ValidatorService.getData<GetOne['params']>(req);

    const { data } = await Service.getOne({ id: params.id });

    return new SuccessResponse(res, data).send();
  };

  create = async (req: AppRequest, res: Response) => {
    const { _id: userId } = req.user!;
    const { body } = ValidatorService.getData<Create['params'], Create['body']>(
      req
    );

    const { data } = await Service.create({ userId, body });

    return new CreatedResponse(res, data).send();
  };

  update = async (req: AppRequest, res: Response) => {
    const { params, body } = ValidatorService.getData<
      Update['params'],
      Partial<Update['body']>
    >(req);

    const { data } = await Service.update({ id: params.id, body });

    return new SuccessResponse(res, data).send();
  };

  destroy = async (req: AppRequest, res: Response) => {
    const { params } = ValidatorService.getData<Destroy['params']>(req);

    await Service.destroy({ id: params.id });

    return new NoContentResponse(res).send();
  };

  updatePrice = async (req: AppRequest, res: Response) => {
    const { params, body } = ValidatorService.getData<
      UpdatePrice['params'],
      UpdatePrice['body']
    >(req);

    const { data } = await Service.updatePrice({ id: params.id, body });

    return new SuccessResponse(res, data).send();
  };

  updateGeography = async (req: AppRequest, res: Response) => {
    const { params, body } = ValidatorService.getData<
      UpdateGeography['params'],
      UpdateGeography['body']
    >(req);

    const { data } = await Service.updateGeography({ id: params.id, body });

    return new SuccessResponse(res, data).send();
  };

  updateAmenities = async (req: AppRequest, res: Response) => {
    const { params, body } = ValidatorService.getData<
      UpdateAmenities['params'],
      UpdateAmenities['body']
    >(req);

    const { data } = await Service.updateAmenities({
      id: params.id,
      amenities: body.amenities,
    });

    return new SuccessResponse(res, data).send();
  };
}

export const controller = new Controller();
