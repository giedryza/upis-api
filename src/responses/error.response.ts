import { Response } from 'express';

import { BaseResponse } from 'responses/_base.response';
import { ApiError } from 'errors';
import { StatusCode } from 'constants/status-code';

export class ErrorResponse extends BaseResponse<ApiError[]> {
  protected apiResponse = {
    data: this.data,
  };

  constructor(
    res: Response,
    protected statusCode: StatusCode,
    private data: ApiError[]
  ) {
    super(res);
  }
}
