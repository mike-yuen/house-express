import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import randtoken from 'rand-token';
import { Service, Inject } from 'typedi';
import { Logger } from 'winston';

import config from '@/config';
import events from '@/api/users/events/eventNames';
import { IUserOutputDTO, IUserInputDTO } from '@/api/users/interfaces';
import UserRepository from '@/api/users/repositories';
import RedisService from '@/http/redis';
import { EventDispatcher, EventDispatcherInterface } from '@/utils/decorators/eventDispatcher';
import { NotFoundResponse } from '@/utils/responseHandler/httpResponse';

import { REDIS_SUFFIX } from './constants';
// import MailerService from './mailer';

@Service()
export default class AuthService {
  constructor(
    // private mailer: MailerService,
    private readonly userRepository: UserRepository,
    @Inject('logger') private logger: Logger,
    @Inject('redis') private redis: RedisService,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}

  private generateToken = user => {
    this.logger.silly(`Sign JWT for userId: ${user._id}`);
    return jwt.sign(
      {
        id: user.id, // We are gonna use this in the middleware 'isAuth'
        role: user.role,
        username: user.username,
      },
      config.jwtSecret,
      { expiresIn: '15m' },
    );
  };

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
      throw e;
    }
  };

  public SignIn = async (
    email: string,
    password: string,
  ): Promise<{ user: IUserOutputDTO; token: string; refreshToken: string }> => {
    try {
      const user = await this.userRepository.findOne({ email });

      /* We use verify from argon2 to prevent 'timing based' attacks */
      this.logger.silly('Checking password');
      const validPassword = await argon2.verify(user.password, password);

      if (validPassword) {
        this.logger.silly('Password is valid!');
        this.logger.silly('Generating JWT');
        const token = this.generateToken(user);
        const refreshToken = randtoken.uid(256);

        await this.redis.setArray(`${user.id}:${REDIS_SUFFIX.refreshToken}`, [refreshToken]);

        Reflect.deleteProperty(user, 'password');
        Reflect.deleteProperty(user, 'salt');
        return { user, token, refreshToken };
      } else {
        throw new NotFoundResponse('Invalid Password! Please check your password and try again.');
      }
    } catch (e) {
      throw e;
    }
  };
}
