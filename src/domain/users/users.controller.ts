import { Request, Response } from 'express';
import { StatusCode } from 'constants/status-code';
import { Body } from 'domain/users/users.types';
import { Service } from 'domain/users/users.service';

class Controller {
  signup = async (req: Request<{}, {}, Body.signup>, res: Response) => {
    const { email, password } = req.body;

    const { data, token } = await Service.signup({ email, password });

    req.session = { token };

    res.status(StatusCode.Created).json({ data });
  };

  signin = async (req: Request<{}, {}, Body.signin>, res: Response) => {
    const { email, password } = req.body;

    const { data, token } = await Service.signin({ email, password });

    req.session = { token };

    res.status(StatusCode.Ok).json({ data });
  };

  signout = async (req: Request, res: Response) => {
    req.session = null;
    req.user = undefined;

    res.status(StatusCode.Ok).json({});
  };
}

export const controller = new Controller();
