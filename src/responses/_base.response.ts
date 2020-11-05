import { Response } from 'express';
import { StatusCode } from 'constants/status-code';

export interface Meta {
  total: number;
  page: number;
  limit: number;
}

interface ApiResponse<T> {
  meta?: Meta;
  data: T;
}

export abstract class BaseResponse<T> {
  protected abstract statusCode: StatusCode;

  protected abstract apiResponse: ApiResponse<T>;

  constructor(private res: Response) {}

  send = () => this.res.status(this.statusCode).json(this.apiResponse);
}
