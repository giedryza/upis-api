import { Response } from 'express';

import { StatusCode } from 'constants/status-code';
import { Pagination } from 'domain/pagination/pagination.types';

import { BaseResponse } from './_base.response';

export class ListResponse<T> extends BaseResponse<T> {
  protected statusCode = StatusCode.Ok;

  protected apiResponse = {
    meta: this.meta,
    data: this.data,
  };

  constructor(res: Response, private data: T, private meta: Pagination) {
    super(res);
  }
}
