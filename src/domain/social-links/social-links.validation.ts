import { checkSchema } from 'express-validator';

import { NotFoundError } from 'errors';
import { SocialLinkType } from 'domain/social-links/social-links.types';

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
    },
  });
}
