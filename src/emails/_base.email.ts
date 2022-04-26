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
    if (process.env.NODE_ENV === 'production') {
      return {
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      };
    }

    return {
      host: process.env.MAILTRAP_HOST,
      port: +process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    };
  }

  private transporter = createTransport(this.connection);

  private get template() {
    const filepath = join(__dirname, `templates/${this.name}.mjml`);
    const content = readFileSync(filepath);
    const template = compile(content.toString());

    return template;
  }

  private get html() {
    const mjml = this.template({
      ...this.context,
      logoUrl512: APP.files.logo[512],
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
