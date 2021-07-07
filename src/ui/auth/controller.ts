import { Body, Post, Route, Tags } from 'tsoa';
import { Service } from 'typedi';

import { IUserInputDTO, IUserOutputDTO } from '@/core/application/user/dto';
import { CreateSuccessResponse, SuccessResponse } from '@/crossCutting/responseHandler/httpResponse';
import { provideSingleton } from '@/infrastructure/ioc';

import { COOKIE_KEY, COOKIE_EXPIRATION } from './constants';
import AuthService from './service';

@Route('auth')
@Tags('auth')
@provideSingleton(AuthController)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @summary Find all users
   */
  @Post('/signup')
  public async SignUp(@Body() requestBody: any): Promise<{ user: IUserOutputDTO; token: string }> {
    const { user, token } = await this.authService.SignUp(requestBody);
    return { user, token };
  }

  // public SignIn = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const { email, password } = req.body;
  //     const { user, token, refreshToken } = await this.authService.SignIn(email, password);

  //     return res
  //       .status(200)
  //       .cookie(COOKIE_KEY.token, token, { httpOnly: true, secure: false, maxAge: COOKIE_EXPIRATION.token })
  //       .cookie(COOKIE_KEY.refreshToken, refreshToken, {
  //         httpOnly: true,
  //         secure: false,
  //         maxAge: COOKIE_EXPIRATION.refreshToken,
  //       })
  //       .json({ user });
  //   } catch (e) {
  //     return next(e);
  //   }
  // };

  // public RefreshToken = async (req: any, res: Response, next: NextFunction) => {
  //   try {
  //     const { token, refreshToken } = await this.authService.RefreshToken(req.refreshToken);
  //     return res
  //       .status(200)
  //       .cookie(COOKIE_KEY.token, token, { httpOnly: true, secure: false, maxAge: COOKIE_EXPIRATION.token })
  //       .cookie(COOKIE_KEY.refreshToken, refreshToken, {
  //         httpOnly: true,
  //         secure: false,
  //         maxAge: COOKIE_EXPIRATION.refreshToken,
  //       })
  //       .json({ message: 'Refresh token successfully.' });
  //   } catch (e) {
  //     return next(e);
  //   }
  // };

  // public SignOut = async (req: any, res: Response, next: NextFunction) => {
  //   try {
  //     await this.authService.SignOut(req.refreshToken, req.body);

  //     res.clearCookie(COOKIE_KEY.token);
  //     res.clearCookie(COOKIE_KEY.refreshToken);
  //     return new SuccessResponse('User logged out successfully').send(res);
  //   } catch (e) {
  //     return next(e);
  //   }
  // };
}
