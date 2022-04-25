import { BaseEmail } from './_base.email';

export class ResetPasswordEmail extends BaseEmail {
  protected name = 'reset-password';

  protected subject = 'Reset password';

  constructor(
    protected context: {
      url: string;
    }
  ) {
    super(context);
  }
}
