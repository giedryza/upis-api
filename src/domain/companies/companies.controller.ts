import { Request, Response } from 'express';

import { ValidatorService } from 'tools/services';
import { AppRequest, Currency } from 'types/common';
import {
  ListResponse,
  SuccessResponse,
  CreatedResponse,
  NoContentResponse,
} from 'responses';
import { AmenityVariant, Unit } from 'domain/companies/companies.types';
import { Service } from 'domain/companies/companies.service';

interface Create {
  params: {};
  body: {
    name: string;
    phone: string;
    email: string;
    description?: string;
  };
}

interface Update {
  params: {
    id: string;
  };
  body: {
    name: string | undefined;
    phone: string | undefined;
    email: string | undefined;
    description: string | undefined;
    website: string | undefined;
    address: string | undefined;
    location: { coordinates: number[] } | undefined;
  };
}

interface AddAmenity {
  params: {
    id: string;
  };
  body: {
    variant: AmenityVariant;
    amount: number;
    currency: Currency;
    unit: Unit;
    info: string;
  };
}

interface UpdateAmenity {
  params: {
    id: string;
    amenityId: string;
  };
  body: {
    variant: AmenityVariant;
    amount: number;
    currency: Currency;
    unit: Unit;
    info: string;
  };
}

class Controller {
  getAll = async (req: Request, res: Response) => {
    const { query } = req;

    const { data, meta } = await Service.getAll({ query });

    return new ListResponse(res, data, meta).send();
  };

  getOne = async (req: Request, res: Response) => {
    const { id = '' } = req.params;

    const { data } = await Service.getOne({ id });

    return new SuccessResponse(res, data).send();
  };

  create = async (req: AppRequest<{}, Create['body']>, res: Response) => {
    const { body } = ValidatorService.getData<Create['params'], Create['body']>(
      req
    );
    const { _id } = req.user!;

    const { data } = await Service.create({
      userId: _id,
      body,
    });

    return new CreatedResponse(res, data).send();
  };

  update = async (req: Request, res: Response) => {
    const { _id: userId } = req.user!;
    const { params, body } = ValidatorService.getData<
      Update['params'],
      Update['body']
    >(req);

    const { data } = await Service.update({
      id: params.id,
      userId,
      body,
    });

    return new SuccessResponse(res, data).send();
  };

  destroy = async (req: Request, res: Response) => {
    const { id = '' } = req.params;
    const { _id: userId } = req.user!;

    await Service.destroy({ id, userId });

    return new NoContentResponse(res).send();
  };

  addLogo = async (req: Request, res: Response) => {
    const { id = '' } = req.params;
    const { _id: userId } = req.user!;
    const { file } = req;

    const { data } = await Service.addLogo({ id, userId, file });

    return new SuccessResponse(res, data).send();
  };

  addAmenity = async (req: Request, res: Response) => {
    const { params, body } = ValidatorService.getData<
      AddAmenity['params'],
      AddAmenity['body']
    >(req);

    const { data } = await Service.addAmenity({ id: params.id, body });

    return new SuccessResponse(res, data).send();
  };

  updateAmenity = async (req: Request, res: Response) => {
    const { params, body } = ValidatorService.getData<
      UpdateAmenity['params'],
      UpdateAmenity['body']
    >(req);

    const { data } = await Service.updateAmenity({
      id: params.id,
      amenityId: params.amenityId,
      body,
    });

    return new SuccessResponse(res, data).send();
  };
}

export const controller = new Controller();
