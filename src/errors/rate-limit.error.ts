import { BaseError } from 'errors/_base.error';
import { StatusCode } from 'constants/status-code';

export class RateLimitError extends BaseError {
  statusCode = StatusCode.TooManyRequests;

  constructor(private resetTime?: Date) {
    super('Rate limit reached');

    Object.setPrototypeOf(this, RateLimitError.prototype);
  }

  private get remaining() {
    if (!this.resetTime) return null;

    const now = new Date().getTime();
    const reset = new Date(this.resetTime).getTime();

    return Math.ceil((reset - now) / (1000 * 60));
  }

  private get serializedMessage() {
    return `Too many requests. Try again ${
      this.resetTime ? `in ${this.remaining} minutes` : 'later'
    }.`;
  }

  serialize() {
    return [{ message: this.serializedMessage }];
  }
}
