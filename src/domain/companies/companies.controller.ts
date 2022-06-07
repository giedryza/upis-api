import { Request, Response } from 'express';

import { ValidatorService } from 'tools/services';
import { AppRequest } from 'types/common';
import {
  ListResponse,
  SuccessResponse,
  CreatedResponse,
  NoContentResponse,
} from 'responses';
import { Body } from 'domain/companies/companies.types';
import { Service } from 'domain/companies/companies.service';

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

  create = async (req: AppRequest<{}, Body.create>, res: Response) => {
    const { body } = ValidatorService.getData<{}, Body.create>(req);
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
      { id: string },
      Body.update
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
}

export const controller = new Controller();
