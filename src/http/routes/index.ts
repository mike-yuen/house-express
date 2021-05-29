import { Router } from 'express';

import agendash from '@/api/agendash/route';
import auth from '@/api/auth/routes';
import user from '@/api/users/routes';

// guaranteed to get dependencies
export default () => {
  const app = Router();
  auth(app);
  user(app);
  agendash(app);

  return app;
};
