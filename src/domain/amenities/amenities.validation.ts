import { checkSchema } from 'express-validator';

import { NotFoundError } from 'errors';
import { currencies } from 'types/common';

import { variants, units } from './amenities.types';

export class Validation {
  static getOne = checkSchema({
    id: {
      in: ['params'],
      isMongoId: true,
    },
  });

  static create = checkSchema({
    variant: {
      in: ['body'],
      trim: true,
      isIn: {
        errorMessage: 'Choose valid amenity.',
        options: [variants],
      },
    },
    unit: {
      in: ['body'],
      trim: true,
      isIn: {
        errorMessage: 'Choose valid unit.',
        options: [units],
      },
    },
    amount: {
      in: ['body'],
      isInt: {
        errorMessage: 'Enter amount.',
        options: {
          min: 1,
          allow_leading_zeroes: false,
        },
      },
      toInt: true,
    },
    currency: {
      in: ['body'],
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: 'Choose available currency.',
      },
      isIn: {
        errorMessage: 'Choose available currency.',
        options: currencies,
      },
    },
    info: {
      in: ['body'],
      trim: true,
    },
    companyId: {
      in: ['body'],
      isMongoId: {
        errorMessage: () => {
          throw new NotFoundError('Record not found.');
        },
      },
    },
  });

  static update = checkSchema({
    id: {
      in: ['params'],
      isMongoId: {
        errorMessage: () => {
          throw new NotFoundError('Record not found.');
        },
      },
    },
    variant: {
      in: ['body'],
      trim: true,
      isIn: {
        errorMessage: 'Choose valid amenity.',
        options: [variants],
      },
    },
    unit: {
      in: ['body'],
      trim: true,
      isIn: {
        errorMessage: 'Choose valid unit.',
        options: [units],
      },
    },
    amount: {
      in: ['body'],
      isInt: {
        errorMessage: 'Enter amount.',
        options: {
          min: 1,
          allow_leading_zeroes: false,
        },
      },
      toInt: true,
    },
    currency: {
      in: ['body'],
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: 'Choose available currency.',
      },
      isIn: {
        errorMessage: 'Choose available currency.',
        options: currencies,
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
        errorMessage: () => {
          throw new NotFoundError('Record not found.');
        },
      },
    },
    companyId: {
      in: ['body'],
      isMongoId: {
        errorMessage: () => {
          throw new NotFoundError('Record not found.');
        },
      },
    },
  });
}
