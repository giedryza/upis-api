import { Request, Response, NextFunction } from 'express';
import { Jwt } from 'utils/jwt';
import { UnauthorizedError } from 'errors/unauthorized.error';
import { Service } from 'domain/auth/auth.service';

export class Middleware {
  static currentUser = async (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    if (!req.session?.token) {
      return next();
    }

    try {
      const user = await Jwt.verify(req.session.token);

      req.currentUser = user;
    } catch (err) {
      Service.resetSession(req);
    }

    next();
  };

  static protect = (req: Request, _res: Response, next: NextFunction) => {
    if (!req.currentUser) {
      throw new UnauthorizedError();
    }

    next();
  };
}
