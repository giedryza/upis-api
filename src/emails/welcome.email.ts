import { BaseEmail } from './_base.email';

export class WelcomeEmail extends BaseEmail {
  protected name = 'welcome';

  protected subject = 'Welcome';

  constructor(
    protected context: {
      name: string;
    }
  ) {
    super(context);
  }
}
