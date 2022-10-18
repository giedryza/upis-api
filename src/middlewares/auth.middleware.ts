import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';

import { JwtService } from 'tools/services';
import { UnauthorizedError } from 'errors';
import { Role } from 'domain/users/users.types';
import { Company } from 'domain/providers/providers.model';
import { SocialLink } from 'domain/social-links/social-links.model';
import { Tour } from 'domain/tours/tours.model';
import { Amenity } from 'domain/amenities/amenities.model';
import { Image } from 'domain/images/images.model';

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
    (model: 'company' | 'tour' | 'amenity' | 'image' | 'social-link') =>
    async (req: Request, _res: Response, next: NextFunction) => {
      const { user, params } = req;

      if (!user || !params.id) {
        throw new UnauthorizedError();
      }

      const filter = {
        _id: params.id,
        user: user._id,
      };

      switch (model) {
        case 'company': {
          const company = await Company.findOne(filter).lean();

          if (!company) throw new UnauthorizedError();

          break;
        }

        case 'tour': {
          const tour = await Tour.findOne(filter).lean();

          if (!tour) throw new UnauthorizedError();

          break;
        }

        case 'amenity': {
          const amenity = await Amenity.findOne(filter).lean();

          if (!amenity) throw new UnauthorizedError();

          break;
        }

        case 'image': {
          const image = await Image.findOne(filter).lean();

          if (!image) throw new UnauthorizedError();

          break;
        }

        case 'social-link': {
          const socialLink = await SocialLink.findById(params.id).lean();

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
