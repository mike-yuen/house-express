import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import argon2 from 'argon2';
// import MailerService from './mailer';
import config from '@/config';
import { IUserOutputDTO, IUserInputDTO } from '@/modules/users/interface';
import { EventDispatcher, EventDispatcherInterface } from '@/utils/decorators/eventDispatcher';
import events from '@/modules/users/events/eventNames';
import UserRepository from '@/modules/users/repository';
import { Logger } from 'winston';

@Service()
export default class AuthService {
  constructor(
    // private mailer: MailerService,
    private readonly userRepository: UserRepository,
    @Inject('logger') private logger: Logger,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  public SignUp = async (userInputDTO: IUserInputDTO): Promise<{ user: IUserOutputDTO; token: string }> => {
    try {
      const salt = randomBytes(32);
      const hashedPassword = await argon2.hash(userInputDTO.password, { salt });
      const user = await this.userRepository.create({
        ...userInputDTO,
        salt: salt.toString('hex'),
        password: hashedPassword,
      });
      const token = this.generateToken(user);
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');
      // this.logger.silly('Sending welcome email');
      // await this.mailer.SendWelcomeEmail(userRecord);
      this.eventDispatcher.dispatch(events.user.signUp, { user });

      return { user, token };
    } catch (e) {
      this.logger.error('🔥 error %o', e);
      throw e;
    }
  };

  public SignIn = async (email: string, password: string): Promise<{ user: IUserOutputDTO; token: string }> => {
    try {
      const user = await this.userRepository.findOne({ email });

      /* We use verify from argon2 to prevent 'timing based' attacks */
      this.logger.silly('Checking password');
      const validPassword = await argon2.verify(user.password, password);

      if (validPassword) {
        this.logger.silly('Password is valid!');
        this.logger.silly('Generating JWT');
        const token = this.generateToken(user);

        Reflect.deleteProperty(user, 'password');
        Reflect.deleteProperty(user, 'salt');
        return { user, token };
      } else {
        throw new Error('Invalid Password');
      }
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  };

  private generateToken = user => {
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
  };
}
