import { Request as ERequest } from 'express';
import { Body, Controller, Post, Request, Res, Route, Security, Tags, TsoaResponse } from 'tsoa';

import { COOKIE_KEY, ISignInInput, ISignInOutput } from '@/core/application/auth';
import { IUserOutputDTO } from '@/core/domainService/user';
import { inject, provideSingleton } from '@/infrastructure/ioc';

import { COOKIE_EXPIRATION } from './constants';
import { AuthService } from './service';
import { MailerService } from '@/infrastructure/mailer/service';
// import { MailerService } from '@/infrastructure/mailer/service';

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
  ): Promise<{ user: IUserOutputDTO }> {
    try {
      const { user } = await this.authService.signUp(requestBody);
      return { user };
    } catch (e) {
      return errorResponse(e.statusCode, { message: e.message });
    }
  }

  /**
   * @summary Login to an awesome site
   */
  @Post('/signin')
  public async SignIn(
    @Body() requestBody: ISignInInput,
    @Res() errorResponse: TsoaResponse<404, { message: string }>,
  ): Promise<ISignInOutput> {
    try {
      const { email, password } = requestBody;
      const { user, token, refreshToken } = await this.authService.signIn(email, password);

      if (token && refreshToken) {
        this.setHeader('Set-Cookie', [`testToken=${token}; HttpOnly; Secure; Same-Site=None`]);
        return {
          user,
          [COOKIE_KEY.token]: { value: token, maxAge: COOKIE_EXPIRATION.token },
          [COOKIE_KEY.refreshToken]: { value: refreshToken, maxAge: COOKIE_EXPIRATION.refreshToken },
        };
      }
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

  @Post('/verify-email')
  public async VerifyEmail(
    @Request() request: any,
    @Body() requestBody: any,
    @Res() errorResponse: TsoaResponse<404, { message: string }>,
  ): Promise<{ user: IUserOutputDTO }> {
    try {
      const { email, code } = requestBody;
      const { user } = await this.authService.verifyEmail(email, code);
      return { user };
    } catch (e) {
      return errorResponse(e.statusCode, { message: e.message });
    }
  }

  /**
   * @summary Goodbye my friend
   */
  @Security('Authorization')
  @Post('/signout')
  public async SignOut(@Request() request: any, @Body() requestBody: any): Promise<string> {
    try {
      await this.authService.SignOut(request.user.refreshToken, requestBody);
      return 'User logged out successfully';
    } catch (e) {
      console.log(e);
    }
  }
}
