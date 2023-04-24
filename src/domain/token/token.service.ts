import { PasswordService } from 'tools/services';
import { Token } from 'domain/token/token.model';
import { User } from 'domain/users/users.model';
import { UserDocument } from 'domain/users/users.types';

interface Create {
  email: string;
}

interface Compare {
  user: string;
  token: string;
}

export class Service {
  static create = async ({
    email,
  }: Create): Promise<{
    user: UserDocument | null;
    token: string;
  }> => {
    const user = await User.findOne({ email });

    if (!user) {
      return {
        user: null,
        token: '',
      };
    }

    const token = await Token.findOne({ user: user._id });

    if (token) {
      await token.deleteOne();
    }

    const raw = PasswordService.randomString();
    const hashed = await PasswordService.hash(raw);

    await new Token({
      user: user._id,
      token: hashed,
    }).save();

    return {
      user,
      token: raw,
    };
  };

  static compare = async (income: Compare): Promise<{ match: boolean }> => {
    const token = await Token.findOneAndDelete({ user: income.user });

    if (!token) {
      return { match: false };
    }

    const [user, match] = await Promise.all([
      User.findById(income.user),
      PasswordService.compare(token.token, income.token),
    ]);

    if (!user || !match) {
      return { match: false };
    }

    return { match: true };
  };
}
