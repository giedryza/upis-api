import { checkSchema, Meta } from 'express-validator';

import { NotFoundError } from 'errors';
import { languages } from 'types/common';

import { boats } from './providers.types';

export class Validation {
  static getOne = checkSchema({
    id: {
      in: ['params'],
      isMongoId: true,
    },
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
}