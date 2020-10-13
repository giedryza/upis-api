import { Request, Response } from 'express';
import { User } from 'domain/users/users.model';
import { BadRequestError } from 'errors/bad-request.error';
import { StatusCode } from 'constants/status-code';
import { Jwt } from 'utils/jwt';
import { Body } from 'domain/users/users.types';

class Controller {
  signup = async (req: Request<{}, {}, Body.signup>, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email is taken. Try another.');
    }

    const user = User.construct({ email, password });
    await user.save();

    const token = Jwt.token({ id: user.id, email: user.email });

    req.session = { token };

    res.status(StatusCode.Ok).send({ _id: user.id, email: user.email });
  };
}

export const controller = new Controller();
