// import { Router } from 'express';
// import Container from 'typedi';

// import AuthMiddleware from '@/ui/auth/middewares';

// import UserController from './controller';

// const route = Router();

// export default (app: Router) => {
//   app.use('/users', route);
//   const authMiddleware: AuthMiddleware = Container.get(AuthMiddleware);
//   const userController: UserController = Container.get(UserController);

//   // @GET: /me
//   route.get('/me', authMiddleware.getToken, userController.getUserById);
// };