import { checkSchema, Meta } from 'express-validator';

import { NotFoundError } from 'errors';
import { SocialLinkType } from 'domain/social-links/social-links.types';

export class Validation {
  static getOne = checkSchema({
    id: {
      in: ['params'],
      isMongoId: true,
    },
  });

  static getAll = checkSchema({
    host: {
      in: ['query'],
      optional: true,
      isMongoId: {
        errorMessage: (_: string, { req }: Meta) => {
          throw new NotFoundError(req.t('socialLinks.errors.id.invalid'));
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
        errorMessage: (_: string, { req }: Meta) =>
          req.t('socialLinks.errors.type.invalid'),
      },
      isIn: {
        options: [Object.values(SocialLinkType)],
        errorMessage: (_: string, { req }: Meta) =>
          req.t('socialLinks.errors.type.invalid'),
      },
    },
    url: {
      in: ['body'],
      trim: true,
      isURL: {
        errorMessage: (_: string, { req }: Meta) =>
          req.t('socialLinks.errors.url.invalid'),
      },
    },
    host: {
      in: ['body'],
      isMongoId: {
        errorMessage: (_: string, { req }: Meta) => {
          throw new NotFoundError(req.t('socialLinks.errors.host.invalid'));
        },
      },
    },
  });

  static update = checkSchema({
    id: {
      in: ['params'],
      isMongoId: {
        errorMessage: (_: string, { req }: Meta) => {
          throw new NotFoundError(req.t('socialLinks.errors.id.invalid'));
        },
      },
    },
    url: {
      in: ['body'],
      optional: true,
      trim: true,
      isURL: {
        errorMessage: (_: string, { req }: Meta) =>
          req.t('socialLinks.errors.url.invalid'),
      },
    },
    type: {
      in: ['body'],
      optional: true,
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: (_: string, { req }: Meta) =>
          req.t('socialLinks.errors.type.invalid'),
      },
      isIn: {
        options: [Object.values(SocialLinkType)],
        errorMessage: (_: string, { req }: Meta) =>
          req.t('socialLinks.errors.type.invalid'),
      },
    },
  });

  static destroy = checkSchema({
    id: {
      in: ['params'],
      isMongoId: {
        errorMessage: (_: string, { req }: Meta) => {
          throw new NotFoundError(req.t('socialLinks.errors.id.invalid'));
        },
      },
    },
  });
}
