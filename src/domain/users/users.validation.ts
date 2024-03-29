import { Request } from 'express';
import { isValidObjectId } from 'mongoose';
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

  static signup = (req: Request) =>
    z.object({
      body: z
        .object({
          email: z
            .string({
              required_error: req.t('users.errors.email.invalid'),
              invalid_type_error: req.t('users.errors.email.invalid'),
            })
            .trim()
            .email({ message: req.t('users.errors.email.invalid') }),
          password: z
            .string({
              required_error: req.t('users.errors.password.invalid'),
              invalid_type_error: req.t('users.errors.password.invalid'),
            })
            .min(PASSWORD_MIN_LENGTH, {
              message: req.t('users.errors.password.length', {
                min: PASSWORD_MIN_LENGTH,
                max: PASSWORD_MAX_LENGTH,
              }),
            })
            .max(PASSWORD_MAX_LENGTH, {
              message: req.t('users.errors.password.length', {
                min: PASSWORD_MIN_LENGTH,
                max: PASSWORD_MAX_LENGTH,
              }),
            }),
          confirmPassword: z.string({
            required_error: req.t('users.errors.confirmPassword.invalid'),
            invalid_type_error: req.t('users.errors.confirmPassword.invalid'),
          }),
        })
        .refine(
          ({ password, confirmPassword }) => password === confirmPassword,
          { message: req.t('users.errors.confirmPassword.match') }
        ),
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

  static signinWithToken = (req: Request) =>
    z.object({
      body: z.object({
        token: z.string({
          required_error: req.t('users.errors.token.invalid'),
          invalid_type_error: req.t('users.errors.token.invalid'),
        }),
      }),
    });

  static signinWithGoogle = (req: Request) =>
    z.object({
      body: z.object({
        token: z.string({
          required_error: req.t('users.errors.token.invalid'),
          invalid_type_error: req.t('users.errors.token.invalid'),
        }),
      }),
    });

  static me = (req: Request) => z.object({}).merge(Validation.user(req));

  static updatePassword = (req: Request) =>
    z
      .object({
        body: z
          .object({
            currentPassword: z.string({
              required_error: req.t('users.errors.currentPassword.invalid'),
              invalid_type_error: req.t('users.errors.currentPassword.invalid'),
            }),
            newPassword: z
              .string({
                required_error: req.t('users.errors.newPassword.invalid'),
                invalid_type_error: req.t('users.errors.newPassword.invalid'),
              })
              .min(PASSWORD_MIN_LENGTH, {
                message: req.t('users.errors.password.length', {
                  min: PASSWORD_MIN_LENGTH,
                  max: PASSWORD_MAX_LENGTH,
                }),
              })
              .max(PASSWORD_MAX_LENGTH, {
                message: req.t('users.errors.password.length', {
                  min: PASSWORD_MIN_LENGTH,
                  max: PASSWORD_MAX_LENGTH,
                }),
              }),
            confirmPassword: z.string({
              required_error: req.t('users.errors.confirmPassword.invalid'),
              invalid_type_error: req.t('users.errors.confirmPassword.invalid'),
            }),
          })
          .refine(
            ({ newPassword, confirmPassword }) =>
              newPassword === confirmPassword,
            { message: req.t('users.errors.confirmPassword.match') }
          ),
      })
      .merge(Validation.user(req));

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
    z.object({}).merge(Validation.user(req));

  static sendVerifyEmail = (req: Request) =>
    z.object({}).merge(Validation.user(req));

  static verifyEmail = (req: Request) =>
    z.object({
      body: z.object({
        user: z.custom<string>(isValidObjectId, {
          message: req.t('users.errors.verify_email'),
        }),
        token: z.string({
          required_error: req.t('users.errors.verify_email'),
          invalid_type_error: req.t('users.errors.verify_email'),
        }),
      }),
    });
}
