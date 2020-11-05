import { BaseError } from 'errors/_base.error';
import { StatusCode } from 'constants/status-code';

export class BadRequestError extends BaseError {
  statusCode = StatusCode.BadRequest;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serialize = () => [{ message: this.message }];
}
