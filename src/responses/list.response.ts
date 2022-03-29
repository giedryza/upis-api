import { Response } from 'express';

import { BaseResponse, Meta } from 'responses/_base.response';
import { StatusCode } from 'constants/status-code';

export class ListResponse<T> extends BaseResponse<T> {
  protected statusCode = StatusCode.Ok;

  protected apiResponse = {
    meta: this.meta,
    data: this.data,
  };

  constructor(res: Response, private data: T, private meta: Meta) {
    super(res);
  }
}
