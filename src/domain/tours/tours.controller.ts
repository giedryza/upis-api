import { Response } from 'express';

import { AppRequest } from 'types/common';
import {
  CreatedResponse,
  ListResponse,
  NoContentResponse,
  SuccessResponse,
} from 'responses';
import { ValidatorService } from 'tools/services';

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
    const { body } = ValidatorService.getData<{}, Create>(req);

    const { data } = await Service.create({ body });

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
}

export const controller = new Controller();
