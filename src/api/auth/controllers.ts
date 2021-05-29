import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';

import { IUserInputDTO } from '@/api/users/interfaces';
import { CreateSuccessResponse, SuccessResponse } from '@/utils/responseHandler/httpResponse';

import { COOKIE_KEY, COOKIE_EXPIRATION } from './constants';
import AuthService from './services';

@Service()
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

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
        .cookie(COOKIE_KEY.token, token, { httpOnly: true, secure: false, maxAge: COOKIE_EXPIRATION.token })
        .cookie(COOKIE_KEY.refreshToken, refreshToken, {
          httpOnly: true,
          secure: false,
          maxAge: COOKIE_EXPIRATION.refreshToken,
        })
        .json({ user });
    } catch (e) {
      return next(e);
    }
  };

  public SignOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie(COOKIE_KEY.token);
      return new SuccessResponse('User logged out successfully').send(res);
    } catch (e) {
      return next(e);
    }
  };
}
