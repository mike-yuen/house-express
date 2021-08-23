import { Document } from 'mongoose';

import { User } from '@/core/domainModel/user';
import { IUserRepository } from '@/core/domainService/user';
import UserModel from '@/infrastructure/database/models/user';
import { provideSingleton } from '@/infrastructure/ioc';

import { BaseRepository } from './_base';
import { IUserInputDTO, IUserOutputDTO } from '@/core/application/user';

export type InputUserModel = User & Document;
export type OutputUserModel = User & Document;

@provideSingleton(UserRepository)
export class UserRepository extends BaseRepository<InputUserModel, OutputUserModel> implements IUserRepository {
  public constructor() {
    super(UserModel);
  }
}
