import Agenda from 'agenda';

import config from '@/crossCutting/config';
import EmailSequenceJob from '@/infrastructure/mailer/emailSequence';

async function sendWelcomeEmail(agenda: Agenda): Promise<void> {
  agenda.define(
    'send-email',
    { priority: 'high', concurrency: config.agenda.concurrency },
    new EmailSequenceJob().handler,
  );
  await agenda.start();
}

export const jobsLoader = [sendWelcomeEmail];
