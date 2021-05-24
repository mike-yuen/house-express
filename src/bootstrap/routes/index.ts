import { Router } from 'express';

import agendash from '@/modules/agendash/route';
import auth from '@/modules/auth/route';
import user from '@/modules/users/route';

// guaranteed to get dependencies
export default () => {
  const app = Router();
  auth(app);
  user(app);
  agendash(app);

  return app;
};
