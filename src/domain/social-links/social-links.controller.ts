import { Request, Response } from 'express';

import { Helpers } from 'common/helpers';
import { Body } from 'domain/social-links/social-links.types';
import { Service } from 'domain/social-links/social-links.service';
import {
  CreatedResponse,
  NoContentResponse,
  SuccessResponse,
  ListResponse,
} from 'responses';

class Controller {
  getAll = async (req: Request, res: Response) => {
    const { query } = req;

    const { data, meta } = await Service.getAll({ query });

    return new ListResponse(res, data, meta).send();
  };

  getOneById = async (req: Request, res: Response) => {
    const { id = '' } = req.params;

    const { data } = await Service.getOneById({ id });

    return new SuccessResponse(res, data).send();
  };

  create = async (req: Request<{}, {}, Body.create>, res: Response) => {
    const body = Helpers.getBody<Body.create>(req);

    const { data } = await Service.create({
      body,
    });

    return new CreatedResponse(res, data).send();
  };

  update = async (req: Request, res: Response) => {
    const { id = '' } = req.params;
    const body = Helpers.getBody<Body.update>(req);

    const { data } = await Service.update({
      id,
      body,
    });

    return new SuccessResponse(res, data).send();
  };

  destroy = async (req: Request, res: Response) => {
    const { id = '' } = req.params;

    await Service.destroy({ id });

    return new NoContentResponse(res).send();
  };
}

export const controller = new Controller();
