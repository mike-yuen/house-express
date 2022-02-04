import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import randtoken from 'rand-token';
import SparkMD5 from 'spark-md5';

import { IAuthService } from '@/core/application/auth';
import { IRedisService } from '@/core/application/redis';
import { IUserInputDTO, IUserOutputDTO, IUserRepository } from '@/core/domainService/user';
import config from '@/crossCutting/config';
import { NotFoundResponse, UnauthorizedResponse } from '@/crossCutting/responseHandler/httpResponse';
import { UserRepository } from '@/infrastructure/database/repositories/user';
import { inject, provideSingleton } from '@/infrastructure/ioc';
import { MailerService } from '@/infrastructure/mailer/service';
import { RedisService } from '@/infrastructure/redis/service';
import createPokerUser from '@/ui/gRPC/client';

import { REDIS_SUFFIX } from './constants';

@provideSingleton(AuthService)
export class AuthService implements IAuthService {
  constructor(
    @inject(UserRepository) private readonly userRepository: IUserRepository,
    @inject(RedisService) private redis: IRedisService,
    @inject(MailerService) private mailer: MailerService,
  ) {}

  private redisKey = (email: string) => {
    return `user:${email}:${REDIS_SUFFIX.refreshToken}`;
  };

  private generateToken(user: IUserOutputDTO) {
    // this.logger.silly(`Sign JWT for userId: ${user._id}`);
    return jwt.sign(
      {
        id: user.id, // Will use this in the middleware 'getToken'
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

  public async signUp(userInputDTO: IUserInputDTO): Promise<{ user: IUserOutputDTO }> {
    try {
      // const user = await this.userRepository.findOne({ email }, {}, {});
      const salt = randomBytes(32);
      const hashedPassword = await argon2.hash(userInputDTO.password, { salt });
      const hashAvatar = SparkMD5.hash(userInputDTO.email);
      const avatar = `https://www.gravatar.com/avatar/${hashAvatar}?d=identicon`;
      const verificationCode = Math.floor(100000 + Math.random() * 900000);

      const user = await this.userRepository.create({
        ...userInputDTO,
        salt: salt.toString('hex'),
        password: hashedPassword,
        avatar,
        active: false,
        verificationCode,
      });

      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');
      Reflect.deleteProperty(user, 'friendIds');
      Reflect.deleteProperty(user, 'verificationCode');

      // this.logger.silly('Sending welcome email');
      this.mailer.sendEmailVerification(user.email, verificationCode);
      // this.eventDispatcher.dispatch(events.user.signUp, { user });

      return { user };
    } catch (e) {
      if (e.code === 11000) {
        throw new NotFoundResponse('Duplicate key in database', { statusCode: 11000 });
      }
      throw new NotFoundResponse(e.message);
    }
  }

  public async signIn(
    email: string,
    password: string,
  ): Promise<{ user: IUserOutputDTO; token: string; refreshToken: string }> {
    try {
      const user = await this.userRepository.findOne({ email }, {}, {});

      if (!user.active) {
        throw new NotFoundResponse('This account is not active. Please active your email first.');
      }

      /* We use verify from argon2 to prevent 'timing based' attacks */
      const validPassword = await argon2.verify(user.password, password);

      if (validPassword) {
        const token = this.generateToken(user);

        const refreshKey = randtoken.uid(256);
        await this.redis.setArray(this.redisKey(user.email), [refreshKey]);

        const refreshToken = this.generateRefreshToken(user, refreshKey);

        Reflect.deleteProperty(user, 'password');
        Reflect.deleteProperty(user, 'salt');
        Reflect.deleteProperty(user, 'friendIds');
        Reflect.deleteProperty(user, 'verificationCode');
        return { user, token, refreshToken };
      } else {
        throw new NotFoundResponse('Invalid Password! Please check your password and try again.');
      }
    } catch (e) {
      throw new NotFoundResponse(e.message);
    }
  }

  public async verifyEmail(email: string, code: string): Promise<{ user: IUserOutputDTO }> {
    try {
      const user = await this.userRepository.findOne({ email }, {}, {});

      const active = user.verificationCode.toString() === code;

      if (active) {
        await this.userRepository.updateOne({ email }, { active: true }, {});
        user.active = true;

        Reflect.deleteProperty(user, 'password');
        Reflect.deleteProperty(user, 'salt');
        Reflect.deleteProperty(user, 'friendIds');
        Reflect.deleteProperty(user, 'verificationCode');

        createPokerUser(user);
        return { user };
      } else {
        throw new NotFoundResponse('Invalid verification code.');
      }
    } catch (e) {
      throw new NotFoundResponse(e.message);
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

  public SignOut = async (refreshToken: any, options: any): Promise<void> => {
    try {
      if (options.flushAll) {
        await this.redis.delete(this.redisKey(refreshToken.id));
      } else {
        await this.redis.deleteValueInArray(this.redisKey(refreshToken.id), refreshToken.refreshKey);
      }
    } catch (e) {
      throw e;
    }
  };
}
