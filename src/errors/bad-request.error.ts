import { StatusCode } from 'constants/status-code';

import { BaseError } from './_base.error';

export class BadRequestError extends BaseError {
  statusCode = StatusCode.BadRequest;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serialize = () => [{ message: this.message }];
}
