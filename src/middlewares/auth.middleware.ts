import { Request, Response, NextFunction } from 'express';
import { Jwt } from 'common/jwt';
import { UnauthorizedError } from 'errors/unauthorized.error';
import { Role } from 'domain/users/users.types';

export class AuthMiddleware {
  static user = async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.session?.token) {
      return next();
    }

    try {
      const user = await Jwt.verify(req.session.token);

      req.user = user;
    } catch (err) {
      req.session = null;
      req.user = undefined;
    }

    next();
  };

  static protect = (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    next();
  };

  static restrict = (roles: Role[]) => (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new UnauthorizedError();
    }

    next();
  };
}
