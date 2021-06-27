// import { REDIS_SUFFIX } from '@/ui/auth/constants';
// import RedisService from '@/crossCutting/redis';

import { IUserOutputDTO } from './interface';
import { UserRepository } from '@/infrastructure/database/repositories/user';
import { inject, provideSingleton } from '@/infrastructure/ioc';
import { IUserService } from '@/core/application/user/service';
import { IUserRepository } from '@/core/domainService/user/repository';
import { User } from '@/core/domainModel/user/User';

// import MailerService from './mailer';
@provideSingleton(UserService)
export class UserService implements IUserService {
  constructor(@inject(UserRepository) private readonly userRepository: IUserRepository) {}

  public async getAll(): Promise<any[]> {
    return this.userRepository.find({}, {}, {});
  }

  // public getUserById = async (userId: string): Promise<{ user: IUserOutputDTO }> => {
  //   try {
  //     const user = await this.userRepository.findOne({ _id: userId });
  //     Reflect.deleteProperty(user, 'password');
  //     Reflect.deleteProperty(user, 'salt');

  //     return { user };
  //   } catch (e) {
  //     throw e;
  //   }
  // };
}
