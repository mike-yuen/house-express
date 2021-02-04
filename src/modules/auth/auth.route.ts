import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import AuthService from './auth.service';
import { IUserInputDTO } from '../users/user.interface';
import middlewares from './middlewares';
import { Logger } from 'winston';
import * as userSchema from './auth.validator';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  // @POST: /signup
  route.post('/signup', userSchema.SignUpSchema, async (req: Request, res: Response, next: NextFunction) => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling Sign-Up endpoint with body: %o', req.body);
    try {
      const authServiceInstance = Container.get(AuthService);
      const { user, token } = await authServiceInstance.SignUp(req.body as IUserInputDTO);
      return res.status(201).json({ user, token });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  });

  // @POST: /signin
  route.post('/signin', userSchema.SignInSchema, async (req: Request, res: Response, next: NextFunction) => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling Sign-In endpoint with body: %o', req.body);
    try {
      const { email, password } = req.body;
      const authServiceInstance = Container.get(AuthService);
      const { user, token } = await authServiceInstance.SignIn(email, password);
      return res.json({ user, token }).status(200);
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  });

  /**
   * @TODO Let's leave this as a place holder for now
   * The reason for a logout route could be deleting a 'push notification token'
   * so the device stops receiving push notifications after logout.
   *
   * Another use case for advance/enterprise apps, you can store a record of the jwt token
   * emitted for the session and add it to a black list.
   * It's really annoying to develop that but if you had to, please use Redis as your data store
   */
  route.post('/logout', middlewares.isAuth, (req: Request, res: Response, next: NextFunction) => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling Sign-Out endpoint with body: %o', req.body);
    try {
      //@TODO AuthService.Logout(req.user) do some clever stuff
      return res.status(200).end();
    } catch (e) {
      logger.error('🔥 error %o', e);
      return next(e);
    }
  });
};
