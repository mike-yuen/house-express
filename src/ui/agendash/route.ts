import { Router } from 'express';
import basicAuth from 'express-basic-auth';
import agendash from 'agendash';
import { Container } from 'typedi';

import config from '@/crossCutting/config';

export default (app: Router) => {
  const agendaInstance = Container.get('agendaInstance');

  app.use(
    '/agendash',
    basicAuth({
      users: {
        [config.agendash.user]: config.agendash.password,
      },
      challenge: true,
    }),
    agendash(agendaInstance),
  );
};
