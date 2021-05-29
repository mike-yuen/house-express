import { Router } from 'express';
import { Container } from 'typedi';

import AuthController from './controllers';
import AuthMiddleware from './middewares';
import * as userSchema from './validators';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);
  const authController: AuthController = Container.get(AuthController);
  const authMiddleware: AuthMiddleware = Container.get(AuthMiddleware);

  // @POST: /signup
  route.post('/signup', userSchema.SignUpSchema, authController.SignUp);

  // @POST: /signin
  route.post('/signin', userSchema.SignInSchema, authController.SignIn);

  // @POST: /signout
  route.post('/signout', authMiddleware.getToken, authController.SignOut);

  // /**
  //  * @TODO Let's leave this as a place holder for now
  //  * The reason for a logout route could be deleting a 'push notification token'
  //  * so the device stops receiving push notifications after logout.
  //  *
  //  * Another use case for advance/enterprise apps, you can store a record of the jwt token
  //  * emitted for the session and add it to a black list.
  //  * It's really annoying to develop that but if you had to, please use Redis as your data store
  //  */
  // route.post('/logout', middlewares.isAuth, (req: Request, res: Response, next: NextFunction) => {
  //   logger.debug('Calling Sign-Out endpoint with body: %o', req.body);
  //   try {
  //     //@TODO AuthService.Logout(req.user) do some clever stuff
  //     return res.status(200).end();
  //   } catch (e) {
  //     logger.error('🔥 error %o', e);
  //     return next(e);
  //   }
  // });
};
