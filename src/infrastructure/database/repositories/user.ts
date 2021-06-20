import { Document } from 'mongoose';

import { User } from '@/core/domainModel/user/User';
import { IUserRepository } from '@/core/domainService/user/repository';
import UserModel from '@/infrastructure/database/models/user';
import { provideSingleton } from '@/infrastructure/ioc';

import { BaseRepository } from './_base';

@provideSingleton(UserRepository)
export default class UserRepository extends BaseRepository<User & Document> implements IUserRepository {
  constructor() {
    super(UserModel);
  }
}
