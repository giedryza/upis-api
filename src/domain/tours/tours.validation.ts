import { checkSchema } from 'express-validator';

import { BadRequestError } from 'errors';

export class Validation {
  static create = checkSchema({
    name: {
      in: ['body'],
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: 'Enter tour name.',
      },
      isLength: {
        options: { max: 200 },
        errorMessage: 'Use 200 characters or less for name.',
      },
    },
    company: {
      in: ['body'],
      trim: true,
      isEmpty: {
        negated: true,
        errorMessage: 'Choose company.',
      },
      isMongoId: {
        errorMessage: () => {
          throw new BadRequestError('Choose valid company.');
        },
      },
    },
  });
}
