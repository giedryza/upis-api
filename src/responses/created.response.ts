import { Response } from 'express';

import { StatusCode } from 'constants/status-code';

import { BaseResponse } from './_base.response';

export class CreatedResponse<T> extends BaseResponse<T> {
  protected statusCode = StatusCode.Created;

  protected apiResponse = {
    data: this.data,
  };

  constructor(res: Response, private data: T) {
    super(res);
  }
}
