import { ValidationError } from 'express-validator';

import { StatusCode } from 'constants/status-code';

import { BaseError } from './_base.error';

export class RequestValidationError extends BaseError {
  statusCode = StatusCode.BadRequest;

  constructor(public errors: Pick<ValidationError, 'msg' | 'param'>[]) {
    super('Invalid request');

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serialize = () =>
    this.errors.map((error) => ({ message: error.msg, field: error.param }));
}
