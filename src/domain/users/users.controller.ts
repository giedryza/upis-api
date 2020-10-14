import { Request, Response } from 'express';
import { StatusCode } from 'constants/status-code';
import { Body } from 'domain/users/users.types';
import { Service } from 'domain/users/users.service';

class Controller {
  signup = async (req: Request<{}, {}, Body.signup>, res: Response) => {
    const { email, password } = req.body;

    const { user, token } = await Service.signup({ email, password });

    req.session = { token };

    res.status(StatusCode.Ok).send(user);
  };
}

export const controller = new Controller();
