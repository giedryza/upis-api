import { checkSchema } from 'express-validator';

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
        options: { min: 8, max: 50 },
        errorMessage: 'Use between 8 and 50 characters for password.',
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
      isLength: {
        options: { min: 8, max: 50 },
        errorMessage:
          'Wrong password. Try again or click Forgot password to reset it.',
      },
    },
  });
}
