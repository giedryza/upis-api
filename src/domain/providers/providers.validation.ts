import { Request } from 'express';
import { isValidObjectId } from 'mongoose';
import { checkSchema, Meta } from 'express-validator';
import { z } from 'zod';

import { NotFoundError } from 'errors';
import { languages } from 'types/common';
import { stripPhone } from 'tools/utils';
import { Validation as PaginationValidation } from 'domain/pagination/pagination.validation';
import { Validation as UsersValidation } from 'domain/users/users.validation';

import { boats, queryUtils, socials } from './providers.types';

export class Validation {
  static getOne = (_req: Request) =>
    z.object({
      params: z.object({
        id: z.custom<string>(isValidObjectId).catch(''),
      }),
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

  static create = (req: Request) =>
    z
      .object({
        body: z.object({
          name: z
            .string({
              required_error: req.t('providers.errors.name.invalid'),
            })
            .trim()
            .max(150, {
              message: req.t('providers.errors.name.max', { maxLength: 150 }),
            }),
          phone: z
            .string({
              required_error: req.t('providers.errors.phone.invalid'),
            })
            .trim()
            .transform(stripPhone),
          email: z
            .string({
              required_error: req.t('providers.errors.email.invalid'),
            })
            .trim()
            .email({
              message: req.t('providers.errors.email.invalid'),
            }),
        }),
      })
      .merge(UsersValidation.user(req));

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

  static destroy = (req: Request) =>
    z
      .object({
        params: z.object({
          id: z.custom<string>(isValidObjectId, {
            message: req.t('providers.errors.id.invalid'),
          }),
        }),
      })
      .merge(UsersValidation.user(req));

  static addLogo = (req: Request) =>
    z
      .object({
        params: z.object({
          id: z.custom<string>(isValidObjectId, {
            message: req.t('providers.errors.id.invalid'),
          }),
        }),
      })
      .merge(UsersValidation.user(req));

  static createSocial = (req: Request) =>
    z.object({
      params: z.object({
        id: z.custom<string>(isValidObjectId, {
          message: req.t('socials.errors.id.invalid'),
        }),
      }),
      body: z.object({
        type: z.enum(socials, {
          errorMap: () => ({
            message: req.t('socials.errors.type.invalid'),
          }),
        }),
        url: z
          .string({
            required_error: req.t('socials.errors.url.invalid'),
          })
          .trim(),
      }),
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

  static destroySocial = (req: Request) =>
    z.object({
      params: z.object({
        id: z.custom<string>(isValidObjectId, {
          message: req.t('socials.errors.id.invalid'),
        }),
      }),
      body: z.object({
        id: z.custom<string>(isValidObjectId, {
          message: req.t('socials.errors.id.invalid'),
        }),
      }),
    });
}
