import { BaseResponse } from 'responses/_base.response';
import { StatusCode } from 'constants/status-code';

export class NoContentResponse extends BaseResponse<string> {
  protected statusCode = StatusCode.NoContent;

  protected apiResponse = {
    data: '',
  };
}
