import { createTransport, SendMailOptions } from 'nodemailer';

import { APP } from 'config';

interface SendOptions {
  to: string[];
  subject: string;
  text: string;
}

class EmailService {
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

  send = ({ to, subject, text }: SendOptions) => {
    const mailOptions: SendMailOptions = {
      from: `${APP.name} <${APP.email.info}>`,
      to,
      subject,
      html: `<p>${text}</p>`,
    };

    return this.transporter.sendMail(mailOptions);
  };
}

export const emailService = new EmailService();
