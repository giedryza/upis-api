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

interface Create {
  name: string;
  company: string;
}

interface Update {
  name: string;
  description: string;
  website: string;
  departure: string;
  arrival: string;
  distance: number;
  duration: number;
  days: number;
  difficulty: number;
}

interface UpdatePrice {
  amount?: number;
  currency?: Currency;
}

interface UpdateGeography {
  regions: Region[];
  rivers: string[];
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
    const { params } = ValidatorService.getData<{ id?: string }>(req);

    const { data } = await Service.getOne({ id: params.id });

    return new SuccessResponse(res, data).send();
  };

  create = async (req: AppRequest, res: Response) => {
    const { _id: userId } = req.user!;
    const { body } = ValidatorService.getData<{}, Create>(req);

    const { data } = await Service.create({ userId, body });

    return new CreatedResponse(res, data).send();
  };

  update = async (req: AppRequest, res: Response) => {
    const { params, body } = ValidatorService.getData<
      { id: string },
      Partial<Update>
    >(req);

    const { data } = await Service.update({ id: params.id, body });

    return new SuccessResponse(res, data).send();
  };

  destroy = async (req: AppRequest, res: Response) => {
    const { params } = ValidatorService.getData<{ id: string }>(req);

    await Service.destroy({ id: params.id });

    return new NoContentResponse(res).send();
  };

  updatePrice = async (req: AppRequest, res: Response) => {
    const { params, body } = ValidatorService.getData<
      { id: string },
      UpdatePrice
    >(req);

    const { data } = await Service.updatePrice({ id: params.id, body });

    return new SuccessResponse(res, data).send();
  };

  updateGeography = async (req: AppRequest, res: Response) => {
    const { params, body } = ValidatorService.getData<
      { id: string },
      UpdateGeography
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
