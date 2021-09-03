import { Request as ERequest } from 'express';
import { Body, Controller, Header, Post, Request, Res, Route, Security, Tags, TsoaResponse } from 'tsoa';

import { IUserOutputDTO } from '@/core/domainService/user';
import { provideSingleton } from '@/infrastructure/ioc';

import { COOKIE_KEY, COOKIE_EXPIRATION } from './constants';
import { AuthService } from './service';

@Route('auth')
@Tags('auth')
@provideSingleton(AuthController)
export class AuthController extends Controller {
  constructor(private readonly authService: AuthService) {
    super();
  }

  /**
   * @summary Create user
   */
  @Post('/signup')
  public async SignUp(
    @Body() requestBody: any,
    @Res() errorResponse: TsoaResponse<404, { message: string }>,
  ): Promise<{ user: IUserOutputDTO; token: string }> {
    try {
      const { user, token } = await this.authService.signUp(requestBody);
      return { user, token };
    } catch (e) {
      return errorResponse(e.statusCode, { message: e.message });
    }
  }

  /**
   * @summary Login to an awesome site
   */
  @Post('/signin')
  public async SignIn(
    @Body() requestBody: any,
    @Res() errorResponse: TsoaResponse<404, { message: string }>,
  ): Promise<IUserOutputDTO> {
    try {
      const { email, password } = requestBody;
      const { user, token, refreshToken } = await this.authService.signIn(email, password);

      // Add Secure in production
      if (token && refreshToken) {
        this.setHeader('Set-Cookie', [
          `${COOKIE_KEY.token}=${token}; Max-Age=${COOKIE_EXPIRATION.token}; SameSite=None; Secure; HttpOnly;`,
          `${COOKIE_KEY.refreshToken}=${refreshToken}; Max-Age=${COOKIE_EXPIRATION.refreshToken}; SameSite=None; Secure; HttpOnly;`,
        ]);
      }

      return user;
    } catch (e) {
      return errorResponse(e.statusCode, { message: e.message });
    }
  }

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

  /**
   * @summary Goodbye my friend
   */
  @Security('X-Auth-Jwt-Cookie')
  @Post('/signout')
  public async SignOut(@Request() request: ERequest, @Body() requestBody: any): Promise<string> {
    try {
      console.log('request: ', request.cookies);
      // request.user
      // await this.authService.SignOut(req.refreshToken, requestBody);

      this.setHeader('Set-Cookie', [
        `${COOKIE_KEY.token}=""; HttpOnly; Max-Age=0;`,
        `${COOKIE_KEY.refreshToken}=""; HttpOnly; Max-Age=0`,
      ]);

      return 'User logged out successfully';
    } catch (e) {
      console.log(e);
    }
  }
}
