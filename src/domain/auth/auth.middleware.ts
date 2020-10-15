import { Request, Response, NextFunction } from 'express';
import { Jwt } from 'utils/jwt';
import { UnauthorizedError } from 'errors/unauthorized.error';

export class Middleware {
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
}
