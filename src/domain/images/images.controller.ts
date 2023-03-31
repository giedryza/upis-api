import { Request, Response } from 'express';

import { NoContentResponse, SuccessResponse } from 'responses';
import { ValidatorService } from 'tools/services';

import { Validation } from './images.validation';
import { Service } from './images.service';

class Controller {
  getOne = async (req: Request, res: Response) => {
    const { params } =
      ValidatorService.getParsedData<typeof Validation.getOne>(req);

    const { data } = await Service.getOne({
      data: {
        id: params.id,
      },
    });

    return new SuccessResponse(res, data).send();
  };

  update = async (req: Request, res: Response) => {
    const { params, body } =
      ValidatorService.getParsedData<typeof Validation.update>(req);

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
}

export const controller = new Controller();
