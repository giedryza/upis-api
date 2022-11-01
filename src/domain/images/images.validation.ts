import { checkSchema, Meta } from 'express-validator';

import { NotFoundError } from 'errors';

export class Validation {
  static getOne = checkSchema({
    id: {
      in: ['params'],
      isMongoId: true,
    },
  });

  static update = checkSchema({
    id: {
      in: ['params'],
      isMongoId: {
        errorMessage: (_: string, { req }: Meta) => {
          throw new NotFoundError(req.t('images.errors.id.invalid'));
        },
      },
    },
    description: {
      in: ['body'],
      optional: true,
      trim: true,
    },
  });

  static destroy = checkSchema({
    id: {
      in: ['params'],
      isMongoId: {
        errorMessage: (_: string, { req }: Meta) => {
          throw new NotFoundError(req.t('images.errors.id.invalid'));
        },
      },
    },
  });
}
