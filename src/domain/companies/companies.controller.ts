import { Request, Response } from 'express';
import { StatusCode } from 'constants/status-code';
import { Body } from 'domain/companies/companies.types';
import { Service } from 'domain/companies/companies.service';
import { MulterS3Request } from 'types/express';

class Controller {
  getAll = async (_req: Request, res: Response) => {
    const { data, meta } = await Service.getAll();

    res.status(StatusCode.Ok).json({ meta, data });
  };

  getOne = async (req: Request, res: Response) => {
    const { id } = req.params;

    const { data } = await Service.getOne({ id });

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
    const { id } = req.params;
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
      id,
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
    const { id } = req.params;

    await Service.destroy({ id });

    res.status(StatusCode.NoContent).json({});
  };

  logo = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { location } = (req as Request & MulterS3Request).file;

    const { data } = await Service.logo({ id, location });

    res.json({ data });
  };
}

export const controller = new Controller();
