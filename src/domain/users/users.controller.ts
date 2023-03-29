import { Request, Response } from 'express';

import { SuccessResponse, CreatedResponse, NoContentResponse } from 'responses';
import { ValidatorService } from 'tools/services';

import { Service } from './users.service';
import { Validation } from './users.validation';

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
      data: {
        email: body.email,
        password: body.password,
      },
      t: req.t,
    });

    return new CreatedResponse(res, data).send();
  };

  signin = async (req: Request, res: Response) => {
    const { body } = ValidatorService.getData<{}, Signin['body']>(req);

    const { data } = await Service.signin({
      data: {
        email: body.email,
        password: body.password,
      },
      t: req.t,
    });

    return new SuccessResponse(res, data).send();
  };

  me = async (req: Request, res: Response) => {
    const { user } = ValidatorService.getParsedData<typeof Validation.me>(req);

    const { data } = await Service.me({
      data: {
        id: user._id,
      },
    });

    return new SuccessResponse(res, data).send();
  };

  updatePassword = async (req: Request, res: Response) => {
    const { _id: userId } = req.user!;
    const { body } = ValidatorService.getData<{}, UpdatePassword['body']>(req);

    await Service.updatePassword({
      data: {
        userId,
        currentPassword: body.currentPassword,
        newPassword: body.newPassword,
      },
      t: req.t,
    });

    return new NoContentResponse(res).send();
  };

  forgotPassword = async (req: Request, res: Response) => {
    const { body } = ValidatorService.getData<{}, ForgotPassword['body']>(req);

    const { data } = await Service.forgotPassword({
      data: {
        email: body.email,
      },
    });

    return new SuccessResponse(res, data).send();
  };

  resetPassword = async (req: Request, res: Response) => {
    const { body } = ValidatorService.getData<{}, ResetPassword['body']>(req);

    const { data } = await Service.resetPassword({
      data: {
        userId: body.userId,
        token: body.token,
        password: body.password,
      },
      t: req.t,
    });

    return new SuccessResponse(res, data).send();
  };

  updateRole = async (req: Request, res: Response) => {
    const { user, body } =
      ValidatorService.getParsedData<typeof Validation.updateRole>(req);

    const { data } = await Service.updateRole({
      data: {
        id: user._id,
        currentRole: user.role,
        newRole: body.role,
      },
      t: req.t,
    });

    return new SuccessResponse(res, data).send();
  };
}

export const controller = new Controller();
