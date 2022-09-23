import { checkSchema } from 'express-validator';

import { NotFoundError } from 'errors';
import { languages } from 'types/common';
import { boats } from 'domain/companies/companies.types';

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
        errorMessage: 'Enter company name.',
      },
      isLength: {
        options: { max: 150 },
        errorMessage: 'Use 150 characters or less for name.',
      },
    },
    phone: {
      in: ['body'],
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: 'Enter company contact phone.',
      },
    },
    email: {
      in: ['body'],
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: 'Enter contact email.',
      },
      isEmail: {
        errorMessage: 'Enter valid email.',
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
        errorMessage: () => {
          throw new NotFoundError('Record not found.');
        },
      },
    },
    name: {
      in: ['body'],
      optional: true,
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: 'Enter company name.',
      },
    },
    phone: {
      in: ['body'],
      optional: true,
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: 'Enter company contact phone.',
      },
    },
    email: {
      in: ['body'],
      optional: true,
      trim: true,
      isEmail: {
        errorMessage: 'Enter valid email.',
      },
      isEmpty: {
        negated: true,
        errorMessage: 'Enter company email.',
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
      optional: { options: { checkFalsy: true } },
    },
    'location.coordinates': {
      in: ['body'],
      optional: { options: { checkFalsy: true } },
      isArray: {
        options: {
          max: 2,
        },
        errorMessage: 'Provide location coordinates.',
      },
    },
    'location.coordinates.*': {
      in: ['body'],
      isFloat: {
        options: {
          min: -180,
          max: 180,
        },
        errorMessage: 'Provide location coordinates.',
      },
    },
    languages: {
      optional: true,
      isArray: {
        errorMessage: 'Select languages.',
      },
    },
    'languages.*': {
      in: ['body'],
      trim: true,
      isIn: {
        options: [languages],
        errorMessage: 'Select languages.',
      },
    },
    boats: {
      optional: true,
      isArray: {
        errorMessage: 'Select boats.',
      },
    },
    'boats.*': {
      in: ['body'],
      trim: true,
      isIn: {
        options: [boats],
        errorMessage: 'Select boats.',
      },
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
  });

  static addLogo = checkSchema({
    id: {
      in: ['params'],
      isMongoId: {
        errorMessage: () => {
          throw new NotFoundError('Record not found.');
        },
      },
    },
  });
}
