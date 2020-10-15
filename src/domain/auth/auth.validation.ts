import { body } from 'express-validator';

export class Validation {
  static signup = [
    body('email')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Enter email')
      .isEmail()
      .withMessage('Enter valid email'),
    body('password')
      .not()
      .isEmpty()
      .withMessage('Enter password')
      .isLength({ min: 8 })
      .withMessage('Use 8 characters or more for password')
      .isLength({ max: 50 })
      .withMessage('Use 50 characters or less for password'),
    body('confirmPassword')
      .not()
      .isEmpty()
      .withMessage('Confirm password')
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Passwords didn't match. Try again."),
  ];

  static signin = [
    body('email')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Enter email')
      .isEmail()
      .withMessage('Enter valid email'),
    body('password')
      .not()
      .isEmpty()
      .withMessage('Enter password')
      .isLength({ min: 8 })
      .withMessage(
        'Wrong password. Try again or click Forgot password to reset it.'
      )
      .isLength({ max: 50 })
      .withMessage(
        'Wrong password. Try again or click Forgot password to reset it.'
      ),
  ];
}
