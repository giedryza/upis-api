import { Request, Response, NextFunction } from 'express';
import { Jwt } from 'utils/jwt';
import { UnauthorizedError } from 'errors/unauthorized.error';

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
      req.session = null;
      req.currentUser = undefined;
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
