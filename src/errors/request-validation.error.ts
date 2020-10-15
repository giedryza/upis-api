import { ValidationError } from 'express-validator';
import { BaseError } from 'types/base/error.base';
import { StatusCode } from 'constants/status-code';

export class RequestValidationError extends BaseError {
  statusCode = StatusCode.BadRequest;

  constructor(public errors: ValidationError[]) {
    super('Invalid request');

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serialize = () =>
    this.errors.map((error) => ({ message: error.msg, field: error.param }));
}
