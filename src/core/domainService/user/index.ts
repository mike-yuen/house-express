import { User } from '@/core/domainModel/user/User';

import { IBaseRepository, Query } from '../_base/repository';

export interface IUserRepository extends IBaseRepository<User> {
  findOneByQueryAndUpdate(query: Query<{ [key: string]: any }>, update: { [key: string]: any }): Promise<User>;
}
