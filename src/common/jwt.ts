import jwt from 'jsonwebtoken';
import { User, UserWithTimestamp } from 'domain/users/users.types';
import { Utils } from 'common/utils';

export class Jwt {
  private static secret = process.env.JWT_SECRET;

  static expiresIn = +process.env.JWT_EXPIRES_IN_DAYS * 24 * 60 * 60;

  static get timestamp() {
    return {
      iat: Utils.nowInSeconds,
      exp: Utils.nowInSeconds + Jwt.expiresIn,
    };
  }

  static token = (payload: User) =>
    jwt.sign(payload, Jwt.secret, {
      expiresIn: Jwt.expiresIn,
    });

  static verify = (token: string): Promise<UserWithTimestamp> =>
    new Promise((resolve, reject) => {
      jwt.verify(token, Jwt.secret, (err, decoded) => {
        if (err) {
          reject(err);
        }

        resolve(decoded as UserWithTimestamp);
      });
    });
}
