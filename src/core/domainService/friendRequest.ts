import mongoose from 'mongoose';

import { FRIEND_REQUEST_STATUS } from '@/core/domainModel/friendRequest';

import { IBaseRepository } from './_base';

export interface IFriendRequestInputDTO {
  requestUserId: mongoose.Types.ObjectId;
  recipientUserId: mongoose.Types.ObjectId;
  status: FRIEND_REQUEST_STATUS;
}

export interface IFriendRequestOutputDTO {
  readonly id: string;
  requestUserId: string;
  recipientUserId: string;
  status: FRIEND_REQUEST_STATUS;
}

export type IFriendRequestRepository = IBaseRepository<IFriendRequestInputDTO, IFriendRequestOutputDTO>;
