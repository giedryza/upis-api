import { Request } from 'express';
import { isValidObjectId } from 'mongoose';
import { checkSchema, Meta } from 'express-validator';
import { z } from 'zod';

import { PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH } from './users.constants';
import { roles } from './users.types';

export class Validation {
  static user = (req: Request) =>
    z.object({
      user: z.object({
        _id: z.custom<string>(isValidObjectId, {
          message: req.t('users.errors.unauthorized'),
        }),
        email: z.string({
          required_error: req.t('users.errors.unauthorized'),
          invalid_type_error: req.t('users.errors.unauthorized'),
        }),
        role: z.enum(roles, {
          errorMap: () => ({
            message: req.t('users.errors.unauthorized'),
          }),
        }),
      }),
    });

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

  static me = (req: Request) => z.object({}).merge(Validation.user(req));

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

  static updateRole = (req: Request) =>
    z
      .object({
        body: z.object({
          role: z.enum(roles, {
            errorMap: () => ({
              message: req.t('users.errors.role.invalid'),
            }),
          }),
        }),
      })
      .merge(Validation.user(req));
}
