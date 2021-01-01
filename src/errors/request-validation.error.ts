import { ValidationError } from 'express-validator';
import { BaseError } from 'errors/_base.error';
import { StatusCode } from 'constants/status-code';

export class RequestValidationError extends BaseError {
  statusCode = StatusCode.BadRequest;

  constructor(public errors: Pick<ValidationError, 'msg' | 'param'>[]) {
    super('Invalid request');

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serialize = () =>
    this.errors.map((error) => ({ message: error.msg, field: error.param }));
}
