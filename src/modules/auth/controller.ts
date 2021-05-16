import { Request, Response, NextFunction } from 'express';
import { Service, Inject } from 'typedi';
import { Logger } from 'winston';
import { IUserInputDTO } from '@/modules/users/interface';
import AuthService from './service';

@Service()
export default class AuthController {
  constructor(
    // @Injection
    private readonly authService: AuthService,
    @Inject('logger') private logger: Logger,
  ) {}

  public SignUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, token } = await this.authService.SignUp(req.body as IUserInputDTO);
      return res.status(201).json({ user, token });
    } catch (e) {
      this.logger.error('🔥 error: %o', e);
      return next(e);
    }
  };

  public SignIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.authService.SignIn(email, password);
      return res.status(200).json({ user, token });
    } catch (e) {
      this.logger.error('🔥 error: %o', e);
      return next(e);
    }
  };
}
