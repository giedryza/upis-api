import { checkSchema } from 'express-validator';

import { BadRequestError } from 'errors';
import { currencies } from 'types/common';
import { regions } from 'domain/tours/tours.types';

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
        errorMessage: 'Enter tour name.',
      },
      isLength: {
        options: { max: 200 },
        errorMessage: 'Use 200 characters or less for name.',
      },
    },
    company: {
      in: ['body'],
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: 'Choose company.',
      },
      isMongoId: {
        errorMessage: () => {
          throw new BadRequestError('Choose valid company.');
        },
      },
    },
  });

  static update = checkSchema({
    id: {
      in: ['params'],
      isMongoId: {
        errorMessage: () => {
          throw new BadRequestError('Tour does not exist.');
        },
      },
    },
    name: {
      in: ['body'],
      optional: true,
      isEmpty: {
        negated: true,
        errorMessage: 'Enter tour name.',
      },
      isString: {
        errorMessage: 'Enter tour name.',
      },
      trim: true,
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
    departure: {
      in: ['body'],
      optional: true,
      trim: true,
    },
    arrival: {
      in: ['body'],
      optional: true,
      trim: true,
    },
    distance: {
      in: ['body'],
      optional: true,
      isFloat: {
        errorMessage: 'Enter tour distance.',
        options: {
          min: 0.01,
        },
      },
    },
    duration: {
      in: ['body'],
      optional: true,
      isFloat: {
        errorMessage: 'Enter tour duration.',
        options: {
          min: 0.01,
        },
      },
    },
    days: {
      in: ['body'],
      optional: true,
      isInt: {
        errorMessage: 'Enter tour duration in days.',
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
        errorMessage: 'Enter tour difficulty between 0 and 5.',
        options: {
          min: 0,
          max: 5,
        },
      },
    },
  });

  static destroy = checkSchema({
    id: {
      in: ['params'],
      isMongoId: {
        errorMessage: () => {
          throw new BadRequestError('Tour does not exist.');
        },
      },
    },
  });

  static updatePrice = checkSchema({
    id: {
      in: ['params'],
      isMongoId: {
        errorMessage: () => {
          throw new BadRequestError('Tour does not exist.');
        },
      },
    },
    amount: {
      in: ['body'],
      optional: true,
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
      optional: true,
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
  });

  static updateGeography = checkSchema({
    id: {
      in: ['params'],
      isMongoId: {
        errorMessage: () => {
          throw new BadRequestError('Tour does not exist.');
        },
      },
    },
    regions: {
      optional: true,
      isArray: {
        errorMessage: 'Choose regions.',
      },
    },
    'regions.*': {
      in: ['body'],
      trim: true,
      isIn: {
        errorMessage: 'Choose valid regions.',
        options: [regions],
      },
    },
    rivers: {
      optional: true,
      isArray: {
        errorMessage: 'Choose rivers.',
      },
    },
    'rivers.*': {
      in: ['body'],
      isString: {
        errorMessage: 'Choose rivers.',
      },
      trim: true,
    },
  });
}
