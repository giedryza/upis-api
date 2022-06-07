import { Response } from 'express';

import { CreatedResponse, NoContentResponse, SuccessResponse } from 'responses';
import { ValidatorService } from 'tools/services';
import { AppRequest } from 'types/common';

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
  create = async (req: AppRequest, res: Response) => {
    const body = ValidatorService.getBody<Create>(req);

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
