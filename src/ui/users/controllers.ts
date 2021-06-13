import { Request, Response, NextFunction } from 'express';
import { Service, Inject } from 'typedi';
import { Logger } from 'winston';

import { SuccessResponse } from '@/crossCutting/responseHandler/httpResponse';
import UserService from './services';

@Service()
export default class UserController {
  constructor(
    // @Injection
    @Inject('logger') private logger: Logger,
    private readonly userService: UserService,
  ) {}

  public getUserById = async (req: any, res: Response, next: NextFunction) => {
    try {
      const { user } = await this.userService.getUserById(req.token.id);
      return new SuccessResponse({ user }).send(res);
    } catch (e) {
      return next(e);
    }
  };
}
