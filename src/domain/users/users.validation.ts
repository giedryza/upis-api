import { checkSchema } from 'express-validator';

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
        errorMessage: 'Enter email.',
      },
      isEmail: {
        errorMessage: 'Enter valid email.',
      },
    },
    password: {
      in: ['body'],
      isEmpty: {
        negated: true,
        errorMessage: 'Enter password.',
      },
      isLength: {
        options: { min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH },
        errorMessage: `Use between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters for password.`,
      },
    },
    confirmPassword: {
      in: ['body'],
      isEmpty: {
        negated: true,
        errorMessage: 'Confirm password.',
      },
      custom: {
        options: (value, { req }) => value === req.body.password,
        errorMessage: "Passwords didn't match. Try again.",
      },
    },
  });

  static updatePassword = checkSchema({
    currentPassword: {
      in: ['body'],
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: 'Enter current password.',
      },
    },
    newPassword: {
      in: ['body'],
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: 'Enter new password.',
      },
      isLength: {
        options: { min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH },
        errorMessage: `Use between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters for password.`,
      },
    },
    confirmPassword: {
      in: ['body'],
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: 'Confirm password.',
      },
      custom: {
        options: (value, { req }) => value === req.body.newPassword,
        errorMessage: "Passwords didn't match. Try again.",
      },
    },
  });

  static signin = checkSchema({
    email: {
      in: ['body'],
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: 'Enter email.',
      },
      isEmail: {
        errorMessage: 'Wrong email. Enter valid email.',
      },
    },
    password: {
      in: ['body'],
      isEmpty: {
        negated: true,
        errorMessage: 'Enter password.',
      },
    },
  });

  static forgotPassword = checkSchema({
    email: {
      in: ['body'],
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: 'Enter email.',
      },
      isEmail: {
        errorMessage: 'Wrong email. Enter valid email.',
      },
    },
  });
}
