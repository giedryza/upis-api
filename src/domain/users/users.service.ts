import { Payload } from 'domain/users/users.types';
import { RequestValidationError, UnauthorizedError } from 'errors';
import { Jwt } from 'common/jwt';
import { User } from 'domain/users/users.model';
import { Password } from 'common/password';
import { Token } from 'domain/token/token.model';
import { emailService } from 'common/email.service';

export class Service {
  static signup = async ({ email, password }: Payload.signup) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new RequestValidationError([
        { param: 'email', msg: 'Email is taken. Try another.' },
      ]);
    }

    const user = new User({ email, password });
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
        token,
      },
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
          msg: 'Wrong password. Try again or click Forgot password to reset it.',
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
        token,
      },
    };
  };

  static me = async ({ user }: Payload.me) => {
    const data = user ?? null;

    return {
      data,
    };
  };

  static updatePassword = async ({
    userId,
    currentPassword,
    newPassword,
  }: Payload.updatePassword) => {
    const user = await User.findById(userId).select('+password');

    if (!user) {
      throw new UnauthorizedError();
    }

    const match = await Password.compare(user.password, currentPassword);

    if (!match) {
      throw new RequestValidationError([
        {
          param: 'password',
          msg: 'Wrong password. Try again or click Forgot password to reset it.',
        },
      ]);
    }

    user.set('password', newPassword);
    await user.save();
  };

  static forgotPassword = async ({ email }: Payload.forgotPassword) => {
    const user = await User.findOne({ email });

    if (!user) {
      throw new RequestValidationError([
        { param: 'email', msg: 'Incorrect email. Try again.' },
      ]);
    }

    const token = await Token.findOne({ user: user._id });

    if (token) {
      await token.deleteOne();
    }

    const resetToken = Password.randomString();
    const hashed = await Password.hash(resetToken);

    await new Token({
      user: user._id,
      token: hashed,
    }).save();

    const { href } = new URL(
      `${process.env.CLIENT_REDIRECT_ROUTE}?location=reset-password&token=${resetToken}&email=${user.email}`,
      process.env.HOST_CLIENT
    );

    await emailService.send({
      to: [user.email],
      subject: 'Password Reset',
      text: href,
    });

    return {
      data: {
        email: user.email,
      },
    };
  };
}
