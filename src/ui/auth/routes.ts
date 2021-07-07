// import { Router } from 'express';
// import { Container } from 'typedi';

// import AuthController from './controller';
// import AuthMiddleware from './middewares';
// import * as userSchema from './validators';

// const route = Router();

// export default (app: Router) => {
//   app.use('/auth', route);
//   const authController: AuthController = Container.get(AuthController);
//   const authMiddleware: AuthMiddleware = Container.get(AuthMiddleware);

//   // @POST: /signup
//   route.post('/signup', userSchema.SignUpSchema, authController.SignUp);

//   // @POST: /signin
//   route.post('/signin', userSchema.SignInSchema, authController.SignIn);

//   // @POST: /refresh-token
//   route.post('/refresh-token', authMiddleware.getRefreshToken, authController.RefreshToken);

//   // @POST: /signout
//   route.post('/signout', authMiddleware.getToken, authMiddleware.getRefreshToken, authController.SignOut);
// };
