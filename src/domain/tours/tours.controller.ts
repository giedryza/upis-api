import { Request, Response } from 'express';

import { Currency } from 'types/common';
import {
  CreatedResponse,
  ListResponse,
  NoContentResponse,
  SuccessResponse,
} from 'responses';
import { ValidatorService } from 'tools/services';

import { Validation } from './tours.validation';
import { Region } from './tours.types';
import { Service } from './tours.service';

interface Create {
  params: {};
  body: {
    name: string;
    provider: string;
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
    departure: [number, number];
    arrival: [number, number];
    distance: number;
    duration: number;
    days: number;
    difficulty: number;
    primaryPhoto: string;
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
  getAll = async (req: Request, res: Response) => {
    const { query } =
      ValidatorService.getParsedData<typeof Validation.getAll>(req);

    const { data, meta } = await Service.getAll({ query });

    return new ListResponse(res, data, meta).send();
  };

  getOne = async (req: Request, res: Response) => {
    const { params } =
      ValidatorService.getParsedData<typeof Validation.getOne>(req);

    const { data } = await Service.getOne({ data: { id: params.id } });

    return new SuccessResponse(res, data).send();
  };

  create = async (req: Request, res: Response) => {
    const { _id: userId } = req.user!;
    const { body } = ValidatorService.getData<Create['params'], Create['body']>(
      req
    );

    const { data } = await Service.create({
      data: {
        userId,
        ...body,
      },
      t: req.t,
    });

    return new CreatedResponse(res, data).send();
  };

  update = async (req: Request, res: Response) => {
    const { params, body } = ValidatorService.getData<
      Update['params'],
      Partial<Update['body']>
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
    const { params } =
      ValidatorService.getParsedData<typeof Validation.destroy>(req);

    await Service.destroy({
      data: {
        id: params.id,
      },
      t: req.t,
    });

    return new NoContentResponse(res).send();
  };

  updateMany = async (req: Request, res: Response) => {
    const { body, user } =
      ValidatorService.getParsedData<typeof Validation.updateMany>(req);

    await Service.updateMany({
      data: {
        filter: {
          user: user._id,
          provider: body.filter.provider,
        },
        update: body.update,
      },
      t: req.t,
    });

    return new NoContentResponse(res).send();
  };

  updatePrice = async (req: Request, res: Response) => {
    const { params, body } = ValidatorService.getData<
      UpdatePrice['params'],
      UpdatePrice['body']
    >(req);

    const { data } = await Service.updatePrice({
      data: {
        id: params.id,
        ...body,
      },
      t: req.t,
    });

    return new SuccessResponse(res, data).send();
  };

  updateGeography = async (req: Request, res: Response) => {
    const { params, body } = ValidatorService.getData<
      UpdateGeography['params'],
      UpdateGeography['body']
    >(req);

    const { data } = await Service.updateGeography({
      data: {
        id: params.id,
        ...body,
      },
      t: req.t,
    });

    return new SuccessResponse(res, data).send();
  };

  updateAmenities = async (req: Request, res: Response) => {
    const { params, body } = ValidatorService.getData<
      UpdateAmenities['params'],
      UpdateAmenities['body']
    >(req);

    const { data } = await Service.updateAmenities({
      data: {
        id: params.id,
        amenities: body.amenities,
      },
      t: req.t,
    });

    return new SuccessResponse(res, data).send();
  };

  addPhoto = async (req: Request, res: Response) => {
    const { params, body, user } =
      ValidatorService.getParsedData<typeof Validation.addPhoto>(req);

    const { data } = await Service.addPhoto({
      data: {
        id: params.id,
        userId: user._id,
        photo: req.file,
        description: body.description,
      },
      t: req.t,
    });

    return new SuccessResponse(res, data).send();
  };

  getFilters = async (req: Request, res: Response) => {
    const { data } = await Service.getFilters({ t: req.t });

    return new SuccessResponse(res, data).send();
  };
}

export const controller = new Controller();
