import { Request } from 'express';
import { isValidObjectId } from 'mongoose';
import { z } from 'zod';
import { checkSchema, Meta } from 'express-validator';

import { NotFoundError } from 'errors';
import { currencies } from 'types/common';

import { variants, units } from './amenities.types';

export class Validation {
  static getOne = (_req: Request) =>
    z.object({
      params: z.object({
        id: z.custom<string>(isValidObjectId).catch(''),
      }),
    });

  static create = checkSchema({
    variant: {
      in: ['body'],
      trim: true,
      isIn: {
        options: [variants],
        errorMessage: (_: string, { req }: Meta) =>
          req.t('amenities.errors.variant.invalid'),
      },
    },
    unit: {
      in: ['body'],
      trim: true,
      isIn: {
        options: [units],
        errorMessage: (_: string, { req }: Meta) =>
          req.t('amenities.errors.unit.invalid'),
      },
    },
    amount: {
      in: ['body'],
      isInt: {
        options: {
          min: 0,
          allow_leading_zeroes: false,
        },
        errorMessage: (_: string, { req }: Meta) =>
          req.t('amenities.errors.amount.invalid'),
      },
      toInt: true,
    },
    currency: {
      in: ['body'],
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: (_: string, { req }: Meta) =>
          req.t('amenities.errors.currency.invalid'),
      },
      isIn: {
        options: currencies,
        errorMessage: (_: string, { req }: Meta) =>
          req.t('amenities.errors.currency.invalid'),
      },
    },
    info: {
      in: ['body'],
      trim: true,
    },
    providerId: {
      in: ['body'],
      isMongoId: {
        errorMessage: (_: string, { req }: Meta) => {
          throw new NotFoundError(req.t('amenities.errors.providerId.invalid'));
        },
      },
    },
  });

  static update = checkSchema({
    id: {
      in: ['params'],
      isMongoId: {
        errorMessage: (_: string, { req }: Meta) => {
          throw new NotFoundError(req.t('amenities.errors.id.invalid'));
        },
      },
    },
    unit: {
      in: ['body'],
      trim: true,
      isIn: {
        options: [units],
        errorMessage: (_: string, { req }: Meta) =>
          req.t('amenities.errors.unit.invalid'),
      },
    },
    amount: {
      in: ['body'],
      isInt: {
        options: {
          min: 0,
          allow_leading_zeroes: false,
        },
        errorMessage: (_: string, { req }: Meta) =>
          req.t('amenities.errors.amount.invalid'),
      },
      toInt: true,
    },
    currency: {
      in: ['body'],
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: (_: string, { req }: Meta) =>
          req.t('amenities.errors.currency.invalid'),
      },
      isIn: {
        options: currencies,
        errorMessage: (_: string, { req }: Meta) =>
          req.t('amenities.errors.currency.invalid'),
      },
    },
    info: {
      in: ['body'],
      trim: true,
    },
  });

  static destroy = checkSchema({
    id: {
      in: ['params'],
      isMongoId: {
        errorMessage: (_: string, { req }: Meta) => {
          throw new NotFoundError(req.t('amenities.errors.id.invalid'));
        },
      },
    },
  });
}
