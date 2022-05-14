import { join } from 'path';
import { readFileSync } from 'fs';
import { createTransport, SendMailOptions } from 'nodemailer';
import { compile } from 'handlebars';
import { convert } from 'html-to-text';
import mjml2html from 'mjml';

import { APP } from 'config';

export abstract class BaseEmail {
  protected abstract name: string;

  protected abstract subject: string;

  constructor(protected context: Record<string, string | number>) {}

  private get connection() {
    if (APP.root.env === 'production') {
      return {
        service: 'SendGrid',
        auth: {
          user: APP.sendgrid.username,
          pass: APP.sendgrid.password,
        },
      };
    }

    return {
      host: APP.mailtrap.host,
      port: APP.mailtrap.port,
      auth: {
        user: APP.mailtrap.username,
        pass: APP.mailtrap.password,
      },
    };
  }

  private transporter = createTransport(this.connection);

  private get template() {
    const filepath = join(__dirname, `templates/${this.name}.mjml`);
    const content = readFileSync(filepath);

    return compile(content.toString());
  }

  private get html() {
    const mjml = this.template({
      ...this.context,
      logoUrl512: APP.assets.logo[512],
    });
    const { html } = mjml2html(mjml, { validationLevel: 'strict' });

    return html;
  }

  send = (to: string[]) => {
    const mailOptions: SendMailOptions = {
      from: `${APP.name} <${APP.email.info}>`,
      to,
      subject: this.subject,
      html: this.html,
      text: convert(this.html),
    };

    return this.transporter.sendMail(mailOptions);
  };
}
