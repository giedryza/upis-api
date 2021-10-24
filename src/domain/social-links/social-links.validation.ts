import { checkSchema } from 'express-validator';
import { NotFoundError } from 'errors/not-found.error';
import { SocialLinkType } from 'domain/social-links/social-links.types';
import { Company } from 'domain/companies/companies.model';

export class Validation {
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
          await Validation.isOwner(value, req.user._id);
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
