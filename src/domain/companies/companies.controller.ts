import { Request, Response } from 'express';

import { ValidatorService } from 'tools/services';
import { AppRequest, Language } from 'types/common';
import {
  ListResponse,
  SuccessResponse,
  CreatedResponse,
  NoContentResponse,
} from 'responses';
import { Service } from 'domain/companies/companies.service';
import { Boat } from 'domain/companies/companies.types';

interface GetOne {
  params: {
    id: string;
  };
}

interface Destroy {
  params: {
    id: string;
  };
}

interface AddLogo {
  params: {
    id: string;
  };
}

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
    name?: string;
    phone?: string;
    email?: string;
    description?: string;
    website?: string;
    address?: string;
    location?: [number, number];
    languages?: Language[];
    boats?: Boat[];
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

    const { data } = await Service.getOne({ id: params.id });

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
    const { _id: userId } = req.user!;
    const { params } = ValidatorService.getData<Destroy['params']>(req);

    await Service.destroy({ id: params.id, userId });

    return new NoContentResponse(res).send();
  };

  addLogo = async (req: Request, res: Response) => {
    const { _id: userId } = req.user!;
    const { file } = req;
    const { params } = ValidatorService.getData<AddLogo['params']>(req);

    const { data } = await Service.addLogo({ id: params.id, userId, file });

    return new SuccessResponse(res, data).send();
  };
}

export const controller = new Controller();
