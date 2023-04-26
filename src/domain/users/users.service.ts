import { TFunction } from 'i18next';

import { APP } from 'config';
import {
  BadRequestError,
  RequestValidationError,
  UnauthorizedError,
} from 'errors';
import { JwtService, PasswordService } from 'tools/services';
import { ResetPasswordEmail, VerifyEmailEmail } from 'emails';
import { Service as TokenService } from 'domain/token/token.service';
import { EntityId } from 'types/common';

import { Role, UserRecord } from './users.types';
import { User } from './users.model';

interface Signup {
  data: {
    email: string;
    password: string;
  };
  t: TFunction;
}

interface Signin {
  data: {
    email: string;
    password: string;
  };
  t: TFunction;
}

interface Me {
  data: {
    id: string;
  };
}

interface UpdatePassword {
  data: {
    userId: EntityId;
    currentPassword: string;
    newPassword: string;
  };
  t: TFunction;
}

interface ForgotPassword {
  data: {
    email: string;
  };
}

interface ResetPassword {
  data: {
    userId: string;
    token: string;
    password: string;
  };
  t: TFunction;
}

interface BecomeProvider {
  data: {
    id: string;
    currentRole: Role;
    newRole: Role;
  };
  t: TFunction;
}

interface SendVerifyEmail {
  data: {
    id: string;
    email: string;
  };
}

interface VerifyEmail {
  data: {
    userId: string;
    token: string;
  };
  t: TFunction;
}

export class Service {
  static signup = async ({ data: { email, password }, t }: Signup) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new RequestValidationError([
        { param: 'email', msg: t('users.errors.email.taken') },
      ]);
    }

    const user = new User({ email, password });
    await user.save();

    if (APP.features.isVerifyEmailEnabled) {
      await Service.sendVerifyEmail({
        data: { id: user._id, email: user.email },
      });
    }

    const baseUser = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };
    const jwt = JwtService.token(baseUser);

    return {
      data: {
        user: baseUser,
        token: jwt,
      },
    };
  };

  static signin = async ({ data: { email, password }, t }: Signin) => {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new RequestValidationError([
        { param: 'email', msg: t('users.errors.password.wrong') },
      ]);
    }

    const match = await PasswordService.compare(user.password, password);

    if (!match) {
      throw new RequestValidationError([
        {
          param: 'password',
          msg: t('users.errors.password.wrong'),
        },
      ]);
    }

    const baseUser = {
      _id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = JwtService.token(baseUser);

    return {
      data: {
        user: baseUser,
        token,
      },
    };
  };

  static me = async ({
    data: { id },
  }: Me): Promise<{ data: UserRecord | null }> => {
    const user = await User.findById(id).lean();

    if (!user) {
      return { data: null };
    }

    return {
      data: user,
    };
  };

  static updatePassword = async ({
    data: { userId, currentPassword, newPassword },
    t,
  }: UpdatePassword) => {
    const user = await User.findById(userId).select('+password');

    if (!user) {
      throw new UnauthorizedError();
    }

    const match = await PasswordService.compare(user.password, currentPassword);

    if (!match) {
      throw new RequestValidationError([
        {
          param: 'password',
          msg: t('users.errors.password.wrong'),
        },
      ]);
    }

    user.set('password', newPassword);
    await user.save();
  };

  static forgotPassword = async ({ data: { email } }: ForgotPassword) => {
    const user = await User.findOne({ email });

    if (!user) {
      return {
        data: null,
      };
    }

    const { token } = await TokenService.create({ user: user._id });

    if (!token) {
      return {
        data: null,
      };
    }

    const url = new URL(APP.client.route, APP.client.host);
    const params = {
      location: APP.client.locations.passwordReset,
      token,
      userId: user._id,
    };

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    await new ResetPasswordEmail({
      email: user.email,
      url: url.href,
    }).send([user.email]);

    return {
      data: {
        email: user.email,
      },
    };
  };

  static resetPassword = async ({
    data: { userId, token, password },
    t,
  }: ResetPassword) => {
    const { match } = await TokenService.compare({ user: userId, token });

    if (!match) {
      throw new BadRequestError(t('users.errors.password.reset'));
    }

    const hashed = await PasswordService.hash(password);

    if (!hashed) {
      throw new BadRequestError(t('users.errors.password.reset'));
    }

    await User.updateOne(
      { _id: userId },
      { $set: { password: hashed } },
      { new: true }
    );

    return {
      data: {
        id: userId,
      },
    };
  };

  static becomeProvider = async ({
    data: { id, currentRole, newRole },
    t,
  }: BecomeProvider): Promise<{
    data: { user: UserRecord; token: string };
  }> => {
    if (currentRole !== 'user' || newRole !== 'manager') {
      throw new BadRequestError(t('users.errors.role.invalid'));
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role: newRole },
      { new: true }
    ).lean();

    if (!user) {
      throw new BadRequestError(t('users.errors.role.invalid'));
    }

    const token = JwtService.token({
      _id: user._id,
      email: user.email,
      role: user.role,
    });

    return {
      data: {
        user,
        token,
      },
    };
  };

  static sendVerifyEmail = async ({ data: { id, email } }: SendVerifyEmail) => {
    const { token } = await TokenService.create({ user: id });

    const url = new URL(APP.client.route, APP.client.host);
    const params = {
      location: APP.client.locations.verifyEmail,
      token,
      userId: id,
    };

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    await new VerifyEmailEmail({
      url: url.href,
    }).send([email]);

    return {
      data: { email },
    };
  };

  static verifyEmail = async ({ data: { userId, token }, t }: VerifyEmail) => {
    const { match } = await TokenService.compare({ user: userId, token });

    if (!match) {
      throw new BadRequestError(t('users.errors.verify_email'));
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role: 'user' },
      { new: true }
    ).lean();

    if (!user) {
      throw new BadRequestError(t('users.errors.verify_email'));
    }

    const jwt = JwtService.token({
      _id: user._id,
      email: user.email,
      role: user.role,
    });

    return {
      data: {
        user,
        token: jwt,
      },
    };
  };
}
