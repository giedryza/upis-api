import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';

import { JwtService } from 'tools/services';
import { UnauthorizedError } from 'errors';
import { Role } from 'domain/users/users.types';
import { Company } from 'domain/companies/companies.model';
import { SocialLink } from 'domain/social-links/social-links.model';

export class AuthMiddleware {
  static protect = async (req: Request, _res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new UnauthorizedError();
    }

    const { token } = await JwtService.parse(authorization);

    if (!token) {
      throw new UnauthorizedError();
    }

    const user = await JwtService.verify(token);

    if (!user) {
      throw new UnauthorizedError();
    }

    if (!isValidObjectId(user._id)) {
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

  static isOwner =
    (model: 'company' | 'social-link') =>
    async (req: Request, _res: Response, next: NextFunction) => {
      const { user, params } = req;
      const { id } = params;

      if (!user || !id || !id) {
        throw new UnauthorizedError();
      }

      switch (model) {
        case 'company': {
          const company = await Company.findOne({
            _id: id,
            user: user._id,
          }).lean();

          if (!company) {
            throw new UnauthorizedError();
          }

          break;
        }

        case 'social-link': {
          const socialLink = await SocialLink.findById(id).lean();

          if (!socialLink) {
            throw new UnauthorizedError();
          }

          if (socialLink.host === user._id) {
            break;
          }

          const company = await Company.findOne({
            _id: socialLink.host,
            user: user._id,
          }).lean();

          if (!company) {
            throw new UnauthorizedError();
          }

          break;
        }

        default:
          break;
      }

      next();
    };
}
