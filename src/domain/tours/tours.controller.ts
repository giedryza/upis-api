import { Request, Response } from 'express';

import { Currency } from 'types/common';
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

interface AddPhoto {
  params: {
    id: string;
  };
  body: {
    description?: string;
  };
}

class Controller {
  getAll = async (req: Request, res: Response) => {
    const { query } = req;

    const { data, meta } = await Service.getAll({ query });

    return new ListResponse(res, data, meta).send();
  };

  getOne = async (req: Request, res: Response) => {
    const { params } = ValidatorService.getData<GetOne['params']>(req);

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
    const { params } = ValidatorService.getData<Destroy['params']>(req);

    await Service.destroy({
      data: {
        id: params.id,
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
    const { params, body } = ValidatorService.getData<
      AddPhoto['params'],
      AddPhoto['body']
    >(req);

    const { data } = await Service.addPhoto({
      data: {
        id: params.id,
        userId: req.user?._id!,
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
