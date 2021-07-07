import { Document } from 'mongoose';

import { User } from '@/core/domainModel/user/User';
import { IUserRepository } from '@/core/domainService/user/repository';
import UserModel from '@/infrastructure/database/models/user';
import { provideSingleton } from '@/infrastructure/ioc';

import { BaseRepository } from './_base';
import { IUserInputDTO, IUserOutputDTO } from '@/core/application/user/dto';

export type InputUserModel = User & Document;
export type OutputUserModel = User & Document;

@provideSingleton(UserRepository)
export class UserRepository extends BaseRepository<InputUserModel, OutputUserModel> implements IUserRepository {
  public constructor() {
    super(UserModel);
  }
}
