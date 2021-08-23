import { Controller, Get, Route, Tags } from 'tsoa';

import { IUserService, IUserOutputDTO } from '@/core/application/user';
import { inject, provideSingleton } from '@/infrastructure/ioc';

import { UserService } from './service';
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
