import { BaseEmail } from './_base.email';

export class ResetPasswordEmail extends BaseEmail {
  protected name = 'reset-password';

  protected subject = 'Password Reset';

  constructor(
    protected context: {
      email: string;
      url: string;
    }
  ) {
    super(context);
  }
}
