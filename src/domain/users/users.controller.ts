import { Request, Response } from 'express';

import { SuccessResponse, CreatedResponse, NoContentResponse } from 'responses';
import { Service } from 'domain/users/users.service';
import { ValidatorService } from 'tools/services';

interface Signup {
  body: {
    email: string;
    password: string;
  };
}

interface Signin {
  body: {
    email: string;
    password: string;
  };
}

interface UpdatePassword {
  body: {
    currentPassword: string;
    newPassword: string;
  };
}

interface ForgotPassword {
  body: {
    email: string;
  };
}

interface ResetPassword {
  body: {
    userId: string;
    token: string;
    password: string;
  };
}

class Controller {
  signup = async (req: Request, res: Response) => {
    const { body } = ValidatorService.getData<{}, Signup['body']>(req);

    const { data } = await Service.signup({
      email: body.email,
      password: body.password,
    });

    return new CreatedResponse(res, data).send();
  };

  signin = async (req: Request, res: Response) => {
    const { body } = ValidatorService.getData<{}, Signin['body']>(req);

    const { data } = await Service.signin({
      email: body.email,
      password: body.password,
    });

    return new SuccessResponse(res, data).send();
  };

  me = async (req: Request, res: Response) => {
    const { user } = req;

    const { data } = await Service.me({ user });

    return new SuccessResponse(res, data).send();
  };

  updatePassword = async (req: Request, res: Response) => {
    const { _id: userId } = req.user!;
    const { body } = ValidatorService.getData<{}, UpdatePassword['body']>(req);

    await Service.updatePassword({
      userId,
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
    });

    return new NoContentResponse(res).send();
  };

  forgotPassword = async (req: Request, res: Response) => {
    const { body } = ValidatorService.getData<{}, ForgotPassword['body']>(req);

    const { data } = await Service.forgotPassword({ email: body.email });

    return new SuccessResponse(res, data).send();
  };

  resetPassword = async (req: Request, res: Response) => {
    const { body } = ValidatorService.getData<{}, ResetPassword['body']>(req);

    const { data } = await Service.resetPassword({
      userId: body.userId,
      token: body.token,
      password: body.password,
    });

    return new SuccessResponse(res, data).send();
  };
}

export const controller = new Controller();
