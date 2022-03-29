import { Request, Response } from 'express';

import { SuccessResponse } from 'responses/success.response';
import { CreatedResponse } from 'responses/created.response';
import { NoContentResponse } from 'responses/no-content.response';
import { Body } from 'domain/users/users.types';
import { Service } from 'domain/users/users.service';

class Controller {
  signup = async (req: Request<{}, {}, Body.signup>, res: Response) => {
    const { email, password } = req.body;

    const { data } = await Service.signup({ email, password });

    return new CreatedResponse(res, data).send();
  };

  signin = async (req: Request<{}, {}, Body.signin>, res: Response) => {
    const { email, password } = req.body;

    const { data } = await Service.signin({ email, password });

    return new SuccessResponse(res, data).send();
  };

  me = async (req: Request, res: Response) => {
    const { user } = req;

    const { data } = await Service.me({ user });

    return new SuccessResponse(res, data).send();
  };

  updatePassword = async (
    req: Request<{}, {}, Body.updatePassword>,
    res: Response
  ) => {
    const { currentPassword, newPassword } = req.body;
    const { _id: userId } = req.user!;

    await Service.updatePassword({
      userId,
      currentPassword,
      newPassword,
    });

    return new NoContentResponse(res).send();
  };
}

export const controller = new Controller();
