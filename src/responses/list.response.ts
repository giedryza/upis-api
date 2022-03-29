import { Response } from 'express';

import { StatusCode } from 'constants/status-code';

import { BaseResponse, Meta } from './_base.response';

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
