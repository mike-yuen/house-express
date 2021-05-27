import { Request, Response, NextFunction } from 'express';
import { Service, Inject } from 'typedi';
import { Logger } from 'winston';

import { IUserInputDTO } from '@/api/users/interface';
import { CreateSuccessResponse, SuccessResponse } from '@/utils/responseHandler/httpResponse';
import AuthService from './service';

@Service()
export default class AuthController {
  constructor(
    // @Injection
    @Inject('logger') private logger: Logger,
    private readonly authService: AuthService,
  ) {}

  public SignUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, token } = await this.authService.SignUp(req.body as IUserInputDTO);
      return new CreateSuccessResponse({ user, token }).send(res);
    } catch (e) {
      return next(e);
    }
  };

  public SignIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const { user, token, refreshToken } = await this.authService.SignIn(email, password);

      return res
        .status(200)
        .cookie('jt', token, { httpOnly: true })
        .cookie('rjt', refreshToken, { httpOnly: true })
        .json({ user });
    } catch (e) {
      return next(e);
    }
  };

  public SignOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie('xs');
      return new SuccessResponse('User logged out successfully').send(res);
    } catch (e) {
      return next(e);
    }
  };
}
