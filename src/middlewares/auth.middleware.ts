import { Request, Response, NextFunction } from 'express';

import { Jwt } from 'common/jwt';
import { UnauthorizedError } from 'errors/unauthorized.error';
import { Role } from 'domain/users/users.types';

export class AuthMiddleware {
  static protect = async (req: Request, _res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new UnauthorizedError();
    }

    const { token } = await Jwt.parse(authorization);

    if (!token) {
      throw new UnauthorizedError();
    }

    const user = await Jwt.verify(token);

    if (!user) {
      throw new UnauthorizedError();
    }

    req.user = user;

    next();
  };

  static restrict =
    (roles: Role[]) => (req: Request, _res: Response, next: NextFunction) => {
      const { user } = req;

      if (!user) {
        throw new UnauthorizedError();
      }

      if (!roles.includes(user.role)) {
        throw new UnauthorizedError();
      }

      next();
    };
}
