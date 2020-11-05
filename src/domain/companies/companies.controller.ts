import { Request, Response } from 'express';
import { StatusCode } from 'constants/status-code';
import { Body } from 'domain/companies/companies.types';
import { Service } from 'domain/companies/companies.service';
import { Helpers } from 'utils/helpers';

class Controller {
  getAll = async (req: Request, res: Response) => {
    const { query } = req;

    const { data, meta } = await Service.getAll({ query });

    res.status(StatusCode.Ok).json({ meta, data });
  };

  getOne = async (req: Request, res: Response) => {
    const { id } = req.params;

    const { data } = await Service.getOne({ id });

    res.status(StatusCode.Ok).json({ data });
  };

  create = async (req: Request<{}, {}, Body.create>, res: Response) => {
    const body = Helpers.getBody<Body.create>(req);
    const { id } = req.user!;

    const { data } = await Service.create({
      userId: id,
      body,
    });

    res.status(StatusCode.Created).json({ data });
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { id: userId } = req.user!;
    const body = Helpers.getBody<Body.update>(req);

    const { data } = await Service.update({
      id,
      userId,
      body,
    });

    res.status(StatusCode.Ok).json({ data });
  };

  destroy = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { id: userId } = req.user!;

    await Service.destroy({ id, userId });

    res.status(StatusCode.NoContent).json({});
  };

  addLogo = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { id: userId } = req.user!;
    const { file } = req;

    const { data } = await Service.addLogo({ id, userId, file });

    res.status(StatusCode.Ok).json({ data });
  };
}

export const controller = new Controller();
