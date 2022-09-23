import { checkSchema, Meta } from 'express-validator';

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
} from 'domain/users/users.constants';

export class Validation {
  static signup = checkSchema({
    email: {
      in: ['body'],
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: (_: string, { req }: Meta) =>
          req.t('users.errors.email.invalid'),
      },
      isEmail: {
        errorMessage: (_: string, { req }: Meta) =>
          req.t('users.errors.email.invalid'),
      },
    },
    password: {
      in: ['body'],
      isEmpty: {
        negated: true,
        errorMessage: (_: string, { req }: Meta) =>
          req.t('users.errors.password.invalid'),
      },
      isLength: {
        options: { min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH },
        errorMessage: (_: string, { req }: Meta) =>
          req.t('users.errors.password.length', {
            min: PASSWORD_MIN_LENGTH,
            max: PASSWORD_MAX_LENGTH,
          }),
      },
    },
    confirmPassword: {
      in: ['body'],
      isEmpty: {
        negated: true,
        errorMessage: (_: string, { req }: Meta) =>
          req.t('users.errors.confirmPassword.invalid'),
      },
      custom: {
        options: (value, { req }) => value === req.body.password,
        errorMessage: (_: string, { req }: Meta) =>
          req.t('users.errors.confirmPassword.match'),
      },
    },
  });

  static signin = checkSchema({
    email: {
      in: ['body'],
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: (_: string, { req }: Meta) =>
          req.t('users.errors.email.invalid'),
      },
      isEmail: {
        errorMessage: (_: string, { req }: Meta) =>
          req.t('users.errors.email.invalid'),
      },
    },
    password: {
      in: ['body'],
      isEmpty: {
        negated: true,
        errorMessage: (_: string, { req }: Meta) =>
          req.t('users.errors.password.invalid'),
      },
    },
  });

  static updatePassword = checkSchema({
    currentPassword: {
      in: ['body'],
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: (_: string, { req }: Meta) =>
          req.t('users.errors.currentPassword.invalid'),
      },
    },
    newPassword: {
      in: ['body'],
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: (_: string, { req }: Meta) =>
          req.t('users.errors.newPassword.invalid'),
      },
      isLength: {
        options: { min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH },
        errorMessage: (_: string, { req }: Meta) =>
          req.t('users.errors.password.length', {
            min: PASSWORD_MIN_LENGTH,
            max: PASSWORD_MAX_LENGTH,
          }),
      },
    },
    confirmPassword: {
      in: ['body'],
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: (_: string, { req }: Meta) =>
          req.t('users.errors.confirmPassword.invalid'),
      },
      custom: {
        options: (value, { req }) => value === req.body.newPassword,
        errorMessage: (_: string, { req }: Meta) =>
          req.t('users.errors.confirmPassword.match'),
      },
    },
  });

  static forgotPassword = checkSchema({
    email: {
      in: ['body'],
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: (_: string, { req }: Meta) =>
          req.t('users.errors.email.invalid'),
      },
      isEmail: {
        errorMessage: (_: string, { req }: Meta) =>
          req.t('users.errors.email.invalid'),
      },
    },
  });

  static resetPassword = checkSchema({
    userId: {
      in: ['body'],
      isEmpty: {
        negated: true,
        errorMessage: (_: string, { req }: Meta) =>
          req.t('users.errors.userId.invalid'),
      },
      isMongoId: {
        errorMessage: (_: string, { req }: Meta) =>
          req.t('users.errors.userId.invalid'),
      },
    },
    token: {
      in: ['body'],
      isEmpty: {
        negated: true,
        errorMessage: (_: string, { req }: Meta) =>
          req.t('users.errors.token.invalid'),
      },
    },
    password: {
      in: ['body'],
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: (_: string, { req }: Meta) =>
          req.t('users.errors.password.invalid'),
      },
    },
  });
}
