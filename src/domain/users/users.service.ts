import { Payload } from 'domain/users/users.types';
import { RequestValidationError } from 'errors/request-validation.error';
import { Jwt } from 'common/jwt';
import { User } from 'domain/users/users.model';
import { Password } from 'common/password';
import { Utils } from 'common/utils';

export class Service {
  static signup = async ({ email, password }: Payload.signup) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new RequestValidationError([
        { param: 'email', msg: 'Email is taken. Try another.' },
      ]);
    }

    const user = User.construct({ email, password });
    await user.save();

    const baseUser = {
      _id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = Jwt.token(baseUser);

    return {
      data: {
        user: baseUser,
        timestamp: Jwt.timestamp,
      },
      token,
    };
  };

  static signin = async ({ email, password }: Payload.signin) => {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new RequestValidationError([
        { param: 'email', msg: 'Incorrect email. Try again.' },
      ]);
    }

    const match = await Password.compare(user.password, password);

    if (!match) {
      throw new RequestValidationError([
        {
          param: 'password',
          msg:
            'Wrong password. Try again or click Forgot password to reset it.',
        },
      ]);
    }

    const baseUser = {
      _id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = Jwt.token(baseUser);

    return {
      data: {
        user: baseUser,
        timestamp: Jwt.timestamp,
      },
      token,
    };
  };

  static me = async ({ user }: Payload.me) => {
    const data = user
      ? {
          user: {
            _id: user._id,
            email: user.email,
            role: user.role,
          },
          timestamp: {
            iat: user.iat,
            exp: user.exp,
          },
        }
      : {
          user: null,
          timestamp: {
            iat: Utils.nowInSeconds,
            exp: null,
          },
        };

    return {
      data,
    };
  };
}
