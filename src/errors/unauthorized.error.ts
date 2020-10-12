import { BaseError } from 'types/base/error.base';
import { StatusCode } from 'constants/status-code';

export class UnauthorizedError extends BaseError {
  statusCode = StatusCode.Unauthorized;

  constructor() {
    super('Not authorized');

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serialize() {
    return [{ message: 'Not authorized' }];
  }
}