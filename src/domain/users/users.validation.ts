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

  static signin = (req: Request) =>
    z.object({
      body: z.object({
        email: z
          .string({
            required_error: req.t('users.errors.email.invalid'),
            invalid_type_error: req.t('users.errors.email.invalid'),
          })
          .trim(),
        password: z.string({
          required_error: req.t('users.errors.password.invalid'),
          invalid_type_error: req.t('users.errors.password.invalid'),
        }),
      }),
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

  static forgotPassword = (req: Request) =>
    z.object({
      body: z.object({
        email: z
          .string({
            required_error: req.t('users.errors.email.invalid'),
            invalid_type_error: req.t('users.errors.email.invalid'),
          })
          .trim()
          .email({ message: req.t('users.errors.email.invalid') }),
      }),
    });

  static resetPassword = (req: Request) =>
    z.object({
      body: z.object({
        user: z.custom<string>(isValidObjectId, {
          message: req.t('users.errors.user.invalid'),
        }),
        token: z.string({
          required_error: req.t('users.errors.token.invalid'),
          invalid_type_error: req.t('users.errors.token.invalid'),
        }),
        password: z.string({
          required_error: req.t('users.errors.password.invalid'),
          invalid_type_error: req.t('users.errors.password.invalid'),
        }),
      }),
    });

  static becomeProvider = (req: Request) =>
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

  static sendVerifyEmail = (req: Request) =>
    z.object({}).merge(Validation.user(req));
}
