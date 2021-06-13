import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import randtoken from 'rand-token';
import { Service, Inject } from 'typedi';
import { Logger } from 'winston';

import config from '@/crossCutting/config';
import events from '@/ui/users/events/eventNames';
import { IUserOutputDTO, IUserInputDTO } from '@/ui/users/interfaces';
import UserRepository from '@/ui/users/repositories';
import RedisService from '@/crossCutting/redis';
import { EventDispatcher, EventDispatcherInterface } from '@/infrastructure/utils/decorators/eventDispatcher';
import { NotFoundResponse } from '@/crossCutting/responseHandler/httpResponse';

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

  private redisKey = (userId: string) => {
    return `user:${userId}:${REDIS_SUFFIX.refreshToken}`;
  };

  private generateToken = user => {
    this.logger.silly(`Sign JWT for userId: ${user._id}`);
    return jwt.sign(
      {
        id: user.id, // Will use this in the middleware 'getToken'
        username: user.username,
      },
      config.jwtSecret,
      { expiresIn: '1d' },
    );
  };

  private generateRefreshToken = (user, key: string) => {
    this.logger.silly(`Generate refresh token JWT for userId: ${user._id}`);
    return jwt.sign(
      {
        id: user.id,
        refreshKey: key,
      },
      config.jwtSecret,
      { expiresIn: '7d' },
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

        const refreshKey = randtoken.uid(256);
        await this.redis.setArray(this.redisKey(user.id), [refreshKey]);

        const refreshToken = this.generateRefreshToken(user, refreshKey);

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

  public RefreshToken = async (currentRefreshToken): Promise<{ token: string; refreshToken: string }> => {
    try {
      const refreshKeyList = await this.redis.getArray(this.redisKey(currentRefreshToken.id));

      if (refreshKeyList.includes(currentRefreshToken.refreshKey)) {
        const user = await this.userRepository.findOne({ _id: currentRefreshToken.id });

        const token = this.generateToken(user);
        const refreshKey = randtoken.uid(256);

        await this.redis.deleteValueInArray(this.redisKey(user.id), currentRefreshToken.refreshKey);
        await this.redis.setArray(this.redisKey(user.id), [refreshKey]);

        const refreshToken = this.generateRefreshToken(user, refreshKey);

        return { token, refreshToken };
      } else {
        throw new NotFoundResponse('Refresh token not existing! Please check your token and try again.');
      }
    } catch (e) {
      throw e;
    }
  };

  public SignOut = async (currentRefreshToken, options): Promise<void> => {
    try {
      if (options.flushAll) {
        await this.redis.delete(this.redisKey(currentRefreshToken.id));
      } else {
        await this.redis.deleteValueInArray(this.redisKey(currentRefreshToken.id), currentRefreshToken.refreshKey);
      }
    } catch (e) {
      throw e;
    }
  };
}
