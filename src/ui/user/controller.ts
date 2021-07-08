// import { Request, Response, NextFunction } from 'express';
// import { Service, Inject } from 'typedi';
// import { Logger } from 'winston';

// import { SuccessResponse } from '@/crossCutting/responseHandler/httpResponse';
import { UserService } from './service';
import { Controller, Get, Route, Tags } from 'tsoa';
import { inject, provideSingleton } from '@/infrastructure/ioc';
import { IUserOutputDTO } from '@/core/application/user/dto';
import { IUserService } from '@/core/application/user/service';

@Route('users')
@Tags('users')
@provideSingleton(UserController)
export class UserController extends Controller {
  constructor(@inject(UserService) private readonly userService: IUserService) {
    super();
  }

  /**
   * @summary Find all users
   */
  @Get()
  public async getAll(): Promise<IUserOutputDTO[]> {
    const user = await this.userService.getAll();
    return user;
  }

  // public getUserById = async (req: any, res: Response, next: NextFunction) => {
  //   try {
  //     const { user } = await this.userService.getUserById(req.token.id);
  //     return new SuccessResponse({ user }).send(res);
  //   } catch (e) {
  //     return next(e);
  //   }
  // };
}
