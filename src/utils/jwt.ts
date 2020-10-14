import jwt from 'jsonwebtoken';
import { CurrentUser } from 'types/express';

export class Jwt {
  private static secret = process.env.JWT_SECRET;

  static expiresIn = +process.env.JWT_EXPIRES_IN_DAYS * 24 * 60 * 60;

  static token = (payload: object) =>
    jwt.sign(payload, Jwt.secret, {
      expiresIn: Jwt.expiresIn,
    });

  static verify = (token: string): Promise<CurrentUser> =>
    new Promise((resolve, reject) => {
      jwt.verify(token, Jwt.secret, (err, decoded) => {
        if (err) {
          reject(err);
        }

        resolve(decoded as CurrentUser);
      });
    });
}
