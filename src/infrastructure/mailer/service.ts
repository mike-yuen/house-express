import sgMail from '@sendgrid/mail';
import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';
import Util from 'util';

import { IMailerService } from '@/core/application/mailer';
import { provideSingleton } from '@/infrastructure/ioc';

const ReadFile = Util.promisify(fs.readFile);

@provideSingleton(MailerService)
export class MailerService implements IMailerService {
  private sgMail: any;

  constructor() {
    this.sgMail = sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  public async sendEmailVerification(to: string, code: number): Promise<{ delivered: number; status: string }> {
    const templatePath = path.resolve(__dirname, './templates', 'verifyEmail.html');
    const content = await ReadFile(templatePath, 'utf8');
    const template = Handlebars.compile(content);
    const html = template({ verificationCode: code });
    const data = {
      from: 'Mikey <nhatminh.150596@gmail.com>',
      to: to, // your email address
      subject: 'Email Confirmation',
      html,
    };
    this.sgMail
      .send(data)
      .then(() => {
        console.log('success');
      })
      .catch((e: any) => {
        console.log('failed', e.response.body.errors);
      });
    return { delivered: 1, status: 'ok' };
  }

  // public startEmailSequence(sequenceType: string, user: Partial<User>) {
  //   if (!user.email) {
  //     throw new Error('No email provided');
  //   }
  //   // @TODO Add example of an email sequence implementation
  //   // Something like
  //   // 1 - Send first email of the sequence
  //   // 2 - Save the step of the sequence in database
  //   // 3 - Schedule job for second email in 1-3 days or whatever
  //   // Every sequence can have its own behavior so maybe
  //   // the pattern Chain of Responsibility can help here.
  //   return { delivered: 1, status: 'ok' };
  // }
}
