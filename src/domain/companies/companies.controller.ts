import { Request, Response } from 'express';
import { Helpers } from 'common/helpers';
import { ListResponse } from 'responses/list.response';
import { SuccessResponse } from 'responses/success.response';
import { CreatedResponse } from 'responses/created.response';
import { NoContentResponse } from 'responses/no-content.response';
import { Body } from 'domain/companies/companies.types';
import { Service } from 'domain/companies/companies.service';

class Controller {
  getAll = async (req: Request, res: Response) => {
    const { query } = req;

    const { data, meta } = await Service.getAll({ query });

    return new ListResponse(res, data, meta).send();
  };

  getOneBySlug = async (req: Request, res: Response) => {
    const { slug = '' } = req.params;

    const { data } = await Service.getOneBySlug({ slug });

    return new SuccessResponse(res, data).send();
  };

  create = async (req: Request<{}, {}, Body.create>, res: Response) => {
    const body = Helpers.getBody<Body.create>(req);
    const { _id } = req.user!;

    const { data } = await Service.create({
      userId: _id,
      body,
    });

    return new CreatedResponse(res, data).send();
  };

  update = async (req: Request, res: Response) => {
    const { id = '' } = req.params;
    const { _id: userId } = req.user!;
    const body = Helpers.getBody<Body.update>(req);

    const { data } = await Service.update({
      id,
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
