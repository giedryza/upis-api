import { Request } from 'express';
import { isValidObjectId } from 'mongoose';
import { checkSchema, Meta } from 'express-validator';
import { z } from 'zod';

import { BadRequestError, NotFoundError } from 'errors';
import { currencies } from 'types/common';
import { Provider } from 'domain/providers/providers.model';
import { variants as amenities } from 'domain/amenities/amenities.types';
import { Validation as PaginationValidation } from 'domain/pagination/pagination.validation';

import { queryUtils, regions, rivers } from './tours.types';

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
          amenities: z.array(
            z.enum(amenities, {
              errorMap: () => ({
                message: req.t('tours.errors.amenities.invalid'),
              }),
            }),
            { invalid_type_error: req.t('tours.errors.amenities.invalid') }
          ),
          regions: z.array(
            z.enum(regions, {
              errorMap: () => ({
                message: req.t('tours.errors.regions.invalid'),
              }),
            }),
            { invalid_type_error: req.t('tours.errors.regions.invalid') }
          ),
          rivers: z.array(
            z.enum(rivers, {
              errorMap: () => ({
                message: req.t('tours.errors.rivers.invalid'),
              }),
            }),
            { invalid_type_error: req.t('tours.errors.rivers.invalid') }
          ),
          distanceFrom: z.coerce
            .number({
              invalid_type_error: req.t('tours.errors.distance.invalid'),
            })
            .nonnegative({ message: req.t('tours.errors.distance.invalid') }),
          distanceTo: z.coerce.number({
            invalid_type_error: req.t('tours.errors.distance.invalid'),
          }),
          durationFrom: z.coerce
            .number({
              invalid_type_error: req.t('tours.errors.duration.invalid'),
            })
            .nonnegative({ message: req.t('tours.errors.duration.invalid') }),
          durationTo: z.coerce.number({
            invalid_type_error: req.t('tours.errors.duration.invalid'),
          }),
          daysFrom: z.coerce
            .number({ invalid_type_error: req.t('tours.errors.days.invalid') })
            .int({ message: req.t('tours.errors.days.invalid') })
            .nonnegative({ message: req.t('tours.errors.days.invalid') }),
          daysTo: z.coerce
            .number({ invalid_type_error: req.t('tours.errors.days.invalid') })
            .int({ message: req.t('tours.errors.days.invalid') }),
          difficultyFrom: z.coerce
            .number({
              invalid_type_error: req.t('tours.errors.difficulty.invalid', {
                min: 0,
                max: 5,
              }),
            })
            .min(0, {
              message: req.t('tours.errors.difficulty.invalid', {
                min: 0,
                max: 5,
              }),
            })
            .max(5, {
              message: req.t('tours.errors.difficulty.invalid', {
                min: 0,
                max: 5,
              }),
            }),
          difficultyTo: z.coerce
            .number({
              invalid_type_error: req.t('tours.errors.difficulty.invalid', {
                min: 0,
                max: 5,
              }),
            })
            .min(0, {
              message: req.t('tours.errors.difficulty.invalid', {
                min: 0,
                max: 5,
              }),
            })
            .max(5, {
              message: req.t('tours.errors.difficulty.invalid', {
                min: 0,
                max: 5,
              }),
            }),
          user: z.custom<string>(isValidObjectId, {
            message: req.t('tours.errors.user.invalid'),
          }),
          select: z.array(
            z.enum(queryUtils.select, {
              errorMap: () => ({
                message: req.t('tours.errors.select.invalid'),
              }),
            }),
            { invalid_type_error: req.t('tours.errors.select.invalid') }
          ),
          populate: z.array(
            z.enum(queryUtils.populate, {
              errorMap: () => ({
                message: req.t('tours.errors.populate.invalid'),
              }),
            }),
            { invalid_type_error: req.t('tours.errors.populate.invalid') }
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
          req.t('tours.errors.name.invalid'),
      },
      isLength: {
        options: { max: 200 },
        errorMessage: (_: string, { req }: Meta) =>
          req.t('tours.errors.name.max', { maxLength: 200 }),
      },
    },
    provider: {
      in: ['body'],
      isMongoId: {
        errorMessage: (_: string, { req }: Meta) => {
          throw new BadRequestError(req.t('tours.errors.provider.invalid'));
        },
      },
      custom: {
        options: async (value, { req }) => {
          const provider = await Provider.findById(value);

          if (!provider) {
            throw new BadRequestError(req.t('tours.errors.provider.invalid'));
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
      isURL: {
        errorMessage: (_: string, { req }: Meta) =>
          req.t('tours.errors.website.invalid'),
      },
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
