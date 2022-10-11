import { Request, Response } from 'express';

import { NoContentResponse, SuccessResponse } from 'responses';
import { ValidatorService } from 'tools/services';

import { Service } from './images.service';

interface Update {
  params: {
    id: string;
  };
  body: {
    description?: string;
  };
}

interface Destroy {
  params: {
    id: string;
  };
}

class Controller {
  update = async (req: Request, res: Response) => {
    const { params, body } = ValidatorService.getData<
      Update['params'],
      Update['body']
    >(req);

    const { data } = await Service.update({
      data: {
        id: params.id,
        description: body.description,
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
}

export const controller = new Controller();
