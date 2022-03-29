import { StatusCode } from 'constants/status-code';

import { BaseError } from './_base.error';

export class NotFoundError extends BaseError {
  statusCode = StatusCode.NotFound;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serialize = () => [{ message: this.message }];
}
