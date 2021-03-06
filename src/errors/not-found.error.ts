import { BaseError } from 'errors/_base.error';
import { StatusCode } from 'constants/status-code';

export class NotFoundError extends BaseError {
  statusCode = StatusCode.NotFound;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serialize = () => [{ message: this.message }];
}
