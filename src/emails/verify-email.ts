import { BaseEmail } from './_base.email';

export class VerifyEmailEmail extends BaseEmail {
  protected name = 'verify-email';

  protected subject = 'Verify Email';

  constructor(
    protected context: {
      url: string;
    }
  ) {
    super(context);
  }
}
