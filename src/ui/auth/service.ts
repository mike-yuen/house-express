import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import randtoken from 'rand-token';

import { IUserInputDTO, IUserOutputDTO, IUserRepository } from '@/core/domainService/user';
import config from '@/crossCutting/config';
import { UserRepository } from '@/infrastructure/database/repositories/user';
import { inject, provideSingleton } from '@/infrastructure/ioc';
import { RedisService } from '@/infrastructure/redis';

import { REDIS_SUFFIX } from './constants';
import { IAuthService } from '@/core/application/auth';
import IRedisService from '@/infrastructure/redis/interface';
// import MailerService from './mailer';

@provideSingleton(AuthService)
export class AuthService implements IAuthService {
  constructor(
    @inject(UserRepository) private readonly userRepository: IUserRepository,
    @inject(RedisService) private redis: IRedisService,
  ) {}

  private redisKey = (username: string) => {
    return `user:${username}:${REDIS_SUFFIX.refreshToken}`;
  };

  private generateToken(user: IUserOutputDTO) {
    // this.logger.silly(`Sign JWT for userId: ${user._id}`);
    return jwt.sign(
      {
        id: user.id, // Will use this in the middleware 'getToken'
        username: user.username,
        role: user.role,
      },
      config.jwtSecret,
      { expiresIn: '1d' },
    );
  }

  private generateRefreshToken(user: IUserOutputDTO, key: string) {
    // this.logger.silly(`Generate refresh token JWT for userId: ${user._id}`);
    return jwt.sign(
      {
        id: user.id,
        refreshKey: key,
      },
      config.jwtSecret,
      { expiresIn: '7d' },
    );
  }

  public async signUp(userInputDTO: IUserInputDTO): Promise<{ user: IUserOutputDTO; token: string }> {
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
      // this.eventDispatcher.dispatch(events.user.signUp, { user });

      return { user: user, token };
    } catch (e) {
      throw new Error(e.message);
    }
  }

  public async signIn(
    emailOrUsername: string,
    password: string,
  ): Promise<{ user: IUserOutputDTO; token: string; refreshToken: string }> {
    try {
      const user = await this.userRepository.findOne({ email: emailOrUsername }, {}, {});

      /* We use verify from argon2 to prevent 'timing based' attacks */
      // this.logger.silly('Checking password');
      const validPassword = await argon2.verify(user.password, password);

      if (validPassword) {
        // this.logger.silly('Password is valid!');
        // this.logger.silly('Generating JWT');
        const token = this.generateToken(user);

        const refreshKey = randtoken.uid(256);
        await this.redis.setArray(this.redisKey(user.username), [refreshKey]);

        const refreshToken = this.generateRefreshToken(user, refreshKey);

        Reflect.deleteProperty(user, 'password');
        Reflect.deleteProperty(user, 'salt');
        return { user, token, refreshToken };
      } else {
        throw new Error('Invalid Password! Please check your password and try again.');
      }
    } catch (e) {
      throw new Error(e.message);
    }
  }

  // public RefreshToken = async (currentRefreshToken): Promise<{ token: string; refreshToken: string }> => {
  //   try {
  //     const refreshKeyList = await this.redis.getArray(this.redisKey(currentRefreshToken.id));

  //     if (refreshKeyList.includes(currentRefreshToken.refreshKey)) {
  //       const user = await this.userRepository.findOne({ _id: currentRefreshToken.id });

  //       const token = this.generateToken(user);
  //       const refreshKey = randtoken.uid(256);

  //       await this.redis.deleteValueInArray(this.redisKey(user.id), currentRefreshToken.refreshKey);
  //       await this.redis.setArray(this.redisKey(user.id), [refreshKey]);

  //       const refreshToken = this.generateRefreshToken(user, refreshKey);

  //       return { token, refreshToken };
  //     } else {
  //       throw new NotFoundResponse('Refresh token not existing! Please check your token and try again.');
  //     }
  //   } catch (e) {
  //     throw e;
  //   }
  // };

  // public SignOut = async (currentRefreshToken, options): Promise<void> => {
  //   try {
  //     if (options.flushAll) {
  //       await this.redis.delete(this.redisKey(currentRefreshToken.id));
  //     } else {
  //       await this.redis.deleteValueInArray(this.redisKey(currentRefreshToken.id), currentRefreshToken.refreshKey);
  //     }
  //   } catch (e) {
  //     throw e;
  //   }
  // };
}
