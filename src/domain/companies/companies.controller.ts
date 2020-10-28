import { Request, Response } from 'express';
import { StatusCode } from 'constants/status-code';
import { Body, CompanyDocument } from 'domain/companies/companies.types';
import { Service } from 'domain/companies/companies.service';
import { Helpers } from 'utils/helpers';

class Controller {
  getAll = async (req: Request, res: Response) => {
    const { query } = req;

    const { data, meta } = await Service.getAll({ query });

    res.status(StatusCode.Ok).json({ meta, data });
  };

  getOne = async (req: Request, res: Response) => {
    const document = Helpers.getDocument<CompanyDocument>(req);

    const { data } = Service.getOne({ document });

    res.status(StatusCode.Ok).json({ data });
  };

  create = async (req: Request<{}, {}, Body.create>, res: Response) => {
    const body = Helpers.getBody<Body.create>(req);
    const { id } = req.user!;

    const { data } = await Service.create({
      user: id,
      update: body,
    });

    res.status(StatusCode.Created).json({ data });
  };

  update = async (req: Request, res: Response) => {
    const document = Helpers.getDocument<CompanyDocument>(req);
    const body = Helpers.getBody<Body.update>(req);

    const { data } = await Service.update({
      document,
      update: body,
    });

    res.status(StatusCode.Ok).json({ data });
  };

  destroy = async (req: Request, res: Response) => {
    const document = Helpers.getDocument<CompanyDocument>(req);

    await Service.destroy({ document });

    res.status(StatusCode.NoContent).json({});
  };

  addLogo = async (req: Request, res: Response) => {
    const document = Helpers.getDocument<CompanyDocument>(req);
    const logo = req.file?.location;

    const { data } = await Service.addLogo({ document, logo });

    res.json({ data });
  };
}

export const controller = new Controller();
