import { Router, Request, Response } from 'express';

import middlewares from '@/modules/auth/middlewares';
import { SuccessResponse } from '@/utils/responseHandler/httpResponse';

const route = Router();

export default (app: Router) => {
  app.use('/users', route);

  route.get('/me', middlewares.isAuth, middlewares.attachCurrentUser, (req: Request, res: Response) => {
    return new SuccessResponse({ user: req.currentUser }).send(res);
  });
};
