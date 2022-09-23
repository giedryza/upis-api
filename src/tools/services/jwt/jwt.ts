import jwt from 'jsonwebtoken';

import { APP } from 'config';
import { AppUser } from 'domain/users/users.types';

export class JwtService {
  private static secret = APP.token.jwtSecret;

  private static strategy = 'Bearer';

  static expiresIn = APP.token.jwtExpiresInDays * 24 * 60 * 60;

  static token = (payload: AppUser) =>
    jwt.sign(payload, JwtService.secret, {
      expiresIn: JwtService.expiresIn,
    });

  static verify = (token: string): Promise<AppUser | null> =>
    new Promise((resolve) => {
      jwt.verify(token, JwtService.secret, (err, decoded) => {
        if (err) {
          resolve(null);
        }

        resolve(decoded as AppUser);
      });
    });

  static parse = (authorization?: string): Promise<{ token: string | null }> =>
    new Promise((resolve) => {
      if (typeof authorization !== 'string') {
        resolve({ token: null });
        return;
      }

      if (!authorization.startsWith(JwtService.strategy)) {
        resolve({ token: null });
        return;
      }

      const [_, token] = authorization.split(' ');

      if (!token) {
        resolve({ token: null });
        return;
      }

      resolve({ token });
    });
}
