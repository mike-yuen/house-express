import Agenda from 'agenda';

import config from '@/crossCutting/config';
import EmailSequenceJob from '@/api/mailer/jobs/emailSequence';

export default ({ agenda }: { agenda: Agenda }) => {
  agenda.define(
    'send-email',
    { priority: 'high', concurrency: config.agenda.concurrency },
    // @TODO Could this be a static method? Would it be better?
    new EmailSequenceJob().handler,
  );

  agenda.start();
};
