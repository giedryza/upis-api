import jwt from 'jsonwebtoken';
import { User } from 'domain/users/users.types';

export class Jwt {
  private static secret = process.env.JWT_SECRET;

  private static strategy = 'Bearer';

  static expiresIn = +process.env.JWT_EXPIRES_IN_DAYS * 24 * 60 * 60;

  static token = (payload: User) =>
    jwt.sign(payload, Jwt.secret, {
      expiresIn: Jwt.expiresIn,
    });

  static verify = (token: string): Promise<User | null> =>
    new Promise((resolve) => {
      jwt.verify(token, Jwt.secret, (err, decoded) => {
        if (err) {
          resolve(null);
        }

        resolve(decoded as User);
      });
    });

  static parse = (authorization?: string): Promise<{ token: string | null }> =>
    new Promise((resolve) => {
      if (typeof authorization !== 'string') {
        return resolve({ token: null });
      }

      if (!authorization.startsWith(Jwt.strategy)) {
        return resolve({ token: null });
      }

      const [_, token] = authorization.split(' ');

      if (!token) {
        return resolve({ token: null });
      }

      resolve({ token });
    });
}
