import { BaseError } from 'types/base/error.base';
import { StatusCode } from 'constants/status-code';

export class NotFoundError extends BaseError {
  statusCode = StatusCode.NotFound;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serialize() {
    return [{ message: this.message }];
  }
}
