import { Response } from 'express';

import { CreatedResponse } from 'responses';
import { ValidatorService } from 'tools/services';
import { AppRequest } from 'types/common';

import { Service } from './tours.service';

interface Create {
  name: string;
  company: string;
}

class Controller {
  create = async (req: AppRequest, res: Response) => {
    const body = ValidatorService.getBody<Create>(req);

    const { data } = await Service.create({ body });

    return new CreatedResponse(res, data).send();
  };
}

export const controller = new Controller();
