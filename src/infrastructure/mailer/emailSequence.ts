import { Container } from 'typedi';
import { Logger } from 'winston';

import { MailerService } from './service';

export default class EmailSequenceJob {
  public async handler(job: any, done: any): Promise<void> {
    const Logger: Logger = Container.get('logger');

    try {
      Logger.debug('✌️ Email Sequence Job triggered!');
      const { email, code } = job.attrs.data;
      const mailerServiceInstance = Container.get(MailerService);

      await mailerServiceInstance.sendEmailVerification(email, code);
      done();
    } catch (e) {
      Logger.error('🔥 Error with Email Sequence Job: %o', e);
      done(e);
    }
  }
}
