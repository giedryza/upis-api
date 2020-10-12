import { BaseError } from 'types/base/error.base';
import { StatusCode } from 'constants/status-code';

export class BadRequestError extends BaseError {
  statusCode = StatusCode.BadRequest;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serialize() {
    return [{ message: this.message }];
  }
}
