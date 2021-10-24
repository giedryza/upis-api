import { checkSchema } from 'express-validator';
import { NotFoundError } from 'errors/not-found.error';
import { SocialLinkType } from 'domain/social-links/social-links.types';

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
      isEmpty: {
        negated: true,
        errorMessage: 'Invalid social link.',
      },
      isMongoId: {
        errorMessage: () => {
          throw new NotFoundError('Record not found.');
        },
      },
    },
  });
}
