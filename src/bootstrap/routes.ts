import { Router } from 'express';
import auth from '../modules/auth/auth.route';
import user from '../modules/users/user.route';
import agendash from '../modules/agendadash/agendash.route';

// guaranteed to get dependencies
export default () => {
  const app = Router();
  auth(app);
  user(app);
  agendash(app);

  return app;
};
