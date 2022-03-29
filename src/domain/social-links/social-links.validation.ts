import { Types } from 'mongoose';
import { checkSchema } from 'express-validator';

import { NotFoundError } from 'errors';
import { SocialLinkType } from 'domain/social-links/social-links.types';
import { Company } from 'domain/companies/companies.model';
import { SocialLink } from 'domain/social-links/social-links.model';

export class Validation {
  static getAll = checkSchema({
    host: {
      in: ['query'],
      optional: true,
      isMongoId: {
        errorMessage: () => {
          throw new NotFoundError('Records not found.');
        },
      },
    },
  });

  static getOneById = checkSchema({
    id: {
      in: ['params'],
      isMongoId: {
        errorMessage: () => {
          throw new NotFoundError('Record not found.');
        },
      },
    },
  });

  static create = checkSchema({
    type: {
      in: ['body'],
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: 'Choose social link type.',
      },
      isIn: {
        options: [Object.values(SocialLinkType)],
        errorMessage: 'Choose valid social link type.',
      },
    },
    url: {
      in: ['body'],
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: 'Enter social link url.',
      },
    },
    host: {
      in: ['body'],
      isMongoId: {
        errorMessage: () => {
          throw new NotFoundError('Record not found.');
        },
      },
      custom: {
        options: async (value, { req }) => {
          await Validation.isCompanyOwner(value, req.user._id);
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
      custom: {
        options: async (value, { req }) => {
          await Validation.isSocialLinkOwner(value, req.user._id);
        },
      },
    },
    url: {
      in: ['body'],
      optional: true,
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: 'Enter social link url.',
      },
    },
    type: {
      in: ['body'],
      optional: true,
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: 'Choose social link type.',
      },
      isIn: {
        options: [Object.values(SocialLinkType)],
        errorMessage: 'Choose valid social link type.',
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
      custom: {
        options: async (value, { req }) => {
          await Validation.isSocialLinkOwner(value, req.user._id);
        },
      },
    },
  });

  private static isCompanyOwner = async (
    id: Types.ObjectId,
    userId: string
  ) => {
    const filter = { _id: id, user: userId };

    const company = await Company.findOne(filter).lean();

    if (!company) {
      throw new NotFoundError('Record not found.');
    }
  };

  private static isSocialLinkOwner = async (id: string, userId: string) => {
    const socialLink = await SocialLink.findById(id).lean();

    if (!socialLink) {
      throw new NotFoundError('Record not found.');
    }

    await Validation.isCompanyOwner(socialLink.host, userId);
  };
}
