import { createTransport, SendMailOptions } from 'nodemailer';

interface SendOptions {
  to: string[];
  subject: string;
  text: string;
}

class EmailService {
  private transporter = createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '36f6a9833ff738',
      pass: 'b1d2eec14f8ac1',
    },
  });

  send = ({ to, subject, text }: SendOptions) => {
    const mailOptions: SendMailOptions = {
      from: 'Upis <info@upis.lt>',
      to,
      subject,
      html: `<p>${text}</p>`,
    };

    return this.transporter.sendMail(mailOptions);
  };
}

export const emailService = new EmailService();
