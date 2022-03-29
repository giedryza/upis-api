import { StatusCode } from 'constants/status-code';

import { BaseResponse } from './_base.response';

export class NoContentResponse extends BaseResponse<string> {
  protected statusCode = StatusCode.NoContent;

  protected apiResponse = {
    data: '',
  };
}
