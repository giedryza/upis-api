import { Request, Response } from 'express';

import { SuccessResponse, CreatedResponse, NoContentResponse } from 'responses';
import { AppRequest } from 'types/common';
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

  forgotPassword = async (
    req: AppRequest<{}, Body.forgotPassword>,
    res: Response
  ) => {
    const { email } = req.body;

    const { data } = await Service.forgotPassword({ email });

    return new SuccessResponse(res, data).send();
  };

  resetPassword = async (
    req: AppRequest<{}, Body.resetPassword>,
    res: Response
  ) => {
    const { userId, token, password } = req.body;

    const { data } = await Service.resetPassword({ userId, token, password });

    return new SuccessResponse(res, data).send();
  };
}

export const controller = new Controller();
