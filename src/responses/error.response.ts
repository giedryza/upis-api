import { Response } from 'express';

import { ApiError } from 'errors';
import { StatusCode } from 'constants/status-code';

import { BaseResponse } from './_base.response';

export class ErrorResponse extends BaseResponse<ApiError[]> {
  protected apiResponse = {
    data: this.data,
    isAppError: true,
  };

  constructor(
    res: Response,
    protected statusCode: StatusCode,
    private data: ApiError[]
  ) {
    super(res);
  }
}
