import { StatusCode } from 'constants/status-code';

import { BaseError } from './_base.error';

export class UnauthorizedError extends BaseError {
  statusCode = StatusCode.Unauthorized;

  constructor() {
    super('Not authorized');

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serialize = () => [{ message: 'Not authorized' }];
}
