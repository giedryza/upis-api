import { checkSchema } from 'express-validator';

import { BadRequestError } from 'errors';

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
          throw new BadRequestError('Choose valid tour.');
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
      isNumeric: {
        errorMessage: 'Enter tour distance.',
        options: {
          no_symbols: true,
        },
      },
    },
    duration: {
      in: ['body'],
      optional: true,
      isNumeric: {
        errorMessage: 'Enter tour duration.',
        options: {
          no_symbols: true,
        },
      },
    },
    days: {
      in: ['body'],
      optional: true,
      isNumeric: {
        errorMessage: 'Enter tour duration in days.',
        options: {
          no_symbols: true,
        },
      },
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
          throw new BadRequestError('Choose valid tour.');
        },
      },
    },
  });
}
