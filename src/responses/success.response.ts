import { Response } from 'express';

import { BaseResponse } from 'responses/_base.response';
import { StatusCode } from 'constants/status-code';

export class SuccessResponse<T> extends BaseResponse<T> {
  protected statusCode = StatusCode.Ok;

  protected apiResponse = {
    data: this.data,
  };

  constructor(res: Response, private data: T) {
    super(res);
  }
}
