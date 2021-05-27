import { Router } from 'express';

import agendash from '@/api/agendash/route';
import auth from '@/api/auth/route';
import user from '@/api/users/route';

// guaranteed to get dependencies
export default () => {
  const app = Router();
  auth(app);
  user(app);
  agendash(app);

  return app;
};
