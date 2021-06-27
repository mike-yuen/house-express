// import { Request, Response, NextFunction } from 'express';
// import { Service, Inject } from 'typedi';
// import { Logger } from 'winston';

// import { SuccessResponse } from '@/crossCutting/responseHandler/httpResponse';
import { UserService } from './service';
import { Get, Route } from 'tsoa';
import { inject, provideSingleton } from '@/infrastructure/ioc';
import { IUserService } from '@/core/application/user/service';
import { IUserOutputDTO } from './interface';

@Route('users')
@provideSingleton(UserController)
export class UserController {
  constructor(@inject(UserService) private readonly userService: IUserService) {}

  @Get()
  public async getAll(): Promise<IUserOutputDTO[]> {
    const user = await this.userService.getAll();
    console.log('_____', user);
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
