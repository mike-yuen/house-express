// import { REDIS_SUFFIX } from '@/ui/auth/constants';
// import RedisService from '@/crossCutting/redis';

import { IUserOutputDTO } from '@/core/application/user/dto';
import { IUserService } from '@/core/application/user/service';
import { IUserRepository } from '@/core/domainService/user/repository';
import { UserRepository } from '@/infrastructure/database/repositories/user';
import { inject, provideSingleton } from '@/infrastructure/ioc';

// import MailerService from './mailer';
@provideSingleton(UserService)
export class UserService implements IUserService {
  constructor(@inject(UserRepository) private readonly userRepository: IUserRepository) {}

  public async getAll(): Promise<IUserOutputDTO[]> {
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
