import { Request, Response } from 'express';

import { ValidatorService } from 'tools/services';
import { AppRequest, Language } from 'types/common';
import {
  ListResponse,
  SuccessResponse,
  CreatedResponse,
  NoContentResponse,
} from 'responses';

import { Service } from './providers.service';
import { Boat } from './providers.types';
import { Validation } from './providers.validation';

interface Create {
  params: {};
  body: {
    name: string;
    phone: string;
    email: string;
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

  create = async (req: AppRequest<{}, Create['body']>, res: Response) => {
    const { body, user } =
      ValidatorService.getParsedData<typeof Validation.create>(req);

    const { data } = await Service.create({
      data: {
        userId: user._id,
        name: body.name,
        phone: body.phone,
        email: body.email,
      },
      t: req.t,
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
      data: {
        id: params.id,
        userId,
        ...body,
      },
      t: req.t,
    });

    return new SuccessResponse(res, data).send();
  };

  destroy = async (req: Request, res: Response) => {
    const { params, user } =
      ValidatorService.getParsedData<typeof Validation.destroy>(req);

    await Service.destroy({
      data: { id: params.id, userId: user._id },
      t: req.t,
    });

    return new NoContentResponse(res).send();
  };

  addLogo = async (req: Request, res: Response) => {
    const { file } = req;
    const { params, user } =
      ValidatorService.getParsedData<typeof Validation.addLogo>(req);

    const { data } = await Service.addLogo({
      data: { id: params.id, userId: user._id, file },
      t: req.t,
    });

    return new SuccessResponse(res, data).send();
  };

  createSocial = async (req: Request, res: Response) => {
    const { params, body } =
      ValidatorService.getParsedData<typeof Validation.createSocial>(req);

    const { data } = await Service.createSocial({
      data: {
        id: params.id,
        type: body.type,
        url: body.url,
      },
      t: req.t,
    });

    return new CreatedResponse(res, data).send();
  };

  updateSocial = async (req: Request, res: Response) => {
    const { params, body } =
      ValidatorService.getParsedData<typeof Validation.updateSocial>(req);

    const { data } = await Service.updateSocial({
      data: {
        id: params.id,
        social: body,
      },
      t: req.t,
    });

    return new SuccessResponse(res, data).send();
  };

  destroySocial = async (req: Request, res: Response) => {
    const { params, body } =
      ValidatorService.getParsedData<typeof Validation.destroySocial>(req);

    const { data } = await Service.destroySocial({
      data: {
        providerId: params.id,
        socialId: body.id,
      },
      t: req.t,
    });

    return new SuccessResponse(res, data).send();
  };
}

export const controller = new Controller();
