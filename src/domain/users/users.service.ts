import { Payload } from 'domain/users/users.types';
import { BadRequestError } from 'errors/bad-request.error';
import { Jwt } from 'utils/jwt';
import { User } from 'domain/users/users.model';

export class Service {
  static signup = async ({ email, password }: Payload.signup) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email is taken. Try another.');
    }

    const user = User.construct({ email, password });
    await user.save();

    const token = Jwt.token({ id: user.id, email: user.email });

    return {
      user: {
        _id: user.id,
        email: user.email,
      },
      token,
    };
  };
}
