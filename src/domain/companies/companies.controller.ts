import { Request, Response } from 'express';
import { StatusCode } from 'constants/status-code';
import { Body, CompanyDocument } from 'domain/companies/companies.types';
import { Service } from 'domain/companies/companies.service';
import { RequestWithDocument } from 'types/express';

class Controller {
  getAll = async (_req: Request, res: Response) => {
    const { data, meta } = await Service.getAll();

    res.status(StatusCode.Ok).json({ meta, data });
  };

  getOne = async (req: Request, res: Response) => {
    const { document } = req as RequestWithDocument<CompanyDocument>;

    const { data } = Service.getOne({ document });

    res.status(StatusCode.Ok).json({ data });
  };

  create = async (req: Request<{}, {}, Body.create>, res: Response) => {
    const { name, phone, email, description } = req.body;
    const { id } = req.user!;

    const { data } = await Service.create({
      user: id,
      name,
      phone,
      email,
      description,
    });

    res.status(StatusCode.Created).json({ data });
  };

  update = async (req: Request, res: Response) => {
    const { document } = req as RequestWithDocument<CompanyDocument>;
    const {
      name,
      phone,
      email,
      description,
      website,
      social,
      address,
      location,
    } = req.body;

    const { data } = await Service.update({
      document,
      name,
      phone,
      email,
      website,
      social,
      location,
      description,
      address,
    });

    res.status(StatusCode.Ok).json({ data });
  };

  destroy = async (req: Request, res: Response) => {
    const { document } = req as RequestWithDocument<CompanyDocument>;

    await Service.destroy({ document });

    res.status(StatusCode.NoContent).json({});
  };

  addLogo = async (req: Request, res: Response) => {
    const { document } = req as RequestWithDocument<CompanyDocument>;
    const logo = req.file?.location;

    const { data } = await Service.addLogo({ document, logo });

    res.json({ data });
  };
}

export const controller = new Controller();
