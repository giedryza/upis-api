import { Response } from 'express';

import { StatusCode } from 'constants/status-code';
import { Pagination } from 'domain/pagination/pagination.types';

interface ApiResponse<T> {
  data: T;
  meta?: Pagination;
  isAppError?: boolean;
}

export abstract class BaseResponse<T> {
  protected abstract statusCode: StatusCode;

  protected abstract apiResponse: ApiResponse<T>;

  constructor(private res: Response) {}

  send = () => this.res.status(this.statusCode).json(this.apiResponse);
}
