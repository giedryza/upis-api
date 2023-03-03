import { Request } from 'express';
import { isValidObjectId } from 'mongoose';
import { checkSchema, Meta } from 'express-validator';
import { z } from 'zod';

import { NotFoundError } from 'errors';
import { languages } from 'types/common';
import { Validation as PaginationValidation } from 'domain/pagination/pagination.validation';

import { boats, queryUtils, socials } from './providers.types';

export class Validation {
  static getOne = checkSchema({
    id: {
      in: ['params'],
      isMongoId: true,
    },
  });

  static getAll = (req: Request) =>
    z.object({
      query: z
        .object({
          user: z.custom<string>(isValidObjectId, {
            message: req.t('providers.errors.user.invalid'),
          }),
          select: z.array(
            z.enum(queryUtils.select, {
              errorMap: () => ({
                message: req.t('providers.errors.select.invalid'),
              }),
            }),
            { invalid_type_error: req.t('providers.errors.select.invalid') }
          ),
        })
        .merge(PaginationValidation.paginate(req))
        .partial(),
    });

  static create = checkSchema({
    name: {
      in: ['body'],
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: (_: string, { req }: Meta) =>
          req.t('providers.errors.name.invalid'),
      },
      isLength: {
        options: { max: 150 },
        errorMessage: (_: string, { req }: Meta) =>
          req.t('providers.errors.name.max', { maxLength: 150 }),
      },
    },
    phone: {
      in: ['body'],
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: (_: string, { req }: Meta) =>
          req.t('providers.errors.phone.invalid'),
      },
    },
    email: {
      in: ['body'],
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: (_: string, { req }: Meta) =>
          req.t('providers.errors.email.invalid'),
      },
      isEmail: {
        errorMessage: (_: string, { req }: Meta) =>
          req.t('providers.errors.email.invalid'),
      },
    },
    description: {
      in: ['body'],
      optional: { options: { checkFalsy: true } },
      trim: true,
    },
  });

  static update = checkSchema({
    id: {
      in: ['params'],
      isMongoId: {
        errorMessage: (_: string, { req }: Meta) => {
          throw new NotFoundError(req.t('providers.errors.id.invalid'));
        },
      },
    },
    name: {
      in: ['body'],
      optional: true,
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: (_: string, { req }: Meta) =>
          req.t('providers.errors.name.invalid'),
      },
      isLength: {
        options: { max: 150 },
        errorMessage: (_: string, { req }: Meta) =>
          req.t('providers.errors.name.max', { maxLength: 150 }),
      },
    },
    phone: {
      in: ['body'],
      optional: true,
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: (_: string, { req }: Meta) =>
          req.t('providers.errors.phone.invalid'),
      },
    },
    email: {
      in: ['body'],
      optional: true,
      trim: true,
      isEmail: {
        errorMessage: (_: string, { req }: Meta) =>
          req.t('providers.errors.email.invalid'),
      },
      isEmpty: {
        negated: true,
        errorMessage: (_: string, { req }: Meta) =>
          req.t('providers.errors.email.invalid'),
      },
    },
    description: {
      in: ['body'],
      optional: true,
      trim: true,
    },
    address: {
      in: ['body'],
      optional: true,
      trim: true,
    },
    website: {
      in: ['body'],
      optional: true,
      trim: true,
      isURL: {
        errorMessage: (_: string, { req }: Meta) =>
          req.t('providers.errors.website.invalid'),
      },
    },
    location: {
      in: ['body'],
      optional: true,
      isArray: {
        options: { min: 2, max: 2 },
        errorMessage: (_: string, { req }: Meta) =>
          req.t('providers.errors.location.invalid'),
      },
    },
    'location.*': {
      in: ['body'],
      isFloat: {
        options: { min: -180, max: 180 },
        errorMessage: (_: string, { req }: Meta) =>
          req.t('providers.errors.location.invalid'),
      },
    },
    languages: {
      optional: true,
      isArray: {
        errorMessage: (_: string, { req }: Meta) =>
          req.t('providers.errors.languages.invalid'),
      },
    },
    'languages.*': {
      in: ['body'],
      trim: true,
      isIn: {
        options: [languages],
        errorMessage: (_: string, { req }: Meta) =>
          req.t('providers.errors.languages.invalid'),
      },
    },
    boats: {
      optional: true,
      isArray: {
        errorMessage: (_: string, { req }: Meta) =>
          req.t('providers.errors.boats.invalid'),
      },
    },
    'boats.*': {
      in: ['body'],
      trim: true,
      isIn: {
        options: [boats],
        errorMessage: (_: string, { req }: Meta) =>
          req.t('providers.errors.boats.invalid'),
      },
    },
  });

  static destroy = checkSchema({
    id: {
      in: ['params'],
      isMongoId: {
        errorMessage: (_: string, { req }: Meta) => {
          throw new NotFoundError(req.t('providers.errors.id.invalid'));
        },
      },
    },
  });

  static addLogo = checkSchema({
    id: {
      in: ['params'],
      isMongoId: {
        errorMessage: (_: string, { req }: Meta) => {
          throw new NotFoundError(req.t('providers.errors.id.invalid'));
        },
      },
    },
  });

  static createSocial = checkSchema({
    id: {
      in: ['params'],
      isMongoId: {
        errorMessage: (_: string, { req }: Meta) => {
          throw new NotFoundError(req.t('socials.errors.id.invalid'));
        },
      },
    },
    type: {
      in: ['body'],
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: (_: string, { req }: Meta) =>
          req.t('socials.errors.type.invalid'),
      },
      isIn: {
        options: [socials],
        errorMessage: (_: string, { req }: Meta) =>
          req.t('socials.errors.type.invalid'),
      },
    },
    url: {
      in: ['body'],
      trim: true,
      isURL: {
        errorMessage: (_: string, { req }: Meta) =>
          req.t('socials.errors.url.invalid'),
      },
    },
  });

  static updateSocial = checkSchema({
    id: {
      in: ['params', 'body'],
      isMongoId: {
        errorMessage: (_: string, { req }: Meta) => {
          throw new NotFoundError(req.t('socials.errors.id.invalid'));
        },
      },
    },
    url: {
      in: ['body'],
      optional: true,
      trim: true,
      isURL: {
        errorMessage: (_: string, { req }: Meta) =>
          req.t('socials.errors.url.invalid'),
      },
    },
    type: {
      in: ['body'],
      optional: true,
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: (_: string, { req }: Meta) =>
          req.t('socials.errors.type.invalid'),
      },
      isIn: {
        options: [socials],
        errorMessage: (_: string, { req }: Meta) =>
          req.t('socials.errors.type.invalid'),
      },
    },
  });

  static destroySocial = checkSchema({
    id: {
      in: ['params', 'body'],
      isMongoId: {
        errorMessage: (_: string, { req }: Meta) => {
          throw new NotFoundError(req.t('socials.errors.id.invalid'));
        },
      },
    },
  });
}
