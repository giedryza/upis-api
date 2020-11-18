import { checkSchema } from 'express-validator';
import { SocialType } from 'domain/companies/companies.types';
import { NotFoundError } from 'errors/not-found.error';
import { Company } from 'domain/companies/companies.model';

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
      optional: { options: { checkFalsy: true } },
      trim: true,
    },
    address: {
      in: ['body'],
      optional: { options: { checkFalsy: true } },
      trim: true,
    },
    website: {
      in: ['body'],
      optional: { options: { checkFalsy: true } },
      trim: true,
      isURL: {
        errorMessage: 'Enter valid website.',
      },
    },
    social: {
      in: ['body'],
      optional: { options: { checkFalsy: true } },
      isArray: {
        errorMessage: 'Invalid value.',
      },
    },
    'social.*.type': {
      in: ['body'],
      isIn: {
        options: [Object.values(SocialType)],
        errorMessage: 'Invalid social link type.',
      },
    },
    'social.*.link': {
      in: ['body'],
      isURL: {
        errorMessage: 'Enter valid social links.',
      },
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
      custom: {
        options: async (value, { req }) => {
          await Validation.isOwner(value, req.user.id);
        },
      },
    },
  });

  private static isOwner = async (id: string, userId: string) => {
    const filter = { _id: id, user: userId };

    const company = await Company.findOne(filter).lean();

    if (!company) {
      throw new NotFoundError('Record not found.');
    }
  };
}
