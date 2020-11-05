import { Request, Response } from 'express';
import { SuccessResponse } from 'responses/success.response';
import { CreatedResponse } from 'responses/created.response';
import { NoContentResponse } from 'responses/no-content.response';
import { Body } from 'domain/users/users.types';
import { Service } from 'domain/users/users.service';

class Controller {
  signup = async (req: Request<{}, {}, Body.signup>, res: Response) => {
    const { email, password } = req.body;

    const { data, token } = await Service.signup({ email, password });

    req.session = { token };

    return new CreatedResponse(res, data).send();
  };

  signin = async (req: Request<{}, {}, Body.signin>, res: Response) => {
    const { email, password } = req.body;

    const { data, token } = await Service.signin({ email, password });

    req.session = { token };

    return new SuccessResponse(res, data).send();
  };

  signout = async (req: Request, res: Response) => {
    req.session = null;
    req.user = undefined;

    return new NoContentResponse(res).send();
  };
}

export const controller = new Controller();
