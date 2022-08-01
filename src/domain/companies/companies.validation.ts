import { checkSchema } from 'express-validator';

import { NotFoundError } from 'errors';
import { amenityVariants, units } from 'domain/companies/companies.types';
import { currencies } from 'types/common';

export class Validation {
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

  static getAmenity = checkSchema({
    id: {
      in: ['params'],
      isMongoId: true,
    },
    amenityId: {
      in: ['params'],
      isMongoId: true,
    },
  });

  static addAmenity = checkSchema({
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
        options: [amenityVariants],
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

  static updateAmenity = checkSchema({
    id: {
      in: ['params'],
      isMongoId: {
        errorMessage: () => {
          throw new NotFoundError('Record not found.');
        },
      },
    },
    amenityId: {
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
        options: [amenityVariants],
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

  static destroyAmenity = checkSchema({
    id: {
      in: ['params'],
      isMongoId: {
        errorMessage: () => {
          throw new NotFoundError('Record not found.');
        },
      },
    },
    amenityId: {
      in: ['params'],
      isMongoId: {
        errorMessage: () => {
          throw new NotFoundError('Record not found.');
        },
      },
    },
  });
}
