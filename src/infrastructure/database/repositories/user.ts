import { Document } from 'mongoose';

import { User } from '@/core/domainModel/user/User';
import { IUserRepository } from '@/core/domainService/user/repository';
import UserModel from '@/infrastructure/database/models/user';
import { provideSingleton } from '@/infrastructure/ioc';

import { BaseRepository } from './_base';

export type UserModel = User & Document;

@provideSingleton(UserRepository)
export class UserRepository extends BaseRepository<UserModel> implements IUserRepository {
  public constructor() {
    super(UserModel);
  }
}
