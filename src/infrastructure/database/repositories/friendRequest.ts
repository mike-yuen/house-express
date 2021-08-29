import { Document } from 'mongoose';

import { FriendRequest } from '@/core/domainModel/friendRequest';
import { IFriendRequestRepository } from '@/core/domainService/friendRequest';
import FriendRequestModel from '@/infrastructure/database/models/friendRequest';
import { provideSingleton } from '@/infrastructure/ioc';

import { BaseRepository } from './_base';

export type InputFriendRequestModel = FriendRequest & Document;
export type OutputFriendRequestModel = FriendRequest & Document;

@provideSingleton(FriendRequestRepository)
export class FriendRequestRepository
  extends BaseRepository<InputFriendRequestModel, OutputFriendRequestModel>
  implements IFriendRequestRepository {
  public constructor() {
    super(FriendRequestModel as any);
  }
}
