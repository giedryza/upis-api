import { checkSchema, Meta } from 'express-validator';

import { BadRequestError, NotFoundError } from 'errors';
import { currencies } from 'types/common';
import { regions, rivers } from 'domain/tours/tours.types';
import { Company } from 'domain/providers/providers.model';

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
          req.t('tours.errors.name.invalid'),
      },
      isLength: {
        options: { max: 200 },
        errorMessage: (_: string, { req }: Meta) =>
          req.t('tours.errors.name.max', { maxLength: 200 }),
      },
    },
    company: {
      in: ['body'],
      isMongoId: {
        errorMessage: (_: string, { req }: Meta) => {
          throw new BadRequestError(req.t('tours.errors.company.invalid'));
        },
      },
      custom: {
        options: async (value, { req }) => {
          const company = await Company.findById(value);

          if (!company) {
            throw new BadRequestError(req.t('tours.errors.company.invalid'));
          }
        },
      },
    },
  });

  static update = checkSchema({
    id: {
      in: ['params'],
      isMongoId: {
        errorMessage: (_: string, { req }: Meta) => {
          throw new NotFoundError(req.t('tours.errors.id.invalid'));
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
          req.t('tours.errors.name.invalid'),
      },
      isLength: {
        options: { max: 200 },
        errorMessage: (_: string, { req }: Meta) =>
          req.t('tours.errors.name.max', { maxLength: 200 }),
      },
    },
    description: {
      in: ['body'],
      optional: true,
      trim: true,
    },
    website: {
      in: ['body'],
      optional: true,
      trim: true,
    },
    distance: {
      in: ['body'],
      optional: true,
      isFloat: {
        errorMessage: (_: string, { req }: Meta) =>
          req.t('tours.errors.distance.invalid'),
        options: {
          min: 0.01,
        },
      },
    },
    duration: {
      in: ['body'],
      optional: true,
      isFloat: {
        errorMessage: (_: string, { req }: Meta) =>
          req.t('tours.errors.duration.invalid'),
        options: {
          min: 0.01,
        },
      },
    },
    days: {
      in: ['body'],
      optional: true,
      isInt: {
        errorMessage: (_: string, { req }: Meta) =>
          req.t('tours.errors.days.invalid'),
        options: {
          min: 1,
          allow_leading_zeroes: false,
        },
      },
      toInt: true,
    },
    difficulty: {
      in: ['body'],
      optional: true,
      isFloat: {
        errorMessage: (_: string, { req }: Meta) =>
          req.t('tours.errors.difficulty.invalid', { min: 0, max: 5 }),
        options: {
          min: 0,
          max: 5,
        },
      },
    },
    primaryPhoto: {
      in: ['body'],
      optional: true,
      isMongoId: true,
    },
    departure: {
      in: ['body'],
      optional: true,
      isArray: {
        options: { max: 2, min: 2 },
        errorMessage: (_: string, { req }: Meta) =>
          req.t('tours.errors.departure.invalid'),
      },
    },
    'departure.*': {
      in: ['body'],
      isFloat: {
        options: { min: -180, max: 180 },
        errorMessage: (_: string, { req }: Meta) =>
          req.t('tours.errors.departure.invalid'),
      },
    },
    arrival: {
      in: ['body'],
      optional: true,
      isArray: {
        options: { max: 2, min: 2 },
        errorMessage: (_: string, { req }: Meta) =>
          req.t('tours.errors.arrival.invalid'),
      },
    },
    'arrival.*': {
      in: ['body'],
      isFloat: {
        options: { min: -180, max: 180 },
        errorMessage: (_: string, { req }: Meta) =>
          req.t('tours.errors.arrival.invalid'),
      },
    },
  });

  static destroy = checkSchema({
    id: {
      in: ['params'],
      isMongoId: {
        errorMessage: (_: string, { req }: Meta) => {
          throw new NotFoundError(req.t('tours.errors.id.invalid'));
        },
      },
    },
  });

  static updatePrice = checkSchema({
    id: {
      in: ['params'],
      isMongoId: {
        errorMessage: (_: string, { req }: Meta) => {
          throw new NotFoundError(req.t('tours.errors.id.invalid'));
        },
      },
    },
    amount: {
      in: ['body'],
      optional: true,
      isInt: {
        errorMessage: (_: string, { req }: Meta) =>
          req.t('tours.errors.amount.invalid'),
        options: {
          min: 1,
          allow_leading_zeroes: false,
        },
      },
      toInt: true,
    },
    currency: {
      in: ['body'],
      optional: true,
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: (_: string, { req }: Meta) =>
          req.t('tours.errors.currency.invalid'),
      },
      isIn: {
        errorMessage: (_: string, { req }: Meta) =>
          req.t('tours.errors.currency.invalid'),
        options: currencies,
      },
    },
  });

  static updateGeography = checkSchema({
    id: {
      in: ['params'],
      isMongoId: {
        errorMessage: (_: string, { req }: Meta) => {
          throw new NotFoundError(req.t('tours.errors.id.invalid'));
        },
      },
    },
    regions: {
      optional: true,
      isArray: {
        errorMessage: (_: string, { req }: Meta) =>
          req.t('tours.errors.regions.invalid'),
      },
    },
    'regions.*': {
      in: ['body'],
      trim: true,
      isIn: {
        options: [regions],
        errorMessage: (_: string, { req }: Meta) =>
          req.t('tours.errors.regions.invalid'),
      },
    },
    rivers: {
      optional: true,
      isArray: {
        errorMessage: (_: string, { req }: Meta) =>
          req.t('tours.errors.rivers.invalid'),
      },
    },
    'rivers.*': {
      in: ['body'],
      trim: true,
      isIn: {
        options: [rivers],
        errorMessage: (_: string, { req }: Meta) =>
          req.t('tours.errors.rivers.invalid'),
      },
    },
  });

  static updateAmenities = checkSchema({
    id: {
      in: ['params'],
      isMongoId: {
        errorMessage: (_: string, { req }: Meta) => {
          throw new NotFoundError(req.t('tours.errors.id.invalid'));
        },
      },
    },
    amenities: {
      in: ['body'],
      isArray: {
        errorMessage: (_: string, { req }: Meta) =>
          req.t('tours.errors.amenities.invalid'),
      },
    },
    'amenities.*': {
      in: ['body'],
      isMongoId: {
        errorMessage: (_: string, { req }: Meta) => {
          throw new BadRequestError(req.t('tours.errors.amenities.invalid'));
        },
      },
    },
  });

  static addPhoto = checkSchema({
    id: {
      in: ['params'],
      isMongoId: {
        errorMessage: (_: string, { req }: Meta) => {
          throw new NotFoundError(req.t('tours.errors.id.invalid'));
        },
      },
    },
    description: {
      in: ['body'],
      optional: true,
      trim: true,
    },
  });
}
