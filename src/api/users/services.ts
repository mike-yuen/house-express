import { Service, Inject } from 'typedi';
import { Logger } from 'winston';

import { REDIS_SUFFIX } from '@/api/auth/constants';
import RedisService from '@/http/redis';

import { IUserOutputDTO } from './interfaces';
import UserRepository from './repositories';

// import MailerService from './mailer';
@Service()
export default class UserService {
  constructor(
    // private mailer: MailerService,
    private readonly userRepository: UserRepository,
    @Inject('logger') private logger: Logger,
    @Inject('redis') private redis: RedisService,
  ) {}

  public getUserById = async (userId: string): Promise<{ user: IUserOutputDTO }> => {
    try {
      const user = await this.userRepository.findOne({ _id: userId });
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');

      return { user };
    } catch (e) {
      throw e;
    }
  };
}
