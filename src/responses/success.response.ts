import { Response } from 'express';

import { StatusCode } from 'constants/status-code';

import { BaseResponse } from './_base.response';

export class SuccessResponse<T> extends BaseResponse<T> {
  protected statusCode = StatusCode.Ok;

  protected apiResponse = {
    data: this.data,
  };

  constructor(res: Response, private data: T) {
    super(res);
  }
}
