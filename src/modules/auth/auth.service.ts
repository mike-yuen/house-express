import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
// import MailerService from './mailer';
import config from '../../config';
import argon2 from 'argon2';
import { IUserOutputDTO, IUserInputDTO } from '../users/user.interface';
import { EventDispatcher, EventDispatcherInterface } from '../../decorators/eventDispatcher';
import events from '../../subscribers/events';
import UserRepository from '@/modules/users/user.repository';

@Service()
export default class AuthService {
  constructor(
    // private mailer: MailerService,
    private userRepository: UserRepository,
    @Inject('logger') private logger,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async SignUp(userInputDTO: IUserInputDTO): Promise<{ user: IUserOutputDTO; token: string }> {
    try {
      const user = await this.userRepository.SignUp(userInputDTO);

      const token = this.generateToken(user);
      // this.logger.silly('Sending welcome email');
      // await this.mailer.SendWelcomeEmail(userRecord);

      this.eventDispatcher.dispatch(events.user.signUp, { user });

      return { user, token };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async SignIn(email: string, password: string): Promise<{ user: IUserOutputDTO; token: string }> {
    try {
      const user = await this.userRepository.SignIn(email, password);
      const token = this.generateToken(user);
      return { user, token };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  private generateToken(user) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    this.logger.silly(`Sign JWT for userId: ${user._id}`);
    return jwt.sign(
      {
        id: user.id, // We are gonna use this in the middleware 'isAuth'
        role: user.role,
        username: user.username,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret,
    );
  }
}
