import { StatusCode } from 'constants/status-code';

export interface ApiError {
  message: string;
  field?: string;
}

export abstract class BaseError extends Error {
  abstract statusCode: StatusCode;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, BaseError.prototype);
  }

  abstract serialize: () => ApiError[];
}
